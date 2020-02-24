import IStoreState from '../../../../../state/IStoreState';
import { connect } from 'react-redux';
import ChartProps, { IPropsFromState, IPropsFromDispatch } from '../../../../charts/ChartProps';
import { CategoryType } from 'src/enums/CategoryType';
import { ChartType } from 'src/enums/ChartType';
import { chartSummaryDataByCategory } from 'src/state/contexts/chart/Selectors';

// REACT-REDUX
// Wrap stateless component with redux connected component

// Map full state to state required for component
const mapStateToProps =
    (state: IStoreState): IPropsFromState => ({
        headerTitle: state.chart.expenseCategoryComparisonChart === undefined ? "" : state.chart.expenseCategoryComparisonChart.headerTitle,
        chart: chartSummaryDataByCategory(state, CategoryType.Spendings),
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
export default connect(mapStateToProps, mapPropsFromDispatch)(ChartProps);
