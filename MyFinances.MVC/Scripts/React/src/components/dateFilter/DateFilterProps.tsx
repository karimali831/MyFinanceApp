import * as React from 'react'
import { IDateFilter } from 'src/models/IDateFilter';
import { CategoryType } from 'src/enums/CategoryType';
import { DateFilterChangeAction, } from 'src/state/contexts/common/Actions';
import DateFilter from './DateFilter';

export interface IPropsFromState {
    dateFilter: IDateFilter,
    categoryType: CategoryType,
    selectedFrequency: string
}

export interface IPropsFromDispatch {
    dateFilterChanged: (filter: IDateFilter, category: CategoryType) => DateFilterChangeAction
}

type AllProps = IPropsFromState & IPropsFromDispatch

const DateFilterProps: React.SFC<AllProps> = (props) =>
    <DateFilter
        categoryType={props.categoryType}
        selectedFrequency={props.selectedFrequency}
        dateFilter={props.dateFilter}
        dateFilterChanged={props.dateFilterChanged}
    />

export default DateFilterProps