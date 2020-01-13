
import ISpendingSummaryState, { SpendingSummaryState } from './ISpendingSummaryState';
import { Reducer } from 'redux';
import { LandingSummaryActions, LandingSummaryActionTypes } from './Actions';

const SpendingSummaryReducer: Reducer<ISpendingSummaryState, LandingSummaryActions> =
    (state = SpendingSummaryState.intialState, action) => {
        switch (action.type) {
            case LandingSummaryActionTypes.LoadSpendingSummarySuccess:
                return {
                    ...state,
                    ...{
                        spendingSummary: action.spendingSummary, 
                        fuelIn: action.fuelIn, 
                        totalSpent: action.totalSpent,
                        loading: false,
                        showSecondCatSummary: state.showSecondCatSummary
                    }
                }

            default:
                return state;
        }
    }

export default SpendingSummaryReducer;