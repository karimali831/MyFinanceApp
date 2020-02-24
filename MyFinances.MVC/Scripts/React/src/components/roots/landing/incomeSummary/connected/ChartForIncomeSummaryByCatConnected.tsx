import IStoreState from '../../../../../state/IStoreState';
import { connect } from 'react-redux';
import Chart, { IPropsFromState, IPropsFromDispatch } from '../../../../charts/ChartProps';
import { ChartType, ChartDataType } from 'src/enums/ChartType';
import { chartSummaryDataByCategory } from 'src/state/contexts/chart/Selectors';
import { DateFilterChangeAction } from 'src/state/contexts/common/Actions';
import { DataType } from 'src/enums/DataType';

// REACT-REDUX
// Wrap stateless component with redux connected component

// Map full state to state required for component
const mapStateToProps =
    (state: IStoreState): IPropsFromState => ({
        chart: chartSummaryDataByCategory(state, DataType.IncomeSummary),
        chartType: ChartType.Bar,
        width: 1200,
        height: 700,
        dateFilter: state.incomeSummary.dateFilter,
        dataType: DataType.IncomeSummary,
        chartDataType: ChartDataType.IncomeSummaryByCategory
    });

// Add required action creators for component
const mapPropsFromDispatch: IPropsFromDispatch =
{
    dateFilterChanged: DateFilterChangeAction.creator
};

// This does the magic of subscwribing to state changes and ensuring the wrapped
// stateless component gets all the properties it needs from the Redux state
export default connect(mapStateToProps, mapPropsFromDispatch)(Chart);
