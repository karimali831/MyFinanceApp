import * as React from 'react';
import { api } from '../Api/Api'
import { Loader } from './Loader';
import { ISpendingSummary } from '../Models/ISpending';
import IncomeSummary from './IncomeSummary';

interface IOwnProps {
}

export interface IOwnState {
    spendingSummary: ISpendingSummary
    daysPeriod: number,
    loading: boolean
}

export default class SpendingSummary extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            spendingSummary: undefined,
            daysPeriod: -1,
            loading: true
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
            .then(response => this.loadSummarySuccess(response.spendingSummary));
    }

    private loadSummarySuccess = (spendingSummary: ISpendingSummary) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                spendingSummary: spendingSummary
            }
        }) 
    }

    private onChangeSelectedDaysPeriod = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state, daysPeriod: Number(e.target.value) })
    }

    render() {
        if (this.state.loading) {
            return <Loader text="Loading spending summary..." />
        }

        const summary = this.state.spendingSummary;

        return (
            <div>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col" colSpan={2}>
                                Spendings breakdown summary in the last
                                <div className="form-group">
                                    <select onChange={(e) => this.onChangeSelectedDaysPeriod(e)} className="form-control">
                                        <option value="-1" selected>24 hours</option>
                                        <option value="-7">7 days</option>
                                        <option value="-30">30 days</option>
                                    </select>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">Total Spent</th>
                            <td>£{summary.totalSpent}</td>
                        </tr>
                        <tr>
                            <th scope="row">Fuel Cost</th>
                            <td>
                                £{summary.fuelCost} <i><small> (<strong>van:</strong> £{summary.fuelCostByType[0]} <strong>gti:</strong> £{summary.fuelCostByType[1]} <strong>rcz:</strong> £{summary.fuelCostByType[2]})</small></i>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Food Cost</th>
                            <td>£{summary.foodCost}</td>
                        </tr>
                        <tr>
                            <th scope="row">Interest & Fees</th>
                            <td>£{summary.interestAndFees} <i><small>(<strong>od fees:</strong> £{summary.overdraftFees})</small></i></td>
                        </tr>
                    </tbody>
                </table>
                <IncomeSummary />
            </div>
        )
    }
}