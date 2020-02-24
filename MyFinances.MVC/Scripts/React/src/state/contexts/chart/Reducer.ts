import { ChartActions, ChartActionTypes } from "./Actions";
import IChartState, { ChartState } from './ChartState';
import { Reducer } from 'redux';

const CWTLReducer: Reducer<IChartState, ChartActions> =
    (state = ChartState.intialState, action) => {
        switch (action.type) {

            case ChartActionTypes.LoadIncomesByCategoryChart:
                return { ...state, 
                    ...{ 
                        request: action.request
                    } 
                };

            case ChartActionTypes.LoadExpensesByCategoryChart:
                return { ...state, 
                    ...{ 
                        request: action.request
                    } 
                };   

            case ChartActionTypes.LoadIncomeExpenseChart:
                return { ...state, 
                    ...{ 
                        request: action.request
                    } 
                };

            case ChartActionTypes.LoadIncomeExpenseChartSuccess:
                return { ...state, 
                    ...{ 
                        incomeExpenseComparisonChart: action.chart
                    } 
                };

            case ChartActionTypes.LoadIncomesByCategoryChartSuccess:
                return { ...state, 
                    ...{ 
                        incomeCategoryComparisonChart: action.chart
                    } 
                };

            case ChartActionTypes.LoadExpensesByCategoryChartSuccess:
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