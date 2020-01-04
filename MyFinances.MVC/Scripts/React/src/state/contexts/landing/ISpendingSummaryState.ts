import { DateFrequency } from "../../../enums/DateFrequency";
import { ISpendingSummary } from "../../../models/ISpending";

export default interface ISpendingSummaryState {
    spendingSummary: ISpendingSummary[],
    fuelIn: number,
    totalSpent: number,
    frequency: DateFrequency,
    interval: number,
    loading: boolean,
    fromDate: string | null,
    toDate: string | null,
    showSecondCatSummary: string | null
}

export class SpendingSummaryState {
    public static readonly intialState = {
        spendingSummary: [],
        fuelIn: 0,
        totalSpent: 0,
        frequency: DateFrequency.Today,
        interval: 1,
        loading: true,
        fromDate: null,
        toDate: null,
        showSecondCatSummary: null
    }
}

