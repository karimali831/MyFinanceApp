import * as React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { ChartType } from 'src/enums/ChartType';
import { IChartModel } from '../../models/IChart';
import { ChartOptions } from 'chart.js';
import DateFilter from '../dateFilter/DateFilter';
import { IDateFilter } from 'src/models/IDateFilter';
import { DataType } from 'src/enums/DataType';
import { IMonthComparisonChartRequest } from 'src/api/Api';
import { ICategory } from 'src/models/ICategory';
import { IFinance } from 'src/models/IFinance';
import { CategoryType } from 'src/enums/CategoryType';
import { ChartFilter } from './ChartFilter';

interface IOwnState {
	loading: boolean,
	categories: ICategory[],
	finances: IFinance[],
	catId?: number | null
}
 
interface IOwnProps {
	headerTitle?: string
	chartType: ChartType,
	chart: IChartModel,
	width: number,
	height: number,
	dateFilter: IDateFilter,
	categoryType?: CategoryType,
	dataType: DataType,
	secondTypeId?: number,
	selectedCat?: number,
	selectedSecondCat?: number,
	request?: IMonthComparisonChartRequest,
	chartChanged?: (request: IMonthComparisonChartRequest) => void
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

	public componentDidUpdate(prevProps: IOwnProps, prevState: IOwnState) {
		if (this.props.chartChanged) {

			if (JSON.stringify(this.props.dateFilter) !== JSON.stringify(prevProps.dateFilter) && this.props.request) {
				if (this.props.request.catId) {
					if (this.props.request.isFinance) {
						this.props.chartChanged(this.chartByCategoryRequest(this.props.dateFilter, this.props.request.catId, undefined, true))
					} else {
						this.props.chartChanged(this.chartByCategoryRequest(this.props.dateFilter, this.props.request.catId, this.props.request.secondCatId, false))
					} 
				} else {
					this.props.chartChanged(this.chartByCategoryRequest(this.props.dateFilter))
				}
			
			} else {
				if (prevState.catId !== this.state.catId && this.state.catId) {
					this.props.chartChanged(this.chartByCategoryRequest(this.props.dateFilter, this.state.catId, undefined, true))
				}
	
				if (prevProps.secondTypeId !== this.props.secondTypeId || prevProps.selectedCat !== this.props.selectedCat) {
					if (this.props.selectedCat) {
						this.props.chartChanged(this.chartByCategoryRequest(this.props.dateFilter, this.props.selectedCat, undefined, false))
					}
				}
	
				if (prevProps.selectedSecondCat !== this.props.selectedSecondCat) {
					this.props.chartChanged(this.chartByCategoryRequest(this.props.dateFilter, this.props.selectedCat, this.props.selectedSecondCat, false));
				}
			}
		}
	}

    public render() {
        return (
            <div id="summary-chart">
				<h3>{this.props.headerTitle}</h3>
				<div className="container">	
					<div className="row">
						<div className="col-sm-4">
							<DateFilter 
								dateFilter={this.props.dateFilter} 
								dataType={this.props.dataType}
								dateFilterChanged={this.props.dateFilterChanged} />
						</div>
						<div className="col-sm-4">	
							<span className="label label-default">Select DS1</span>
							{
								this.props.chartChanged ?
									<ChartFilter 
										categoryType={this.props.categoryType} 
										request={this.props.request} />
								: null
							}
						</div>
						<div className="col-sm-4">	
							<span className="label label-default">Concatenate DS1</span>
							{
								this.props.chartChanged ?
									<ChartFilter categoryType={this.props.categoryType} request={this.props.request} />
								: null
							}
						</div>
					</div>
				</div>
				{this.chart()}
            </div>
        );
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
				return <Doughnut data={this.props.chart} width={this.props.width} height={this.props.height} options={this.chartOptions()} />;
			case ChartType.Bar: 
				return <Bar data={this.props.chart} width={this.props.width} height={this.props.height} options={this.chartOptions()} />;
			default:
				return "";
		}
	}
}



