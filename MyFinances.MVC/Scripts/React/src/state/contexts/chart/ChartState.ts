
import { IMonthComparisonChartRequest, IMonthComparisonChartResponse } from 'src/api/Api';

export default interface IChartState {
    request?: IMonthComparisonChartRequest | undefined,
    incomeExpenseComparisonChart?: IMonthComparisonChartResponse | undefined,
    incomeCategoryComparisonChart?: IMonthComparisonChartResponse | undefined,
    expenseCategoryComparisonChart?: IMonthComparisonChartResponse | undefined;
}

export class ChartState {
    public static readonly intialState = {
        request: undefined,
        incomeExpenseComparisonChart: undefined,
        incomeCategoryComparisonChart: undefined,
        expenseCategoryComparisonChart: undefined
    }
}