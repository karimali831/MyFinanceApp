import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import RootReducer from "./RootReducer";
// import { StoreState } from './IStoreState';
import { rootSaga } from './middleware/sagas/rootSaga';
import { actionToPlainObject } from './middleware/actionToPlainObject';
import { History } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { LoadSpendingSummaryAction } from './contexts/landing/Actions';
import { DateFrequency } from '../enums/DateFrequency';
import { IDateFilter } from '../models/IDateFilter';

export default function initialiseStore(history: History<any>) {

	const sagaMiddleware = createSagaMiddleware();

	const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

	const store =
		createStore(
			RootReducer(history),
			// StoreState.initialState,
			composeEnhancers ?
				composeEnhancers(
					applyMiddleware(
						actionToPlainObject,
						sagaMiddleware,
						routerMiddleware(history)
					)
				) :
				applyMiddleware(
					actionToPlainObject,
					sagaMiddleware,
					routerMiddleware(history)
				)
		);

	const dateFilter: IDateFilter = {
		frequency: DateFrequency.Today,
		interval: 1,
		fromDateRange: null,
		toDateRange: null
	}

	sagaMiddleware.run(rootSaga);
	store.dispatch(new LoadSpendingSummaryAction(dateFilter));

	return store;

};