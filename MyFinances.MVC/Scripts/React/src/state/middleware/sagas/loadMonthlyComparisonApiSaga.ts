import { api, IMonthComparisonChartRequest } from '../../../api/Api'
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { ReportErrorAction } from '../../contexts/error/Actions';
import { LoadNotificationsFailureAction } from '../../contexts/landing/Actions';
import { IMonthComparisonChart } from 'src/models/IMonthComparisonChart';
import { ChartDataType } from 'src/enums/ChartType';
import { ChartActionTypes, LoadExpensesByCategorySuccessAction, LoadIncomesByCategorySuccessAction } from 'src/state/contexts/chart/Actions';
import { spendingSummaryDateFilter, incomeSummaryDateFilter } from 'src/state/contexts/landing/Selectors';

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
            case ChartDataType.IncomeExpenseSummary:
                apiSubUrl = "incomes/chart"
                dateFilter = yield select(incomeSummaryDateFilter);
            case ChartDataType.IncomeSummaryByCategory:
                apiSubUrl = "finances/chart/incomeexpense"
                dateFilter = yield select(incomeSummaryDateFilter);
            default:
                apiSubUrl = ""
        }

        const request: IMonthComparisonChartRequest = {
            filter: dateFilter
        }

        // Start the API call asynchronously
        const result: IMonthComparisonChart[] = yield call(api.monthlyComparison, request, apiSubUrl);

        // Create an action to dispatch on success with the returned entity from API & Dispatch the new action with Redux
        switch (type) {
            case ChartDataType.SpendingSummaryByCategory:
                yield put(new LoadExpensesByCategorySuccessAction(result))
            case ChartDataType.IncomeExpenseSummary:
                yield put(new LoadIncomesByCategorySuccessAction(result))
            case ChartDataType.IncomeSummaryByCategory:
                yield put(new LoadIncomesByCategorySuccessAction(result))

        }
        
    } catch (e) {

        // Dispatch a failure action to Redux
        yield put(new LoadNotificationsFailureAction(e.message));
        yield put(new ReportErrorAction(e.message));
        return;
    }
}