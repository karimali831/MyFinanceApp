import { IIncomeSummary } from 'src/models/IIncome';
import { CategoryType } from 'src/enums/CategoryType';

export default interface IIncomeSummaryState {
    incomeSummary: IIncomeSummary[],
    totalIncome: number,
    loading: boolean,
    showSecondCatSummary: string | null,
    categoryType: CategoryType
}

export class IncomeSummaryState {
    public static readonly intialState = {
        incomeSummary: [],
        totalIncome: 0,
        loading: true,
        showSecondCatSummary: null,
        categoryType: CategoryType.Income
    }
}