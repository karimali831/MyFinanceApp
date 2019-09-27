import * as React from 'react';
import { api } from '../Api/Api'
import { Loader } from './Loader';
import { ISpendingSummary } from '../Models/ISpending';
import { DateFrequency } from '../Enums/DateFrequency';
import IncomeSummary from './IncomeSummary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { cleanText } from './Utils';
import { Link } from "react-router-dom";
import UpcomingPayments from './UpcomingPayments';

interface IOwnProps {
}

export interface IOwnState {
    spendingSummary: ISpendingSummary[],
    fuelIn: number,
    totalSpent: number,
    frequency: string,
    interval: number,
    loading: boolean,
    showSecondCatSummary: string | null
}

export default class SpendingSummary extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            spendingSummary: [],
            fuelIn: 0,
            totalSpent: 0,
            frequency: DateFrequency[DateFrequency.Today],
            interval: 1,
            loading: true,
            showSecondCatSummary: null
        };
    }

    public componentDidMount() {
        this.loadSummary();
    }

    public componentDidUpdate(prevProps: IOwnProps, prevState: IOwnState) {
        if (prevState.frequency !== this.state.frequency || prevState.interval !== this.state.interval) {
            this.loadSummary();
        }
    }

    private loadSummary = () => {
        api.summary(DateFrequency[this.state.frequency], this.state.interval)
            .then(response => this.loadSummarySuccess(response.spendingSummary, response.fuelIn, response.totalSpent));
    }

    private loadSummarySuccess = (spendingSummary: ISpendingSummary[], fuelIn: number, totalSpent: number) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                spendingSummary: spendingSummary,
                fuelIn: fuelIn,
                totalSpent: totalSpent
            }
        }) 
    }

    private onChangeSelectedFrequency = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state, frequency: DateFrequency[e.target.value] })
    }

    private onChangeSelectedInterval = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state, interval: Number(e.target.value) })
    }

    private showSecondCatSummary = (category: string) => {
        this.setState({ ...this.state, showSecondCatSummary: this.state.showSecondCatSummary === category ? null : category })
    }

    render() {
        if (this.state.loading) {
            return <Loader text="Loading spending summary..." />
        }
        return (
            <div>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col" colSpan={2}>
                                Spendings breakdown summary for
                                <div className="form-group" style={{width: 'auto'}}>
                                    <select onChange={(e) => this.onChangeSelectedFrequency(e)} className="form-control">
                                    {
                                        Object.keys(DateFrequency).filter(o => !isNaN(o as any)).map(key => 
                                            <option value={key} selected={this.state.frequency == DateFrequency[key]}>
                                                {cleanText(DateFrequency[key])}
                                            </option>
                                        )
                                    }
                                    </select>
                                    {
                                        this.state.frequency.toString().includes("Last")?
                                            <select onChange={(e) => this.onChangeSelectedInterval(e)} className="form-control">
                                            {
                                                Array.from(Array(30), (e, i) => {
                                                    return <option value={i+1}>X = {i+1}</option>
                                                })
                                            }
                                            </select>
                                        : null
                                    }
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.fuelIn !== 0 ? 
                                <tr>
                                    <th scope="row"><FontAwesomeIcon icon={faArrowUp} /> Fuel In</th>
                                    <td>
                                        £{this.state.fuelIn}
                                    </td>
                                </tr>
                            : null
                        }
                        {this.state.spendingSummary.map(s => 
                            <tr>
                                <th scope="row">
                                    <FontAwesomeIcon icon={faArrowDown} /> 
                                    <Link to={`spending/${s.catId}/${DateFrequency[this.state.frequency]}/${this.state.interval}/${s.isFinance}/false`}> {s.cat1}</Link>
                                </th>
                                <td>
                                    {s.secondCats != null ? 
                                        <div onClick={() => this.showSecondCatSummary(s.cat1)}>
                                            <FontAwesomeIcon icon={faSearch} /> £{s.totalSpent}
                                            {this.state.showSecondCatSummary === s.cat1 ? 
                                            <>
                                                <br />
                                                <small>
                                                    <i> 
                                                        {s.secondCats.map(c =>   
                                                            <div>    
                                                                <Link to={`spending/${c.secondCatId}/${DateFrequency[this.state.frequency]}/${this.state.interval}/${s.isFinance}/true`}> {c.cat2}</Link> £{c.totalSpent}
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
                            <td>£{this.state.totalSpent}</td>
                        </tr>
                    </tbody>
                </table>
                <IncomeSummary />
                <UpcomingPayments />
            </div>
        )
    }
}