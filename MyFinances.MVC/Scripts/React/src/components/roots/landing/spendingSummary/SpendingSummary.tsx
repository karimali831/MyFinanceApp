import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { ISpendingSummary } from '../../../../models/ISpending';
import { Loader } from '../../../base/Loader';
import { ShowSecondCategorySpendingSummaryAction } from '../../../../state/contexts/landing/Actions';
import DateFilter from './DateFilterSSConnected'
import { IDateFilter } from 'src/models/IDateFilter';
import { CategoryType } from 'src/enums/CategoryType';
import SummaryList from '../SummaryList';

export interface IPropsFromState {
    dateFilter?: IDateFilter | undefined,
    spendingSummary: ISpendingSummary[],
    fuelIn: number,
    totalSpent: number,
    loading: boolean,
    showSecondCatSummary: string | null,
    location: string,
    categoryType: CategoryType
}

export interface IPropsFromDispatch {
    showSecondCategory: (secondCat: string ) => ShowSecondCategorySpendingSummaryAction
}

type AllProps = IPropsFromState & IPropsFromDispatch;

export default class SpendingSummary extends React.Component<AllProps> {
    
    public render() {
        if (this.props.loading) {
            return <Loader text="Loading spending summary..." />
        }

        return (
            <div>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col" colSpan={2}>
                                Spendings breakdown summary for
                                <DateFilter />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.fuelIn !== 0 ? 
                                <tr>
                                    <th scope="row"><FontAwesomeIcon icon={faArrowUp} /> Fuel In</th>
                                    <td>
                                        £{this.props.fuelIn}
                                    </td>
                                </tr>
                            : null
                        }
                        <SummaryList<ISpendingSummary>
                            showSecondCategory={this.props.showSecondCategory}
                            showSecondCatSummary={this.props.showSecondCatSummary}
                            categoryType={this.props.categoryType}
                            filteredResults={this.props.spendingSummary}
                            dateFilter={this.props.dateFilter}
                        />
                        <tr>
                            <th scope="row"><FontAwesomeIcon icon={faArrowDown} /> Total Spent</th>
                            <td>£{this.props.totalSpent}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}