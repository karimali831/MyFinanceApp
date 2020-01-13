import { ISpendingSummary } from "../../../models/ISpending";
import { CategoryType } from 'src/enums/CategoryType';

export default interface ISpendingSummaryState {
    spendingSummary: ISpendingSummary[],
    fuelIn: number,
    totalSpent: number,
    loading: boolean,
    showSecondCatSummary: string | null,
    categoryType: CategoryType
}
export class SpendingSummaryState {

    public static readonly intialState = {
        spendingSummary: [],
        fuelIn: 0,
        totalSpent: 0,
        loading: true,
        showSecondCatSummary: null,
        categoryType: CategoryType.Spendings
    }
}

