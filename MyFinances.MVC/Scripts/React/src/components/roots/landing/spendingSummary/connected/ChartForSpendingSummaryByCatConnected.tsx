import IStoreState from '../../../../../state/IStoreState';
import { connect } from 'react-redux';
import ChartProps, { IPropsFromState, IPropsFromDispatch } from '../../../../charts/ChartProps';
import { ChartType } from 'src/enums/ChartType';
import { chartSummaryDataByCategory } from 'src/state/contexts/chart/Selectors';
import { DateFilterChangeAction } from 'src/state/contexts/common/Actions';
import { DataType } from 'src/enums/DataType';
import { LoadExpensesByCategoryChartAction } from 'src/state/contexts/chart/Actions';
import { CategoryType } from 'src/enums/CategoryType';

// REACT-REDUX
// Wrap stateless component with redux connected component

// Map full state to state required for component
const mapStateToProps =
    (state: IStoreState): IPropsFromState => ({
        headerTitle: state.chart.expenseCategoryComparisonChart === undefined ? "" : state.chart.expenseCategoryComparisonChart.headerTitle,
        chart: chartSummaryDataByCategory(state, DataType.SpendingSummary),
        chartType: ChartType.Bar,
        width: 200,
        height: 200,
        dateFilter: state.spendingSummary.dateFilter,
        categoryType: CategoryType.Spendings,
        dataType: DataType.SpendingSummary,
        secondTypeId: state.common.secondTypeId,
        selectedCat: state.common.selectedCat,
        selectedSecondCat: state.common.selectedSecondCat,
        request: state.chart.request
    });

// Add required action creators for component
const mapPropsFromDispatch: IPropsFromDispatch =
{
    dateFilterChanged: DateFilterChangeAction.creator,
    chartChanged: LoadExpensesByCategoryChartAction.creator
};

// This does the magic of subscwribing to state changes and ensuring the wrapped
// stateless component gets all the properties it needs from the Redux state
export default connect(mapStateToProps, mapPropsFromDispatch)(ChartProps);
