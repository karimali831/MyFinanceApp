
import ISpendingSummaryState, { SpendingSummaryState } from './ISpendingSummaryState';
import { Reducer } from 'redux';
import { SpendingSummaryActions, SpendingSummaryActionTypes } from './Actions';

const SpendingSummaryReducer: Reducer<ISpendingSummaryState, SpendingSummaryActions> =
    (state = SpendingSummaryState.intialState, action) => {
        switch (action.type) {
            case SpendingSummaryActionTypes.LoadSpendingSummarySuccess:
                return {
                    ...state,
                    ...{
                        spendingSummary: action.spendingSummary, 
                        fuelIn: action.fuelIn, 
                        totalSpent: action.totalSpent,
                        frequency: state.frequency,
                        interval: state.interval,
                        loading: false,
                        fromDate: state.fromDate,
                        toDate: state.toDate,
                        showSecondCatSummary: state.showSecondCatSummary
                    }
                }

            default:
                return state;
        }
    }

export default SpendingSummaryReducer;