import * as React from 'react';
import { api } from '../Api/Api'
import { Loader } from './Loader';
import { ISpendingSummary } from '../Models/ISpending';

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
            return <Loader />
        }

        const summary = this.state.spendingSummary;

        return (
            <table className="table" style={{width: '35%'}}>
                <thead className="thead-light">
                    <tr>
                        <th scope="col" colSpan={2}>
                            Spendings Summary in the last
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
                        <th scope="row">Total Fuel Cost</th>
                        <td>
                            £{summary.totalFuelCost} <i><small> (<strong>van:</strong> £{summary.totalFuelCostByType[0]} <strong>gti:</strong> £{summary.totalFuelCostByType[1]} <strong>rcz:</strong> £{summary.totalFuelCostByType[2]})</small></i>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Total Food Cost</th>
                        <td>£{summary.totalFoodCost}</td>
                    </tr>
                </tbody>
            </table>
        )
    }
}