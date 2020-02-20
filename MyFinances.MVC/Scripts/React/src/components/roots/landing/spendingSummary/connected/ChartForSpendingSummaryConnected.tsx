import IStoreState from '../../../../../state/IStoreState';
import { connect } from 'react-redux';
import ChartForSummary, { IPropsFromState, IPropsFromDispatch } from '../../../../charts/ChartProps';
import { DateFilterChangeAction } from 'src/state/contexts/common/Actions';
import { chartSummaryData } from 'src/state/contexts/landing/Selectors';
import { CategoryType } from 'src/enums/CategoryType';
import { ChartType } from 'src/enums/ChartType';


// REACT-REDUX
// Wrap stateless component with redux connected component

// Map full state to state required for component
const mapStateToProps =
    (state: IStoreState): IPropsFromState => ({
        chart: chartSummaryData(state, CategoryType.Spendings),
        chartType: ChartType.Doughnut,
        width: 1200,
        height: 700
    });

// Add required action creators for component
const mapPropsFromDispatch: IPropsFromDispatch =
{
    dateFilterChanged: DateFilterChangeAction.creator
};


// This does the magic of subscwribing to state changes and ensuring the wrapped
// stateless component gets all the properties it needs from the Redux state
export default connect(mapStateToProps, mapPropsFromDispatch)(ChartForSummary);
