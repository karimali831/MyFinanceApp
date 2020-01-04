import IStoreState from '../../../state/IStoreState';
import { IDateFilter } from '../../../models/IDateFilter';

export const getSpendingSummaryRequest = (state: IStoreState): IDateFilter => {
    return {
        frequency: state.spendingSummary.frequency,
        interval: state.spendingSummary.interval,
        fromDateRange: state.spendingSummary.fromDate,
        toDateRange: state.spendingSummary.toDate
    };
}