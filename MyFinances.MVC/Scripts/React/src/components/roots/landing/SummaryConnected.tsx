import IStoreState from '../../../state/IStoreState';
import { connect } from 'react-redux';
import SpendingSummary, { IPropsFromState, IPropsFromDispatch } from './Summary';
import { LoadSpendingSummaryAction } from '../../../state/contexts/landing/Actions';
import { DateFrequency } from "../../../enums/DateFrequency";

// REACT-REDUX
// Wrap stateless component with redux connected component

// Map full state to state required for component
const mapStateToProps =
    (state: IStoreState): IPropsFromState => ({
        spendingSummary: state.spendingSummary.spendingSummary,
        fuelIn: state.spendingSummary.fuelIn,
        totalSpent: state.spendingSummary.totalSpent,
        frequency: DateFrequency[state.spendingSummary.frequency],
        interval: state.spendingSummary.interval,
        fromDate: state.spendingSummary.fromDate,
        toDate: state.spendingSummary.toDate,
        showSecondCatSummary: state.spendingSummary.showSecondCatSummary,
        loading: state.spendingSummary.loading,
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
