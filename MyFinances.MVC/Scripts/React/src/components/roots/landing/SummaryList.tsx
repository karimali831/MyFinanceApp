import * as React from 'react'
import { IDateFilter } from 'src/models/IDateFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, IconDefinition, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { CategoryType } from 'src/enums/CategoryType';
import { SummaryFilteredList } from '../../utils/Utils';
import { IBaseModel } from 'src/models/ISummaryBaseModel';
import { IMonthComparisonChartRequest } from 'src/api/Api';

export interface IOwnState {
    showAllCats: boolean,
    limitSummaryCats: number
}

export interface IOwnProps<T> {
    dateFilter?: IDateFilter,
    showSecondCatSummary: string | null,
    categoryType: CategoryType,
    filteredResults: T[],
    icon: IconDefinition,
    showSecondCategory: (secondCat: string) => void,
    showChartByCategory: (request: IMonthComparisonChartRequest) => void
}

export default class SummaryList<T extends IBaseModel<T>> extends React.Component<IOwnProps<T>, IOwnState> {

    constructor(props: IOwnProps<T>) {
        super(props);
        this.state = {
            showAllCats: false,
            limitSummaryCats: 5
        };
    }

    public render() {
        const results = this.state.showAllCats ? this.props.filteredResults : this.props.filteredResults.slice(0, this.state.limitSummaryCats);
     
        return (
            <>
                {results && results.map((s, key) => 
                    <tr key={key}>
                        <th scope="row">
                            {
                                this.props.dateFilter !== undefined ?  
                                <>
                                    <Link to={"/chart/"+CategoryType[this.props.categoryType]+"/summary/" + s.catId + "/" + false} onClick={() => this.props.showChartByCategory(this.chartByCategoryRequest(s.catId, s.isFinance, this.props.dateFilter))}>
                                        <FontAwesomeIcon icon={faChartBar} /> 
                                    </Link>
                                    <Link to={SummaryFilteredList(this.props.categoryType, s.catId, this.props.dateFilter.frequency, this.props.dateFilter.interval, s.isFinance, false, this.props.dateFilter.fromDateRange, this.props.dateFilter.toDateRange)}> {s.cat1}</Link>    
                                </>
                                : null
                            }
                        </th>
                        <td>
                            {s.secondCats !== null ? 
                                <div onClick={() => this.props.showSecondCategory(s.cat1)}>
                                    <FontAwesomeIcon icon={faSearch} /> £{s.total}
                                    {this.props.showSecondCatSummary === s.cat1 ? 
                                    <>
                                        <br />
                                        <small>
                                            <i> 
                                                {s.secondCats.map((c, key2) => 
                                                    <div key={key2}>                            {
                                                    this.props.dateFilter !== null && this.props.dateFilter !== undefined ?
                                                            <> 
                                                                <Link to={"/chart/"+CategoryType[this.props.categoryType]+"/summary/" + c.secondCatId + "/" + true} onClick={() => this.props.showChartByCategory(this.chartByCategoryRequest(s.catId, false, this.props.dateFilter, c.secondCatId))}>
                                                                    <FontAwesomeIcon icon={faChartBar} /> 
                                                                </Link>
                                                                <Link to={SummaryFilteredList(this.props.categoryType, c.secondCatId, this.props.dateFilter.frequency, this.props.dateFilter.interval, s.isFinance, true, this.props.dateFilter.fromDateRange, this.props.dateFilter.toDateRange)}> {c.cat2}</Link> £{c.total}
                                                            </>
                                                        : null 
                                                        }
                                                    </div>
                                                )}
                                            </i>
                                        </small>
                                    </>
                                    : null}
                                </div>
                            : "£"+s.total}
                        </td>
                    </tr>
                    
                )}
                {
                    this.props.filteredResults.length > this.state.limitSummaryCats ?
                    <>
                        <tr>
                            <td colSpan={2} onClick={() => this.seeAllCats()}> 
                                <a><small>&nbsp;... show {this.state.showAllCats ? "less" : "all"}</small></a>
                            </td>
                        </tr>
                    </>
                    : null
                }
            </>
        )
    }

    private chartByCategoryRequest = (catId: number, isFinance: boolean, dateFilter?: IDateFilter, secondCatId?: number) : IMonthComparisonChartRequest => {
        const request: IMonthComparisonChartRequest = {
            catId: catId,
            secondCatId: secondCatId,
            dateFilter: dateFilter,
            isFinance: isFinance,
            categoryType: this.props.categoryType === CategoryType.Incomes ? CategoryType.IncomeSources : CategoryType.Spendings
        }

        return request;
    }

    private seeAllCats = () => {
        this.setState({ ...this.state,
            ...{ 
                showAllCats: !this.state.showAllCats
            }
        }) 
    }
}

