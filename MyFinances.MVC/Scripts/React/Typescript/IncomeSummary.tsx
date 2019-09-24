import * as React from 'react';
import { api } from '../Api/Api'
import { Loader } from './Loader';
import { IIncomeSummary } from '../Models/IIncome';
import { faArrowUp, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cleanText, monthNames } from './Utils';
import { DateFrequency } from '../Enums/DateFrequency';
import { Link } from "react-router-dom";

interface IOwnProps {
}

export interface IOwnState {
    incomeSummary: IIncomeSummary[],
    totalIncome: number,
    frequency: string,
    interval: number,
    loading: boolean,
    showSecondCatSummary: string | null
}

export default class IncomeSummary extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            incomeSummary: [],
            totalIncome: 0,
            frequency: monthNames[new Date().getMonth()],
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
        api.incomeSummary(DateFrequency[this.state.frequency], this.state.interval)
            .then(response => this.loadSummarySuccess(response.incomeSummary, response.totalIncome));
    }

    private loadSummarySuccess = (incomeSummary: IIncomeSummary[], totalIncome: number) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                incomeSummary: incomeSummary,
                totalIncome: totalIncome
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
            return <Loader text="Loading income summary..." />
        }
        
        return (
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col" colSpan={2}>
                            Income breakdown summary for
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
                    {this.state.incomeSummary.map(s => 
                        <tr>
                            <th scope="row">
                                <FontAwesomeIcon icon={faArrowUp} /> 
                                <Link to={`income/${s.sourceId}/${DateFrequency[this.state.frequency]}/${this.state.interval}`}> {s.source}</Link>
                            </th>
                            <td>
                                {s.secondCats != null ? 
                                    <div onClick={() => this.showSecondCatSummary(s.source)}>
                                        <FontAwesomeIcon icon={faSearch} /> £{s.totalIncome}
                                        {this.state.showSecondCatSummary === s.source ? 
                                        <>
                                            <br />
                                            <small>
                                                <i> 
                                                    {s.secondCats.map(c =>   
                                                        <div>            
                                                            <strong>{c.secondSource}</strong> £{c.totalIncome}
                                                        </div>
                                                    )}
                                                </i>
                                            </small>
                                        </>
                                        : null}
                                    </div>
                                    : "£"+s.totalIncome}
                            </td>
                        </tr>
                    )}
                    <tr>
                        <th scope="row"><FontAwesomeIcon icon={faArrowUp} /> Total Income</th>
                        <td>£{this.state.totalIncome}</td>
                    </tr>
                </tbody>
            </table>
        )
    }
}