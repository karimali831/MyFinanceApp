import { put, takeLatest, select } from "redux-saga/effects";
import { CommonActionTypes, DateFilterChangeAction } from 'src/state/contexts/common/Actions';
import { LoadSpendingSummaryAction, LoadIncomeSummaryAction, SpendingSummaryDateFilterChangeAction, IncomeSummaryDateFilterChangeAction } from 'src/state/contexts/landing/Actions';
import { getMonthComparisonChartRequest } from 'src/state/contexts/chart/Selectors';
import { DataType } from 'src/enums/DataType';
import { ChartDataType } from 'src/enums/ChartType';
import { LoadIncomesByCategoryChartAction, LoadExpensesByCategoryChartAction, LoadIncomeExpenseChartAction } from 'src/state/contexts/chart/Actions';

export function* dateFilterWatchSaga() {
    yield takeLatest(CommonActionTypes.DateFilterChange, dateFilterChange)
}

export function* dateFilterChange(action: DateFilterChangeAction) {

    const chartRequest = yield select(getMonthComparisonChartRequest, action.filter);

    if (action.dataType === DataType.IncomeSummary) {
        yield put(new LoadIncomeSummaryAction(action.filter));
        yield put(new IncomeSummaryDateFilterChangeAction(action.filter))
    } 
    else if (action.dataType === DataType.SpendingSummary ) {
        yield put(new LoadSpendingSummaryAction(action.filter));
        yield put(new SpendingSummaryDateFilterChangeAction(action.filter))
    }

    switch (action.chartDataType) {
        case ChartDataType.IncomeSummary:
            yield put(new LoadIncomeSummaryAction(chartRequest))
            break;

        case ChartDataType.SpendingSummary:
            yield put(new LoadIncomesByCategoryChartAction(chartRequest))
            break;

        case ChartDataType.SpendingSummaryByCategory:
            yield put(new LoadExpensesByCategoryChartAction(chartRequest))
            break;

        case ChartDataType.IncomeExpenseSummary:
            yield put(new LoadIncomeExpenseChartAction(chartRequest))
            break;

        case ChartDataType.IncomeSummaryByCategory:
            yield put(new LoadIncomesByCategoryChartAction(chartRequest))
            break;

    }
}