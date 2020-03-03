import { ChartType, ChartDataType } from 'src/enums/ChartType';
import IStoreState from 'src/state/IStoreState';
import { chartFinanceSummary } from 'src/state/contexts/chart/Selectors';
import Chart, { IPropsFromState, IPropsFromDispatch } from 'src/components/charts/ChartProps';
import { connect } from 'react-redux';
import { DateFilterChangeAction } from 'src/state/contexts/common/Actions';
import { DataType } from 'src/enums/DataType';
import { LoadChartAction} from 'src/state/contexts/chart/Actions';

// REACT-REDUX
// Wrap stateless component with redux connected component

// Map full state to state required for component
const mapStateToProps =
    (state: IStoreState): IPropsFromState => ({
        headerTitle: state.chart.financesComparisonChart === undefined ? "" : state.chart.financesComparisonChart.headerTitle,
        chart: chartFinanceSummary(state),
        chartType: ChartType.Line,
        width: 200,
        height: 200,
        dateFilter: state.spendingSummary.dateFilter,
        dataType: DataType.SpendingSummary,
        secondTypeId: state.common.secondTypeId,
        selectedCat: state.common.selectedCat,
        selectedSecondCat: state.common.selectedSecondCat,
        request: state.chart.request,
        chartDataType: ChartDataType.Finances
    });

// Add required action creators for component
const mapPropsFromDispatch: IPropsFromDispatch =
{
    dateFilterChanged: DateFilterChangeAction.creator,
    chartChanged: LoadChartAction.creator
};

// This does the magic of subscwribing to state changes and ensuring the wrapped
// stateless component gets all the properties it needs from the Redux state
export default connect(mapStateToProps, mapPropsFromDispatch)(Chart);
