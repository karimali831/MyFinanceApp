import * as React from 'react';
import { api } from '../Api/Api'
import { Loader } from './Loader';
import { IIncomeSummary } from '../Models/IIncome';

interface IOwnProps {
}

export interface IOwnState {
    incomeSummary: IIncomeSummary,
    monthPeriod: number,
    loading: boolean
}

export default class IncomeSummary extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            incomeSummary: undefined,
            monthPeriod: -1,
            loading: true
        };
    }

    public componentDidMount() {
        this.loadSummary();
    }

    public componentDidUpdate(prevProps: IOwnProps, prevState: IOwnState) {
        if (prevState.monthPeriod !== this.state.monthPeriod) {
            this.loadSummary();
        }
    }

    private loadSummary = () => {
        api.incomeSummary(this.state.monthPeriod)
            .then(response => this.loadSummarySuccess(response.incomeSummary));
    }

    private loadSummarySuccess = (incomeSummary: IIncomeSummary) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                incomeSummary: incomeSummary
            }
        }) 
    }

    private onChangeSelectedIncomesMonthPeriod = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state, monthPeriod: Number(e.target.value) })
    }

    render() {
        if (this.state.loading) {
            return <Loader text="Loading income summary..." />
        }

        const summary = this.state.incomeSummary;

        return (
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col" colSpan={2}>
                            Income summary in the last
                            <div className="form-group">
                                <select onChange={(e) => this.onChangeSelectedIncomesMonthPeriod(e)} className="form-control">
                                    <option value="-1" selected>1 month</option>
                                    <option value="-2">2 months</option>
                                    <option value="-3">3 months</option>
                                </select>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">Total Income</th>
                        <td>£{summary.totalIncome}</td>
                    </tr>
                    <tr>
                        <th scope="row">CWTL Income</th>
                        <td>£{summary.incomeCWTL}</td>
                    </tr>
                    <tr>
                        <th scope="row">UberEats</th>
                        <td>£{summary.incomeUberEats}</td>
                    </tr>
                    <tr>
                        <th scope="row">SB</th>
                        <td>£{summary.incomeSB}</td>
                    </tr>
                </tbody>
            </table>
        )
    }
}