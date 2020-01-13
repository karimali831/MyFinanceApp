import { IDateFilter } from 'src/models/IDateFilter';
import { CategoryType } from 'src/enums/CategoryType';
import { DateFrequency } from 'src/enums/DateFrequency';
import { monthNames } from 'src/components/roots/utils/Utils';

export default interface ICommonState {
    spendingSummaryDateFilter: IDateFilter,
    incomeSummaryDateFilter: IDateFilter,
    dateFilter?: IDateFilter,
    categoryType?: CategoryType,
    loading: boolean
}

export const spendingSummaryDateFilter: IDateFilter = {
    frequency: DateFrequency.Today,
    interval: 1,
    fromDateRange: null,
    toDateRange: null
}


export const incomeSummaryDateFilter: IDateFilter = {
    frequency: DateFrequency[monthNames[new Date().getMonth()]],
    interval: 1,
    fromDateRange: null,
    toDateRange: null
}

export class CommonState {
    public static readonly intialState = {
        spendingSummaryDateFilter: spendingSummaryDateFilter,
        incomeSummaryDateFilter: incomeSummaryDateFilter,
        dateFilter: undefined,
        categoryType: undefined,
        loading: false
    }
}