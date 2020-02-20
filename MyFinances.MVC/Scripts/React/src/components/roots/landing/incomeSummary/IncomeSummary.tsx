import * as React from 'react';
import { faArrowUp, faChartPie, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DateFilter from './connected/DateFilterISConnected'
import { IIncomeSummary } from '../../../../models/IIncome';
import { Load } from '../../../base/Loader';
import { IDateFilter } from 'src/models/IDateFilter';
import { ShowSecondCategoryIncomeSummaryAction } from 'src/state/contexts/landing/Actions';
import { CategoryType } from 'src/enums/CategoryType';
import SummaryList from '../SummaryList';
import { Link } from 'react-router-dom';
import { LoadIncomeExpenseAction } from 'src/state/contexts/chart/Actions';

export interface IPropsFromState {
    dateFilter: IDateFilter,
    incomeSummary: IIncomeSummary[],
    totalIncome: number,
    loading: boolean,
    showSecondCatSummary: string | null,
    categoryType: CategoryType,
    location: string
}

export interface IPropsFromDispatch {
    showSecondCategory: (secondCat: string) => ShowSecondCategoryIncomeSummaryAction
    loadIncomeExpense: (filter: IDateFilter) => LoadIncomeExpenseAction
}

type AllProps = IPropsFromState & IPropsFromDispatch;

export default class IncomeSummary extends React.Component<AllProps> {

    public render() {
        if (this.props.loading) {
            return <Load text="Loading income summary..." />
        }

        return (
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col" colSpan={2}>
                        
                            <span onClick={() => this.props.loadIncomeExpense(this.props.dateFilter)}>
                                <FontAwesomeIcon icon={faChartBar} /> Income and expenses summary chart
                            </span>
                           
                            <br />
                            <Link to={"/chart/incomesummary/"}> 
                                <FontAwesomeIcon icon={faChartPie} /> Income breakdown summary for
                            </Link>   
                            <DateFilter />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <SummaryList<IIncomeSummary>
                        showSecondCategory={this.props.showSecondCategory}
                        showSecondCatSummary={this.props.showSecondCatSummary}
                        categoryType={this.props.categoryType}
                        filteredResults={this.props.incomeSummary}
                        dateFilter={this.props.dateFilter}
                        icon={faArrowUp}
                    />
                    <tr>
                        <th scope="row"><FontAwesomeIcon icon={faArrowUp} /> Total Income</th>
                        <td>£{this.props.totalIncome}</td>
                    </tr>
                </tbody>
            </table>
        )
    }
}