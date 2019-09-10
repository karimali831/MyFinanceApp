import * as React from 'react';
import { api } from '../Api/Api'
import { Loader } from './Loader';
import { ISpendingSummary } from '../Models/ISpending';
import IncomeSummary from './IncomeSummary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

interface IOwnProps {
}

export interface IOwnState {
    spendingSummary: ISpendingSummary[],
    fuelIn: number,
    totalSpent: number,
    daysPeriod: number,
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
            daysPeriod: 1,
            loading: true,
            showSecondCatSummary: null
        };
    }

    public componentDidMount() {
        this.loadSummary();
    }

    public componentDidUpdate(prevProps: IOwnProps, prevState: IOwnState) {
        if (prevState.daysPeriod !== this.state.daysPeriod) {
            this.loadSummary();
        }
    }

    private loadSummary = () => {
        api.summary(this.state.daysPeriod)
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

    private onChangeSelectedDaysPeriod = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state, daysPeriod: Number(e.target.value) })
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
                                Spendings breakdown summary in the last
                                <div className="form-group">
                                    <select onChange={(e) => this.onChangeSelectedDaysPeriod(e)} className="form-control">
                                        <option value="1" selected>1 day</option>
                                        <option value="7">7 days</option>
                                        <option value="30">30 days</option>
                                    </select>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row"><FontAwesomeIcon icon={faArrowUp} /> Fuel In</th>
                            <td>
                                £{this.state.fuelIn}
                            </td>
                        </tr>
                        {this.state.spendingSummary.map(s => 
                            <tr>
                                <th scope="row">
                                    <FontAwesomeIcon icon={faArrowDown} /> 
                                    <Link to={`spending/${s.cat1Id}/${this.state.daysPeriod}`}> {s.cat1}</Link>
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
                                                                <strong>{c.cat2}</strong> £{c.totalSpent}
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
            </div>
        )
    }
}