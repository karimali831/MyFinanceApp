import IStoreState from './IStoreState';
import { combineReducers } from 'redux';
import commonReducer from './contexts/common/Reducer';
// import cwtlReducer from './contexts/cwtl/Reducer';
// import financeReducer from './contexts/finance/Reducer';
import incomeReducer from './contexts/income/Reducer';
import spendingReducer from './contexts/spending/Reducer';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
// import errorReducer from './contexts/error/Reducer';
import IncomeSummaryReducer from './contexts/landing/IncomeSummaryReducer';
import SpendingSummaryReducer from './contexts/landing/SpendingSummaryReducer';

// Root reducer combining all other state reducers
export default
    (history: History<any>) =>
        combineReducers<IStoreState>({
            router: connectRouter(history),
            spendingSummary: SpendingSummaryReducer,
            incomeSummary: IncomeSummaryReducer,
            common: commonReducer,
            // cwtl: cwtlReducer,
            // finance: financeReducer,
            income: incomeReducer,
            spending: spendingReducer,
            // error: errorReducer,
        }); 