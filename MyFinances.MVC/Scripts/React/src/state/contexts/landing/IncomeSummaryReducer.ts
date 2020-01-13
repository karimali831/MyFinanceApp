
import IIncomeSummaryState, { IncomeSummaryState } from './IIncomeSummaryState';
import { Reducer } from 'redux';
import { LandingSummaryActions, LandingSummaryActionTypes } from './Actions';

const IncomeSummaryReducer: Reducer<IIncomeSummaryState, LandingSummaryActions> =
    (state = IncomeSummaryState.intialState, action) => {
        switch (action.type) {
            case LandingSummaryActionTypes.LoadIncomeSummarySuccess:
                return {
                    ...state,
                    ...{
                        incomeSummary: action.incomeSummary, 
                        totalIncome: action.totalIncome,
                        loading: false,
                        showSecondCatSummary: state.showSecondCatSummary
                    }
                }

            default:
                return state;
        }
    }

export default IncomeSummaryReducer;