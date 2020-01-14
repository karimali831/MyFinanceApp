import * as React from 'react';
import { faArrowUp, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DateFilter from './DateFilterISConnected'
import { Link } from "react-router-dom";
import { IIncomeSummary } from '../../../../models/IIncome';
import { DateFrequency } from '../../../../enums/DateFrequency';
import { Loader } from '../../../base/Loader';
import { IDateFilter } from 'src/models/IDateFilter';
import { LoadIncomeSummaryAction } from 'src/state/contexts/landing/Actions';
import { CategoryType } from 'src/enums/CategoryType';

export interface IPropsFromState {
    dateFilter?: IDateFilter | undefined,
    incomeSummary: IIncomeSummary[],
    totalIncome: number,
    loading: boolean,
    showSecondCatSummary: string | null,
    categoryType: CategoryType,
    location: string
}

export interface IPropsFromDispatch {
    loadIncomeSummary: typeof LoadIncomeSummaryAction.creator
}

type AllProps = IPropsFromState & IPropsFromDispatch;

export default class IncomeSummary extends React.Component<AllProps> {

    public render() {
        if (this.props.loading) {
            return <Loader text="Loading income summary..." />
        }
        
        return (
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col" colSpan={2}>
                            Income breakdown summary for
                            <DateFilter />

                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.incomeSummary && this.props.incomeSummary.map((s, key) => 
                        <tr key={key}>
                            <th scope="row">
                                <FontAwesomeIcon icon={faArrowUp} />
                                {
                                    this.props.dateFilter !== undefined ? 
                                    <Link to={`income/${s.sourceId}/${DateFrequency[this.props.dateFilter.frequency]}/${this.props.dateFilter.interval}`}> {s.source}</Link>
                                    : null
                                }
                            </th>
                            <td>
                                {s.secondCats !== null ? 
                                    <div onClick={() => this.showSecondCatSummary(s.source)}>
                                        <FontAwesomeIcon icon={faSearch} /> £{s.totalIncome}
                                        {this.props.showSecondCatSummary === s.source ? 
                                        <>
                                            <br />
                                            <small>
                                                <i> 
                                                    {s.secondCats.map((c, key2) =>   
                                                        <div key={key2}>            
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
                        <td>£{this.props.totalIncome}</td>
                    </tr>
                </tbody>
            </table>
        )
    }


    private showSecondCatSummary = (category: string) => {
        this.setState({ ...this.state, showSecondCatSummary: this.props.showSecondCatSummary === category ? null : category })
    }
}