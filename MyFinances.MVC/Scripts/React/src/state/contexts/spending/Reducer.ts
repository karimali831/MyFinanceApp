
import ISpendingState, { SpendingState } from './ISpendingState';
import { Reducer } from 'redux';
import { SpendingActions, SpendingActionTypes } from './Actions';

const SpendingReducer: Reducer<ISpendingState, SpendingActions> =
    (state = SpendingState.intialState, action) => {
        switch (action.type) {
            case SpendingActionTypes.LoadSpendings:
                return { ...state, ...{ spendings: state.spendings } };

            default:
                return state;
        }
    }

export default SpendingReducer;