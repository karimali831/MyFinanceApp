import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faChartPie, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { ISpendingSummary } from '../../../../models/ISpending';
import { Load } from '../../../base/Loader';
import { ShowSecondCategorySpendingSummaryAction, FilterChangedAction } from '../../../../state/contexts/landing/Actions';
import { IDateFilter } from 'src/models/IDateFilter';
import { CategoryType } from 'src/enums/CategoryType';
import SummaryList from '../SummaryList';
import DateFilter from './connected/DateFilterSSConnected';
import SelectionRefinementForSpendingSummary from './connected/SelectionRefinementForSpendingSummaryConnected';
import { Link } from 'react-router-dom';
import { IMonthComparisonChartRequest } from 'src/api/Api';
import { ChartDataType } from 'src/enums/ChartType';
import { LoadChartAction } from 'src/state/contexts/chart/Actions';

export interface IPropsFromState {
    dateFilter: IDateFilter,
    spendingSummary: ISpendingSummary[],
    fuelIn: number,
    totalSpent: number,
    loading: boolean,
    showSecondCatSummary: string | null,
    location: string,
    categoryType: CategoryType,
    categoryFilter?: string | undefined
}

export interface IOwnState {}

export interface IPropsFromDispatch {
    showSecondCategory: (secondCat: string ) => ShowSecondCategorySpendingSummaryAction,
    resetCategoryFilter: (filter: string) => FilterChangedAction,
    loadChart: (request: IMonthComparisonChartRequest, chartDataType: ChartDataType) => LoadChartAction
}

type AllProps = IPropsFromState & IPropsFromDispatch;

export default class SpendingSummary extends React.Component<AllProps, IOwnState> {
    
    constructor(props: AllProps) {
        super(props);
        this.state = {

        };
    }

    public componentDidUpdate(prevProps: AllProps, prevState: IOwnState) {
        if (JSON.stringify(prevProps.dateFilter) !== JSON.stringify(this.props.dateFilter)) {
            this.props.resetCategoryFilter("");
        }
    }

    public render() {
        if (this.props.loading) {
            return <Load text="Loading spending summary..." />
        }

        const chartRequest: IMonthComparisonChartRequest = {
            dateFilter: this.props.dateFilter
        }

        let results;
        if (this.props.categoryFilter !== undefined && this.props.categoryFilter !== "") {
            results = this.props.spendingSummary
                .filter(s => this.props.categoryFilter && 
                    (s.cat1.toLowerCase().includes(this.props.categoryFilter.toLowerCase()) ||
                    (s.secondCats !== null && s.secondCats.some((o) => this.props.categoryFilter && o.cat2.toLowerCase().includes(this.props.categoryFilter.toLowerCase())))));
        } else {
            results = this.props.spendingSummary;
        }

        return (
            <div>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col" colSpan={2}>
                                <Link to={"/chart/finances/"} onClick={() => this.props.loadChart(chartRequest, ChartDataType.Finances)}>
                                    <FontAwesomeIcon icon={faChartLine} /> Finances breakdown chart
                                </Link>
                                <br />
                                <Link to={"/chart/spendingsummary/"}> 
                                    <FontAwesomeIcon icon={faChartPie} /> Spendings breakdown summary for
                                </Link>    
                                <DateFilter />
                                {
                                    this.props.spendingSummary.length <= 5 
                                        ? null 
                                        : <SelectionRefinementForSpendingSummary />
                                }
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.fuelIn !== 0 ? 
                                <tr>
                                    <th scope="row"><FontAwesomeIcon icon={faArrowUp} /> Fuel In</th>
                                    <td>
                                        £{this.props.fuelIn}
                                    </td>
                                </tr>
                            : null
                        }
                        <SummaryList<ISpendingSummary>
                            showSecondCategory={this.props.showSecondCategory}
                            showSecondCatSummary={this.props.showSecondCatSummary}
                            showChartByCategory={this.props.loadChart}
                            categoryType={this.props.categoryType}
                            filteredResults={results}
                            dateFilter={this.props.dateFilter}
                            chartDataType={ChartDataType.SpendingSummaryByCategory}
                            icon={faArrowDown}
                        />
                        <tr>
                            <th scope="row"><FontAwesomeIcon icon={faArrowDown} /> Total Spent</th>
                            <td>£{this.props.totalSpent}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}