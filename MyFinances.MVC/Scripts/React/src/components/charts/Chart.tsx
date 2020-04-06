import * as React from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { ChartType, ChartDataType } from 'src/enums/ChartType';
import { IChartModel, IChartSummary } from '../../models/IChart';
import { ChartOptions } from 'chart.js';
import DateFilter from '../dateFilter/DateFilter';
import { IDateFilter } from 'src/models/IDateFilter';
import { DataType } from 'src/enums/DataType';
import { api, IMonthComparisonChartRequest } from 'src/Api/Api';
import { ICategory } from 'src/models/ICategory';
import { IFinance } from 'src/models/IFinance';
import SelectionRefinementForChartCategories from './SelectionRefinementForChartCategories';
import { CategoryType } from 'src/enums/CategoryType';
import { Load } from '../base/Loader';

interface IOwnState {
	loading: boolean,
	categories: ICategory[],
	finances: IFinance[],
	catId?: number | null
}
 
interface IOwnProps {
	loading: boolean,
	chartSummary?: IChartSummary | null,
	chartType: ChartType,
	chart: IChartModel,
	width: number,
	height: number,
	dateFilter: IDateFilter,
	categoryType?: CategoryType,
	dataType: DataType,
	chartDataType: ChartDataType,
	secondTypeId?: number,
	selectedCat?: number,
	selectedSecondCat?: number,
	request?: IMonthComparisonChartRequest,
	chartChanged?: (request: IMonthComparisonChartRequest, chartDataType: ChartDataType) => void
	dateFilterChanged: (filter: IDateFilter, dataType: DataType) => void
}

export class Chart extends React.Component<IOwnProps, IOwnState> {

	constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            loading: true,
			categories: [],
			finances: [],
			catId: this.props.request !== undefined && this.props.request.isFinance ? this.props.request.catId : undefined
        };
    }

	public componentDidMount() {
		this.loadFinances();
	}

	public componentDidUpdate(prevProps: IOwnProps, prevState: IOwnState) {
		if (this.props.chartChanged) {

			if (JSON.stringify(this.props.dateFilter) !== JSON.stringify(prevProps.dateFilter) && this.props.request) {
				if (this.props.request.catId) {
					if (this.props.request.isFinance) {
						this.props.chartChanged(this.chartByCategoryRequest(this.props.dateFilter, this.props.request.catId, undefined, true), this.props.chartDataType)
					} else {
						this.props.chartChanged(this.chartByCategoryRequest(this.props.dateFilter, this.props.request.catId, this.props.request.secondCatId, false), this.props.chartDataType)
					} 
				} else {
					this.props.chartChanged(this.chartByCategoryRequest(this.props.dateFilter), this.props.chartDataType)
				}
			
			} else {
				if (prevState.catId !== this.state.catId && this.state.catId) {
					this.props.chartChanged(this.chartByCategoryRequest(this.props.dateFilter, this.state.catId, undefined, true), this.props.chartDataType)
				}
	
				if (prevProps.secondTypeId !== this.props.secondTypeId || prevProps.selectedCat !== this.props.selectedCat) {
					if (this.props.selectedCat) {
						this.props.chartChanged(this.chartByCategoryRequest(this.props.dateFilter, this.props.selectedCat, undefined, false), this.props.chartDataType)
					}
				}
	
				if (prevProps.selectedSecondCat !== this.props.selectedSecondCat) {
					this.props.chartChanged(this.chartByCategoryRequest(this.props.dateFilter, this.props.selectedCat, this.props.selectedSecondCat, false), this.props.chartDataType);
				}
			}
		}
	}

    public render() {
		const summary = this.props.chartSummary;

		if (this.state.loading || this.props.loading) {
            return <Load text="Loading..."/>
        }

        return (
            <div id="summary-chart">
				{summary ? 
				<>
					<div className="card-group">
						<div className="card">
							<div className="card-body">
							<h5 className="card-title">{summary.titleDs1}</h5>
								<p className="card-text">
									{summary.averagedDailyDs1} <br />
									{summary.averagedMonthlyDs1}
								</p>
							</div>
							<div className="card-footer">
							<small className="text-muted">{summary.totalSpentDs1}</small>
							</div>
						</div>
						{summary.titleDs2 ? 
						<>
							<div className="card">
								<div className="card-body">
								<h5 className="card-title">{summary.titleDs2}</h5>
									<p className="card-text">
										{summary.averagedDailyDs2} <br />
										{summary.averagedMonthlyDs2}
									</p>
								</div>
								<div className="card-footer">
								<small className="text-muted">{summary.totalSpentDs2}</small>
								</div>
							</div>
						</>
						: null }
					</div>
				</> : null}
				<DateFilter 
					dateFilter={this.props.dateFilter} 
					dataType={this.props.dataType}
					dateFilterChanged={this.props.dateFilterChanged} />
					{
						this.props.chartChanged ?
							<>
							{this.props.categoryType === CategoryType.Spendings	?			
								<div className="form-group form-group-lg">
									<select onChange={(e) => this.onChangeSelectedFinance(e)}  id="finances" className="form-control">
										<option value={"undefined"}>-- select finance --</option>
										{
											this.state.finances.map(f => 
												<option key={f.id} value={f.id} selected={f.id === this.state.catId}>{f.name}</option>      
											)
										}
									</select>
								</div>
							: null }
							
							{(this.state.catId === undefined || this.state.catId === 0) && this.props.categoryType !== undefined ? 
								<div className="form-group form-group-lg">
									<SelectionRefinementForChartCategories />
								</div>
							: null}
						</>
					: null}
				<div style={{width: "100%", height: this.props.height}}>
					{this.chart()}
				</div>
            </div>
        );
	}

	private loadFinances = () => {
        api.finances()
            .then(response => this.loadFinancesSuccess(response.finances));
	}
	
	private loadFinancesSuccess = (finances: IFinance[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                finances: finances.filter(x => x.manualPayment === false)
            }
        }) 
	}
	
	private onChangeSelectedFinance = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const financeId = e.target.value;
        this.setState({ ...this.state,
            ...{
                catId: financeId === "undefined" ? undefined : Number(e.target.value)
            }
        })
    }

	private chartByCategoryRequest = (dateFilter: IDateFilter, catId?: number, secondCatId?: number, isFinance?: boolean) : IMonthComparisonChartRequest => {
        const request: IMonthComparisonChartRequest = {
			dateFilter: dateFilter,
            catId: catId,
            secondCatId: secondCatId,
			isFinance: isFinance,
			categoryType: this.props.categoryType
        }

        return request;
	}
	
	private chartOptions = () => {
		const options: ChartOptions = {
			responsive: true,
    		maintainAspectRatio: false,
			scales: {
				yAxes: [{
				  ticks: {
					beginAtZero: true
				  }
				}]
			}
		}
		
		return options;
	}
	
	private chart = () => {
		switch (this.props.chartType) {
			case ChartType.Doughnut: 
				return <Doughnut data={this.props.chart} options={this.chartOptions()} />;
			case ChartType.Bar: 
				return <Bar data={this.props.chart} options={this.chartOptions()} />;
			case ChartType.Line: 
				return <Line data={this.props.chart} options={this.chartOptions()} />;
			default:
				return "";
		}
	}
}



