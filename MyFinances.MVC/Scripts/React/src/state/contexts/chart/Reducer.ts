import { ChartActions, ChartActionTypes } from "./Actions";
import IChartState, { ChartState } from './ChartState';
import { Reducer } from 'redux';

const CWTLReducer: Reducer<IChartState, ChartActions> =
    (state = ChartState.intialState, action) => {
        switch (action.type) {

            case ChartActionTypes.LoadIncomesByCategory:
                return { ...state, 
                    ...{ 
                        request: action.request
                    } 
                };

            case ChartActionTypes.LoadExpensesByCategory:
                return { ...state, 
                    ...{ 
                        request: action.request
                    } 
                };   

            case ChartActionTypes.LoadIncomeExpense:
                return { ...state, 
                    ...{ 
                        request: action.request
                    } 
                };

            case ChartActionTypes.LoadIncomeExpenseSuccess:
                return { ...state, 
                    ...{ 
                        incomeExpenseComparisonChart: action.chart
                    } 
                };

            case ChartActionTypes.LoadIncomesByCategorySuccess:
                return { ...state, 
                    ...{ 
                        incomeCategoryComparisonChart: action.chart
                    } 
                };

            case ChartActionTypes.LoadExpensesByCategorySuccess:
                return { ...state, 
                    ...{ 
                        expenseCategoryComparisonChart: action.chart
                    } 
                };

            default:
                return state;
        }
    }

export default CWTLReducer;