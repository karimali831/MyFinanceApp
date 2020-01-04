import { IncomeActions, IncomeActionTypes } from "./Actions";
import IIncomeState, { IncomeState } from './IIncomeState';
import { Reducer } from 'redux';

const IncomeReducer: Reducer<IIncomeState, IncomeActions> =
    (state = IncomeState.intialState, action) => {
        switch (action.type) {
            case IncomeActionTypes.Income:
                return { ...state, ...{ Income: action.IncomeMessage } };

            default:
                return state;
        }
    }

export default IncomeReducer;