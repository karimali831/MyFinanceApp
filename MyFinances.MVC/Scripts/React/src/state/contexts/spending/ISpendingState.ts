import { DateFrequency } from "../../../enums/DateFrequency";
import { ISpending } from "../../../models/ISpending";

export default interface ISpendingState {
    spendings: ISpending[],
    loading: boolean,
    catId: number | null,
    frequency: DateFrequency | null,
    interval: number | null,
    fromDate: string | null,
    toDate: string | null,
    isFinance: boolean,
    isSecondCat: boolean
}

export class SpendingState {
    public static readonly intialState = {
        loading: true,
        spendings: [],
        catId: null,
        frequency: null,
        fromDate: null,
        toDate: null,
        interval: null,
        isFinance: false,
        isSecondCat: false
    }
}
