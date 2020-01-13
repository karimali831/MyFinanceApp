import { CommonActions, CommonActionTypes } from "./Actions";
import ICommonState, { CommonState } from './ICommonState';
import { Reducer } from 'redux';

const CommonReducer: Reducer<ICommonState, CommonActions> =
    (state = CommonState.intialState, action) => {
        switch (action.type) {
            case CommonActionTypes.DateFilterChange:
                return { ...state, 
                    ...{ 
                        dateFilter: action.filter,
                        categoryType: action.categoryType
                    } 
                };

            default:
                return state;
        }
    }

export default CommonReducer;