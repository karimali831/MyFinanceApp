import * as React from 'react'
import { IDateFilter } from 'src/models/IDateFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, IconDefinition, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { CategoryType } from 'src/enums/CategoryType';
import { SummaryFilteredList, incomeExpenseByCategoryChartUrl } from '../utils/Utils';
import { DateFrequency } from 'src/enums/DateFrequency';
import { IBaseModel } from 'src/models/ISummaryBaseModel';

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
    showSecondCategory: (secondCat: string) => void
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
                                    <a href={incomeExpenseByCategoryChartUrl(this.props.categoryType, s.catId, (s.isFinance ?  "Finance" : "Category"),  DateFrequency[this.props.dateFilter.frequency], this.props.dateFilter.interval)}>
                                        <FontAwesomeIcon icon={faChartBar} /> 
                                    </a>
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
                                                                <a href={incomeExpenseByCategoryChartUrl(this.props.categoryType, c.secondCatId, "Subcategory", DateFrequency[this.props.dateFilter.frequency], this.props.dateFilter.interval)}>
                                                                    <FontAwesomeIcon icon={faChartBar} /> 
                                                                </a>
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

    private seeAllCats = () => {
        this.setState({ ...this.state,
            ...{ 
                showAllCats: !this.state.showAllCats
            }
        }) 
    }
}

