import { put, takeLatest } from "redux-saga/effects";
import { CommonActionTypes, DateFilterChangeAction } from 'src/state/contexts/common/Actions';
import { CategoryType } from 'src/enums/CategoryType';
import { LoadSpendingSummaryAction, LoadIncomeSummaryAction } from 'src/state/contexts/landing/Actions';


export function* dateFilterWatchSaga() {
    yield takeLatest(CommonActionTypes.DateFilterChange, dateFilterChange)
}

export function* dateFilterChange(action: DateFilterChangeAction) {

    if (action.categoryType === CategoryType.Spendings) {
        yield put(new LoadSpendingSummaryAction(action.filter));
    } 
    else if (action.categoryType === CategoryType.Income) {
        yield put(new LoadIncomeSummaryAction(action.filter));
    }
}