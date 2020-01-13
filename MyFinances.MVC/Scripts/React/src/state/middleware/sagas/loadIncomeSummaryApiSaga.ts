import { api, IIncomeSummaryResponse } from '../../../Api/Api'
import { select, call, put, takeLatest } from 'redux-saga/effects';
import { ReportErrorAction } from '../../contexts/error/Actions';
import { LandingSummaryActionTypes, LoadIncomeSummarySuccessAction, LoadIncomeSummaryFailureAction } from '../../contexts/landing/Actions';
import { IDateFilter } from '../../../models/IDateFilter';
import { getSelectedDateFilter, initialIncomeSummaryDateFilter } from 'src/state/contexts/landing/Selectors';

export default function* loadIncomeSummaryApiSaga() {
    yield takeLatest(LandingSummaryActionTypes.LoadIncomeSummary, loadIncomeSummary);
}

export function* loadIncomeSummary() {
    try {

        // Create Request object
        // selectors to access the state for call params
        const dateFilter = yield select(getSelectedDateFilter);
        const request: IDateFilter = dateFilter !== null ? dateFilter : yield select(initialIncomeSummaryDateFilter)

        // Start the API call asynchronously
        const result: IIncomeSummaryResponse = yield call(api.incomeSummary, request);

        // Create an action to dispatch on success with the returned entity from API
        const resultAction = new LoadIncomeSummarySuccessAction(result.incomeSummary, result.totalIncome);

        // Dispatch the new action with Redux
        yield put(resultAction);
        
    } catch (e) {

        // Dispatch a failure action to Redux
        yield put(new LoadIncomeSummaryFailureAction(e.message));
        yield put(new ReportErrorAction(e.message));
        return;
    }
}