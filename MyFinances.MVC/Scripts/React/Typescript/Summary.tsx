import * as React from 'react';
import { api } from '../Api/Api'
import { Loader } from './Loader';
import { ISpendingSummary } from '../Models/ISpending';
import IncomeSummary from './IncomeSummary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

interface IOwnProps {
}

export interface IOwnState {
    spendingSummary: ISpendingSummary,
    fuelIn: number,
    daysPeriod: number,
    loading: boolean,
    showSecondCatSummary: string | null
}

export default class SpendingSummary extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            spendingSummary: undefined,
            fuelIn: 0,
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
            .then(response => this.loadSummarySuccess(response.spendingSummary, response.fuelIn));
    }

    private loadSummarySuccess = (spendingSummary: ISpendingSummary, fuelIn: number) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                spendingSummary: spendingSummary,
                fuelIn: fuelIn
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
                        {this.state.spendingSummary.firstCats.map(s => 
                            <tr>
                                <th scope="row"><FontAwesomeIcon icon={faArrowDown} /> {s.cat1}</th>
                                <td>£{s.totalSpent}</td>
                            </tr>
                        )}
                        {this.state.spendingSummary.secondCats.map(s => 
                            <tr>
                                <th scope="row"><FontAwesomeIcon icon={faArrowDown} /> {s.category}</th>
                                <td> 
                                    <div onClick={() => this.showSecondCatSummary(s.category)}>
                                        <FontAwesomeIcon icon={faSearch} /> £{s.totalSpent}
                                        {this.state.showSecondCatSummary === s.category ? 
                                        <>
                                            <br />
                                            <small>
                                                <i> 
                                                    {s.secondCats.map(c =>   
                                                        <div>            
                                                            <strong>{c.cat2}</strong> {c.totalSpent}
                                                        </div>
                                                    )}
                                                </i>
                                            </small>
                                        </>
                                        : null}
                                    </div>
                                </td>
                            </tr>
                        )}
                        <tr>
                            <th scope="row"><FontAwesomeIcon icon={faArrowDown} /> Total Spent</th>
                            <td>£{this.state.spendingSummary.totalSpent}</td>
                        </tr>
                    </tbody>
                </table>
                <IncomeSummary />
            </div>
        )
    }
}