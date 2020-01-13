import IStoreState from '../../../state/IStoreState';
import { IDateFilter } from '../../../models/IDateFilter';

export const initialIncomeSummaryDateFilter = (state: IStoreState): IDateFilter => {
    return {
        frequency: state.common.incomeSummaryDateFilter.frequency,
        interval: state.common.incomeSummaryDateFilter.interval,
        fromDateRange: state.common.incomeSummaryDateFilter.fromDateRange,
        toDateRange: state.common.incomeSummaryDateFilter.toDateRange
    };
}


export const getSelectedDateFilter = (state: IStoreState): IDateFilter | null => {
    if (state.common.dateFilter !== undefined) {
        return {
            frequency: state.common.dateFilter.frequency,
            interval: state.common.dateFilter.interval,
            fromDateRange: state.common.dateFilter.fromDateRange,
            toDateRange: state.common.dateFilter.toDateRange
        };
    } else {
        return null
    }
}

export const initialSpendingSummaryDateFilter = (state: IStoreState): IDateFilter => {
    return {
        frequency: state.common.spendingSummaryDateFilter.frequency,
        interval: state.common.spendingSummaryDateFilter.interval,
        fromDateRange: state.common.spendingSummaryDateFilter.fromDateRange,
        toDateRange: state.common.spendingSummaryDateFilter.toDateRange
    };
}