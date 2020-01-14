import * as React from 'react'
import { IDateFilter } from 'src/models/IDateFilter';
import { CategoryType } from 'src/enums/CategoryType';
import DateFilter from '../utils/DateFilter';
import { DateFilterChangeAction, } from 'src/state/contexts/common/Actions';
import { DateFrequency } from 'src/enums/DateFrequency';

export interface IPropsFromState {
    dateFilter: IDateFilter,
    categoryType: CategoryType,
    selectedFrequency: DateFrequency
}

export interface IPropsFromDispatch {
    dateFilterChanged: (filter: IDateFilter, category: CategoryType) => DateFilterChangeAction,
}

type AllProps = IPropsFromState & IPropsFromDispatch

const DateFilterForSummary: React.SFC<AllProps> = (props) =>
    <DateFilter<CategoryType>
        categoryType={props.categoryType}
        selectedFrequency={props.selectedFrequency}
        dateFilter={props.dateFilter}
        dateFilterChanged={props.dateFilterChanged}
    />

export default DateFilterForSummary;