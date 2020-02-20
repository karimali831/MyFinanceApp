import { IMonthComparisonChart } from 'src/models/IMonthComparisonChart';

export default interface IChartState {
    incomeExpenseComparisonChart: IMonthComparisonChart[],
    incomeCategoryComparisonChart: IMonthComparisonChart[],
    expenseCategoryComparisonChart: IMonthComparisonChart[]
}

export class ChartState {
    public static readonly intialState = {
        incomeExpenseComparisonChart: [],
        incomeCategoryComparisonChart: [],
        expenseCategoryComparisonChart: []
    }
}