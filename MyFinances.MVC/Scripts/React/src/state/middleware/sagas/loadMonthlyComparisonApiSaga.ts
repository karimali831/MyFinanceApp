import { api, IMonthComparisonChartResponse } from '../../../api/Api'
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { ReportErrorAction } from '../../contexts/error/Actions';
import { ChartDataType } from 'src/enums/ChartType';
import { ChartActionTypes, LoadExpensesByCategorySuccessAction, LoadIncomesByCategorySuccessAction, LoadIncomeExpenseSuccessAction, LoadExpensesByCategoryFailureAction, LoadIncomeExpenseFailureAction, LoadIncomesByCategoryFailureAction } from 'src/state/contexts/chart/Actions';
import { spendingSummaryDateFilter, incomeSummaryDateFilter } from 'src/state/contexts/landing/Selectors';
import { getMonthComparisonChartRequest } from 'src/state/contexts/chart/Selectors';

export default function* loadMonthlyComparisonApiSaga() {
    yield takeLatest(ChartActionTypes.LoadIncomeExpense, loadMonthlyComparisonChart, ChartDataType.IncomeExpenseSummary);
    yield takeLatest(ChartActionTypes.LoadIncomesByCategory, loadMonthlyComparisonChart, ChartDataType.IncomeSummaryByCategory);
    yield takeLatest(ChartActionTypes.LoadExpensesByCategory, loadMonthlyComparisonChart, ChartDataType.SpendingSummaryByCategory);
}

export function* loadMonthlyComparisonChart(type: ChartDataType) {
    try {
        let apiSubUrl;
        let dateFilter;

        switch (type) {
            case ChartDataType.SpendingSummaryByCategory:
                apiSubUrl = "spendings/chart"
                dateFilter = yield select(spendingSummaryDateFilter);
                break;
            case ChartDataType.IncomeExpenseSummary:
                apiSubUrl = "finances/chart/incomeexpense"
                dateFilter = yield select(incomeSummaryDateFilter);
                break;
            case ChartDataType.IncomeSummaryByCategory:
                apiSubUrl = "incomes/chart"
                dateFilter = yield select(incomeSummaryDateFilter);
                break;
            default:
                apiSubUrl = ""
                break;
        }

        const request = yield select(getMonthComparisonChartRequest, dateFilter);

        // Start the API call asynchronously
        const result: IMonthComparisonChartResponse = yield call(api.monthlyComparison, request, apiSubUrl);

        // Create an action to dispatch on success with the returned entity from API & Dispatch the new action with Redux
        switch (type) {
            case ChartDataType.SpendingSummaryByCategory:
                yield put(new LoadExpensesByCategorySuccessAction(result))
                break;
            case ChartDataType.IncomeExpenseSummary:
                yield put(new LoadIncomeExpenseSuccessAction(result))
                break;
            case ChartDataType.IncomeSummaryByCategory:
                yield put(new LoadIncomesByCategorySuccessAction(result))
                break;

        }
        
    } catch (e) {

        // Dispatch a failure action to Redux
        switch (type) {
            case ChartDataType.SpendingSummaryByCategory:
                yield put(new LoadExpensesByCategoryFailureAction(e.message));
                break;
            case ChartDataType.IncomeExpenseSummary:
                yield put(new LoadIncomeExpenseFailureAction(e.message));
                break;
            case ChartDataType.IncomeSummaryByCategory:
                yield put(new LoadIncomesByCategoryFailureAction(e.message));
                break;
        }

        yield put(new ReportErrorAction(e.message));
        return;
    }
}