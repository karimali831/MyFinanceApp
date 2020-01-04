import * as React from 'react';
import IncomeSummary from '../IncomeSummary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import UpcomingPayments from '../UpcomingPayments';
import { ISpendingSummary } from '../../../models/ISpending';
import { DateFrequency } from '../../../enums/DateFrequency';
import { Loader } from '../../base/Loader';
import { LoadSpendingSummaryAction } from '../../../state/contexts/landing/Actions';
import DateFilter from '../utils/DateFilterConnected'

export interface IPropsFromState {
    spendingSummary: ISpendingSummary[],
    fuelIn: number,
    totalSpent: number,
    frequency: string,
    interval: number,
    loading: boolean,
    fromDate: string | null,
    toDate: string | null,
    showSecondCatSummary: string | null,
    location: string
}

export interface IPropsFromDispatch {
    loadSpendingSummary: typeof LoadSpendingSummaryAction.creator
}

type AllProps = IPropsFromState & IPropsFromDispatch;


export default class SpendingSummary extends React.Component<AllProps> {


    // public componentDidMount() {
    //     const dateFilter: IDateFilter = {
    //         frequency: DateFrequency[this.props.frequency],
    //         interval: this.props.interval,
    //         fromDateRange: this.props.fromDate,
    //         toDateRange: this.props.toDate
    //     }

    //     this.props.loadSpendingSummary(dateFilter);
    // }

    // public componentDidUpdate(prevProps: AllProps) {
    //     if (DateFrequency[prevProps.frequency] !== DateFrequency.DateRange && (
    //         prevProps.frequency !== this.state.frequency || 
    //         prevProps.interval !== this.state.interval)) {
    //             this.loadSummary();
    //     }
    //     else if ((
    //         this.state.fromDate != null && this.state.toDate != null) && 
    //         prevState.fromDate !== this.state.fromDate ||
    //         prevState.toDate !== this.state.toDate) {
    //             this.loadSummary();
    //     }
    // }

    // private loadSummary = () => {
    //     const dateFilter: IDateFilter = {
    //         frequency: DateFrequency[this.state.frequency],
    //         interval: this.state.interval,
    //         fromDateRange: this.state.fromDate,
    //         toDateRange: this.state.toDate
    //     }

    //     api.summary(dateFilter)
    //         .then(response => this.loadSummarySuccess(response.spendingSummary, response.fuelIn, response.totalSpent));
    // }

    // private loadSummarySuccess = (spendingSummary: ISpendingSummary[], fuelIn: number, totalSpent: number) => {
    //     this.setState({ ...this.state,
    //         ...{ 
    //             loading: false, 
    //             spendingSummary: spendingSummary,
    //             fuelIn: fuelIn,
    //             totalSpent: totalSpent
    //         }
    //     }) 
    // }

    
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
                                    <Link to={`spending/${s.catId}/${DateFrequency[this.props.frequency]}/${this.props.interval}/${s.isFinance}/false/${this.props.fromDate}/${this.props.toDate}`}> {s.cat1}</Link>
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
                                                            <div key={key2}>    
                                                                <Link to={`spending/${c.secondCatId}/${DateFrequency[this.props.frequency]}/${this.props.interval}/${s.isFinance}/true/${this.props.fromDate}/${this.props.toDate}`}> {c.cat2}</Link> £{c.totalSpent}
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
                <IncomeSummary />
                <UpcomingPayments />
            </div>
        )
    }

    private showSecondCatSummary = (category: string) => {
        this.setState({ ...this.state, showSecondCatSummary: this.props.showSecondCatSummary === category ? null : category })
    }
}