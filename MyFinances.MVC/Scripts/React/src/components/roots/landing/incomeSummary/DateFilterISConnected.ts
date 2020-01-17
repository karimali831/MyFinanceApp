import IStoreState from '../../../../state/IStoreState';
import { connect } from 'react-redux';
import DateFilterForSummary, { IPropsFromState, IPropsFromDispatch } from '../DateFilterForSummary';
import { DateFilterChangeAction } from '../../../../state/contexts/common/Actions';
import { incomeSummaryDateFilter } from 'src/state/contexts/landing/Selectors';
import { DateFrequency } from 'src/enums/DateFrequency';

// REACT-REDUX
// Wrap stateless component with redux connected component

// Map full state to state required for component
const mapStateToProps =
    (state: IStoreState): IPropsFromState => ({
        dateFilter: incomeSummaryDateFilter(state),
        categoryType: state.incomeSummary.categoryType,
        selectedFrequency: DateFrequency[state.incomeSummary.dateFilter.frequency]
    });

// Add required action creators for component
const mapPropsFromDispatch: IPropsFromDispatch =
{
    dateFilterChanged: DateFilterChangeAction.creator
};


// This does the magic of subscwribing to state changes and ensuring the wrapped
// stateless component gets all the properties it needs from the Redux state
export default connect(mapStateToProps, mapPropsFromDispatch)(DateFilterForSummary);
