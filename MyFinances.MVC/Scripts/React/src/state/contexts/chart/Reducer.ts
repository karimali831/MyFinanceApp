import { ChartActions, ChartActionTypes } from "./Actions";
import IChartState, { ChartState } from './ChartState';
import { Reducer } from 'redux';

const CWTLReducer: Reducer<IChartState, ChartActions> =
    (state = ChartState.intialState, action) => {
        switch (action.type) {
            case ChartActionTypes.LoadIncomeExpenseSuccess:
                return { ...state, 
                    ...{ 
                        chart: action.chart
                    } 
                };

            case ChartActionTypes.LoadIncomesByCategorySuccess:
                return { ...state, 
                    ...{ 
                        chart: action.chart
                    } 
                };

            case ChartActionTypes.LoadExpensesByCategorySuccess:
                return { ...state, 
                    ...{ 
                        chart: action.chart
                    } 
                };

            default:
                return state;
        }
    }

export default CWTLReducer;