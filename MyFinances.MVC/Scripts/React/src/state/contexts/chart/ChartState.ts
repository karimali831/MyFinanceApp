
import { IMonthComparisonChartRequest, IMonthComparisonChartResponse } from 'src/api/Api';
import { ChartDataType } from 'src/enums/ChartType';

export default interface IChartState {
    request?: IMonthComparisonChartRequest | undefined,
    type?: ChartDataType | undefined,
    incomeExpenseComparisonChart?: IMonthComparisonChartResponse | undefined,
    incomeCategoryComparisonChart?: IMonthComparisonChartResponse | undefined,
    expenseCategoryComparisonChart?: IMonthComparisonChartResponse | undefined,
    financesComparisonChart?: IMonthComparisonChartResponse | undefined
}

export class ChartState {
    public static readonly intialState = {
        request: undefined,
        ChartDataType: undefined,
        incomeExpenseComparisonChart: undefined,
        incomeCategoryComparisonChart: undefined,
        expenseCategoryComparisonChart: undefined
    }
}