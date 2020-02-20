import { ChartType } from 'src/enums/ChartType';
import IStoreState from 'src/state/IStoreState';
import { incomeExpenseChartData } from 'src/state/contexts/chart/Selectors';
import Chart, { IPropsFromState, IPropsFromDispatch } from 'src/components/charts/ChartProps';
import { connect } from 'react-redux';


// REACT-REDUX
// Wrap stateless component with redux connected component

// Map full state to state required for component
const mapStateToProps =
    (state: IStoreState): IPropsFromState => ({
        chart: incomeExpenseChartData(state),
        chartType: ChartType.Bar,
        width: 1200,
        height: 700
    });

// Add required action creators for component
const mapPropsFromDispatch: IPropsFromDispatch =
{

};


// This does the magic of subscwribing to state changes and ensuring the wrapped
// stateless component gets all the properties it needs from the Redux state
export default connect(mapStateToProps, mapPropsFromDispatch)(Chart);
