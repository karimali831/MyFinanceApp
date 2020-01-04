
import { all, fork } from 'redux-saga/effects';
// import loadSpendingsApiSaga from './loadSpendingsApiSaga';
import locationChangeSaga from './locationChangeSaga';
import loadSpendingSummaryApiSaga from './loadSpendingSummaryApiSaga';
import { dateFilterWatchSaga } from './dateFilterSaga';


// We `fork()` these tasks so they execute in the background.
export function* rootSaga() {
  yield all([
    // Routing
    fork(locationChangeSaga),

    // Spendings
    // fork(loadSpendingsApiSaga),
    fork(loadSpendingSummaryApiSaga),

    // utils
    fork(dateFilterWatchSaga)
  ])
}