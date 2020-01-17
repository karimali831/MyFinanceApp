import * as React from 'react';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DateFilter from './DateFilterISConnected'
import { IIncomeSummary } from '../../../../models/IIncome';
import { Loader } from '../../../base/Loader';
import { IDateFilter } from 'src/models/IDateFilter';
import { ShowSecondCategoryIncomeSummaryAction } from 'src/state/contexts/landing/Actions';
import { CategoryType } from 'src/enums/CategoryType';
import SummaryList from '../SummaryList';

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
    showSecondCategory: (secondCat: string) => ShowSecondCategoryIncomeSummaryAction
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
                    <SummaryList<IIncomeSummary>
                        showSecondCategory={this.props.showSecondCategory}
                        showSecondCatSummary={this.props.showSecondCatSummary}
                        categoryType={this.props.categoryType}
                        filteredResults={this.props.incomeSummary}
                        dateFilter={this.props.dateFilter}
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