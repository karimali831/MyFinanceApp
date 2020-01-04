import {  api, ISpendingSummaryResponse } from '../../../Api/Api'
import { select, call, put, takeLatest } from 'redux-saga/effects';
import { ReportErrorAction } from '../../contexts/error/Actions';
import { SpendingSummaryActionTypes, LoadSpendingSummarySuccessAction, LoadSpendingSummaryFailureAction } from '../../contexts/landing/Actions';
import { IDateFilter } from '../../../models/IDateFilter';
import { getSpendingSummaryRequest } from '../../contexts/landing/Selectors';

export default function* loadSpendingSummaryApiSaga() {
    yield takeLatest(SpendingSummaryActionTypes.LoadSpendingSummary, loadSpendingSummary);
}

export function* loadSpendingSummary() {
    try {

        // Create Request object
        // selectors to access the state for call params
        const request: IDateFilter = yield select(getSpendingSummaryRequest)

        // Start the API call asynchronously
        const result: ISpendingSummaryResponse = yield call(api.summary, request);

        // Create an action to dispatch on success with the returned entity from API
        const resultAction = new LoadSpendingSummarySuccessAction(result.spendingSummary, result.fuelIn, result.totalSpent);

        // Dispatch the new action with Redux
        yield put(resultAction);
        
    } catch (e) {

        // Dispatch a failure action to Redux
        yield put(new LoadSpendingSummaryFailureAction(e.message));
        yield put(new ReportErrorAction(e.message));
        return;
    }
}