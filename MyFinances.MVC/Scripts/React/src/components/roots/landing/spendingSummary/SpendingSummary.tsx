import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { ISpendingSummary } from '../../../../models/ISpending';
import { Load } from '../../../base/Loader';
import { ShowSecondCategorySpendingSummaryAction } from '../../../../state/contexts/landing/Actions';

import { IDateFilter } from 'src/models/IDateFilter';
import { CategoryType } from 'src/enums/CategoryType';
import SummaryList from '../SummaryList';
import { spendingSummaryChartUrl, } from '../../utils/Utils';
import { DateFrequency } from 'src/enums/DateFrequency';
import DateFilter from './DateFilterSSConnected';

export interface IPropsFromState {
    dateFilter: IDateFilter,
    spendingSummary: ISpendingSummary[],
    fuelIn: number,
    totalSpent: number,
    loading: boolean,
    showSecondCatSummary: string | null,
    location: string,
    categoryType: CategoryType
}

export interface IOwnState {
    catId?: number | undefined,
    type?: string | undefined
}

export interface IPropsFromDispatch {
    showSecondCategory: (secondCat: string ) => ShowSecondCategorySpendingSummaryAction,
}

type AllProps = IPropsFromState & IPropsFromDispatch;

export default class SpendingSummary extends React.Component<AllProps, IOwnState> {
    
    constructor(props: AllProps) {
        super(props);

        this.state = {
            catId: undefined,
            type: undefined
        };
    }

    public componentDidUpdate(prevProps: AllProps, prevState: IOwnState) {
        if (JSON.stringify(prevProps.dateFilter) !== JSON.stringify(this.props.dateFilter)) {
            this.resetCatState();
        }
    }

    public render() {
        if (this.props.loading) {
            return <Load text="Loading spending summary..." />
        }

        let results;
        if (this.state.catId !== undefined && this.state.type !== undefined) {
            if (this.state.type === "Subcategory") {
                results = this.props.spendingSummary.filter(s => s.isFinance === false && s.secondCats !== null && s.secondCats.some((o) => o.secondCatId === this.state.catId))
            } else if (this.state.type === "Category") {
                results = this.props.spendingSummary.filter(s => s.isFinance === false && s.catId === this.state.catId)
            } else if (this.state.type === "Finance") {
                results = this.props.spendingSummary.filter(s => s.isFinance === true && s.catId === this.state.catId)
            } else {
                results = this.props.spendingSummary
            }
        } else {
            results = this.props.spendingSummary;
        }

        return (
            <div>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col" colSpan={2}>
                                <a href={spendingSummaryChartUrl(DateFrequency[this.props.dateFilter.frequency], this.props.dateFilter.interval)}>
                                    <FontAwesomeIcon icon={faChartPie} /> Spendings breakdown summary for
                                </a>
                                <DateFilter />
                                {
                                    this.props.spendingSummary.length === 0 ? null :
                                    <>
                                        <select onChange={(e) => this.onChangeSelectedFrequency(e)}  id="categories" className="form-control">
                                            <option value={undefined}>-- select category --</option>
                                            {
                                                this.props.spendingSummary.some(s => s.isFinance) ?
                                                    <optgroup label="Finances">
                                                        {
                                                            this.props.spendingSummary.filter(s => s.isFinance).map(c => 
                                                                <option key={"F"+c.catId} value={"Finance" + "-" + c.catId} selected={this.state.type === "Finance" && c.catId === this.state.catId}>{c.cat1}</option>      
                                                            )
                                                        }
                                                    </optgroup>
                                                : null 
                                            }
                                            {
                                                this.props.spendingSummary.some(s => !s.isFinance) ?                 
                                                    <optgroup label="Categories">
                                                    {
                                                        this.props.spendingSummary.filter(s => !s.isFinance).map((c, key) => {
                                                            return (
                                                                <>
                                                                    <option key={"C"+c.catId} value={"Category" + "-" + c.catId} selected={this.state.type === "Category" && c.catId === this.state.catId} className={c.secondCats !== null ? "optionGroup" : ""}>{c.cat1}</option>      
                                                                    {
                                    
                                                                        c.secondCats !== null && c.secondCats.map(s => 
                                                                            <option key={"S"+s.secondCatId} selected={this.state.type === "Subcategory" && s.secondCatId === this.state.catId} value={"Subcategory" + "-" + s.secondCatId} className="optionChild">- {s.cat2}</option>     
                                                                        )
                                                                    }
                                                                </>
                                                            )}
                                                        )
                                                    }
                                                    </optgroup>
                                                : null
                                            }
                                        </select>
                                    </>
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
                            categoryType={this.props.categoryType}
                            filteredResults={results}
                            dateFilter={this.props.dateFilter}
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

    private resetCatState = () => {
        this.setState({ ...this.state,
            ...{
                catId: undefined,
                type: undefined
            }
        })
    }

    private onChangeSelectedFrequency = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const id = value.split("-", 2);
        
        this.setState({ ...this.state,
            ...{
                catId: Number(id[1]),
                type: id[0]
            }
        })
    }
}