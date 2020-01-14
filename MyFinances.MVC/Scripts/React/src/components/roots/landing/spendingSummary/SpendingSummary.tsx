import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { ISpendingSummary } from '../../../../models/ISpending';
import { DateFrequency } from '../../../../enums/DateFrequency';
import { Loader } from '../../../base/Loader';
import { LoadSpendingSummaryAction } from '../../../../state/contexts/landing/Actions';
import DateFilter from './DateFilterSSConnected'
import { IDateFilter } from 'src/models/IDateFilter';
import { CategoryType } from 'src/enums/CategoryType';

export interface IPropsFromState {
    dateFilter?: IDateFilter | undefined,
    spendingSummary: ISpendingSummary[],
    fuelIn: number,
    totalSpent: number,
    loading: boolean,
    showSecondCatSummary: string | null,
    location: string,
    categoryType: CategoryType
}

export interface IPropsFromDispatch {
    loadSpendingSummary: typeof LoadSpendingSummaryAction.creator
}

type AllProps = IPropsFromState & IPropsFromDispatch;

export default class SpendingSummary extends React.Component<AllProps> {
    
    public render() {
        if (this.props.loading) {
            return <Loader text="Loading spending summary..." />
        }

        return (
            <div>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col" colSpan={2}>
                                Spendings breakdown summary for
                                <DateFilter />
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
                        {this.props.spendingSummary && this.props.spendingSummary.map((s, key) => 
                            <tr key={key}>
                                <th scope="row">
                                    <FontAwesomeIcon icon={faArrowDown} /> 
                                    {
                                        this.props.dateFilter !== undefined ?    
                                            <Link to={`spending/${s.catId}/${DateFrequency[this.props.dateFilter.frequency]}/${this.props.dateFilter.interval}/${s.isFinance}/false/${this.props.dateFilter.fromDateRange}/${this.props.dateFilter.toDateRange}`}> {s.cat1}</Link>
                                        : null
                                    }
                                </th>
                                <td>
                                    {s.secondCats !== null ? 
                                        <div onClick={() => this.showSecondCatSummary(s.cat1)}>
                                            <FontAwesomeIcon icon={faSearch} /> £{s.totalSpent}
                                            {this.props.showSecondCatSummary === s.cat1 ? 
                                            <>
                                                <br />
                                                <small>
                                                    <i> 
                                                        {s.secondCats.map((c, key2) =>   
                                                            <div key={key2}>                            {
                                                               this.props.dateFilter !== null && this.props.dateFilter !== undefined ?
                                                                    <> 
                                                                        <Link to={`spending/${c.secondCatId}/${DateFrequency[this.props.dateFilter.frequency]}/${this.props.dateFilter.interval}/${s.isFinance}/true/${this.props.dateFilter.fromDateRange}/${this.props.dateFilter.toDateRange}`}> {c.cat2}</Link> £{c.totalSpent}
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
                                     : "£"+s.totalSpent}
                                </td>
                            </tr>
                        )}
                        <tr>
                            <th scope="row"><FontAwesomeIcon icon={faArrowDown} /> Total Spent</th>
                            <td>£{this.props.totalSpent}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    private showSecondCatSummary = (category: string) => {
        this.setState({ ...this.state, showSecondCatSummary: this.props.showSecondCatSummary === category ? null : category })
    }
}