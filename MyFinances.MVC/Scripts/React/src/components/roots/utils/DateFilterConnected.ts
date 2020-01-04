import IStoreState from '../../../state/IStoreState';
import { connect } from 'react-redux';
import DateFilter, { IPropsFromState, IPropsFromDispatch } from './DateFilter';
import { DateFilterChangeAction } from '../../../state/contexts/common/Actions';


// REACT-REDUX
// Wrap stateless component with redux connected component

// Map full state to state required for component
const mapStateToProps =
    (state: IStoreState): IPropsFromState => ({
        dateFilter: state.common.dateFilter,
        type: state.common.categoryType,
        loading: state.common.loading
    });

// Add required action creators for component
const mapPropsFromDispatch: IPropsFromDispatch =
{
    dateFilterChanged: DateFilterChangeAction.creator
};


// This does the magic of subscribing to state changes and ensuring the wrapped
// stateless component gets all the properties it needs from the Redux state
export default connect(mapStateToProps, mapPropsFromDispatch)(DateFilter);
