import { ISpendingSummary } from "../../../models/ISpending";
import { CategoryType } from 'src/enums/CategoryType';
import { IDateFilter } from 'src/models/IDateFilter';
import { DateFrequency } from 'src/enums/DateFrequency';

export default interface ISpendingSummaryState {
    spendingSummary: ISpendingSummary[],
    fuelIn: number,
    totalSpent: number,
    loading: boolean,
    showSecondCatSummary: string | null,
    categoryType: CategoryType,
    dateFilter: IDateFilter
}

export const spendingSummaryDateFilter: IDateFilter = {
    frequency: DateFrequency.Today,
    interval: 1,
    fromDateRange: null,
    toDateRange: null
}

export class SpendingSummaryState {

    public static readonly intialState = {
        spendingSummary: [],
        fuelIn: 0,
        totalSpent: 0,
        loading: false,
        showSecondCatSummary: null,
        categoryType: CategoryType.Spendings,
        dateFilter: spendingSummaryDateFilter
    }
}

