
import { all, fork } from 'redux-saga/effects';
// import loadSpendingsApiSaga from './loadSpendingsApiSaga';
import locationChangeSaga from './locationChangeSaga';
import loadSpendingSummaryApiSaga from './loadSpendingSummaryApiSaga';
import { dateFilterWatchSaga } from './dateFilterSaga';
import loadIncomeSummaryApiSaga from './loadIncomeSummaryApiSaga';


// We `fork()` these tasks so they execute in the background.
export function* rootSaga() {
  yield all([
    // Routing
    fork(locationChangeSaga),

    // Spendings
    // fork(loadSpendingsApiSaga),

    // Summary
    fork(loadSpendingSummaryApiSaga),
    fork(loadIncomeSummaryApiSaga),

    // utils
    fork(dateFilterWatchSaga)
  ])
}