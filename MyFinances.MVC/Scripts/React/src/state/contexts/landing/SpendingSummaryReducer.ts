
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
                        loading: false
                    }
                }

            case LandingSummaryActionTypes.ShowSecondCategorySpendingSummary:
                return {
                    ...state, 
                        ...{ 
                            showSecondCatSummary: state.showSecondCatSummary === action.secondCat ? null : action.secondCat  
                        }
                }

            case LandingSummaryActionTypes.SpendingSummaryDateFilterChange:
                    return { ...state, ...{ dateFilter: action.filter } };

            default:
                return state;
        }
    }

export default SpendingSummaryReducer;