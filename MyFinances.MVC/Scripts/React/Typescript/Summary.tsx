import * as React from 'react';
import { api } from '../Api/Api'
import { Loader } from './Loader';
import { ISpendingSummary } from '../Models/ISpending';
import IncomeSummary from './IncomeSummary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface IOwnProps {
}

export interface IOwnState {
    spendingSummary: ISpendingSummary
    daysPeriod: number,
    loading: boolean,
    showFuelTypes: boolean,
    showInterestAndFeesTypes: boolean
}

export default class SpendingSummary extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            spendingSummary: undefined,
            daysPeriod: -1,
            loading: true,
            showFuelTypes: false,
            showInterestAndFeesTypes: false
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

    private showFuelTypes = () => {
        this.setState({ ...this.state, showFuelTypes: !this.state.showFuelTypes })
    }

    private showInterestAndFeesTypes = () => {
        this.setState({ ...this.state, showInterestAndFeesTypes: !this.state.showInterestAndFeesTypes })
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
                                <div onClick={() => this.showFuelTypes()}>
                                    <FontAwesomeIcon icon={faSearch} /> £{summary.fuelCost} 
                                    {this.state.showFuelTypes ? 
                                    <>
                                        <br />
                                        <small>
                                            <i>
                                                <strong>van:</strong> £{summary.fuelCostByType[0]} <br />
                                                <strong>gti:</strong> £{summary.fuelCostByType[1]} <br />
                                                <strong>rcz:</strong> £{summary.fuelCostByType[2]}
                                            </i>
                                        </small>
                                    </>
                                    : null}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Fuel In</th>
                            <td>
                                £{summary.fuelIn}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Foods & Drinks</th>
                            <td>£{summary.foodCost}</td>
                        </tr>
                        <tr>
                            <th scope="row">Interest & Fees</th>
                            <td>
                                <div onClick={() => this.showInterestAndFeesTypes()}>
                                    <FontAwesomeIcon icon={faSearch} /> £{summary.interestAndFees}               
                                    {this.state.showInterestAndFeesTypes ? 
                                    <>
                                        <br />
                                        <small>
                                            <i>
                                                <strong>overdrafts:</strong> £{summary.overdraftFees} <br />
                                                <strong>credit cards:</strong> £{summary.creditcardFees}
                                            </i>
                                        </small>
                                    </>
                                    : null}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <IncomeSummary />
            </div>
        )
    }
}