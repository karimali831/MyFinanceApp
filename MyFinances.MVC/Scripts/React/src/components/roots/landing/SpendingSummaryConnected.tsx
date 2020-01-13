import IStoreState from '../../../state/IStoreState';
import { connect } from 'react-redux';
import SpendingSummary, { IPropsFromState, IPropsFromDispatch } from './SpendingSummary';
import { LoadSpendingSummaryAction } from '../../../state/contexts/landing/Actions';

// REACT-REDUX
// Wrap stateless component with redux connected component

// Map full state to state required for component
const mapStateToProps =
    (state: IStoreState): IPropsFromState => ({
        dateFilter: state.common.spendingSummaryDateFilter,
        spendingSummary: state.spendingSummary.spendingSummary,
        fuelIn: state.spendingSummary.fuelIn,
        totalSpent: state.spendingSummary.totalSpent,
        showSecondCatSummary: state.spendingSummary.showSecondCatSummary,
        loading: state.spendingSummary.loading,
        categoryType: state.spendingSummary.categoryType,
        location: state.router.location.pathname + '?' + state.router.location.search
    });

// Add required action creators for component
const mapPropsFromDispatch: IPropsFromDispatch =
{
    loadSpendingSummary: LoadSpendingSummaryAction.creator
};


// This does the magic of subscribing to state changes and ensuring the wrapped
// stateless component gets all the properties it needs from the Redux state
export default connect(mapStateToProps, mapPropsFromDispatch)(SpendingSummary);
