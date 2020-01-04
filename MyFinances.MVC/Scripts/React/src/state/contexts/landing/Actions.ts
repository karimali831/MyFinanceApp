import { ISpendingSummary } from '../../../models/ISpending';
import { IDateFilter } from "../../../models/IDateFilter";

// action types
export class SpendingSummaryActionTypes {
    public static readonly ResetSpendingSummary = "@@spendingsummary/resetspendingsummary";
    public static readonly LoadSpendingSummary = "@@spendingsummary/loadspendingsummary";
    public static readonly LoadSpendingSummarySuccess = "@@spendingsummary/loadspendingsummarysuccess";
    public static readonly LoadSpendingSummaryFailure = "@@spendingsummary/loadspendingsummaryfailure";
}

// actions defined as classes with a creator as a static function
export class ResetSpendingSummaryAction {
    public static readonly creator = () => new ResetSpendingSummaryAction();

    public readonly type = SpendingSummaryActionTypes.ResetSpendingSummary;
}

// actions defined as classes with a creator as a static function
export class LoadSpendingSummaryAction {
    public static readonly creator = (dateFilter: IDateFilter) => new LoadSpendingSummaryAction(dateFilter);

    public readonly type = SpendingSummaryActionTypes.LoadSpendingSummary;

    constructor(
        public dateFilter: IDateFilter
    ) { }
}

// actions defined as classes with a creator as a static function
export class LoadSpendingSummarySuccessAction {
    public static readonly creator = (spendingSummary: ISpendingSummary[], fuelIn: number, totalSpent: number) => new LoadSpendingSummarySuccessAction(spendingSummary, fuelIn, totalSpent);

    public readonly type = SpendingSummaryActionTypes.LoadSpendingSummarySuccess;

    constructor(
        public spendingSummary: ISpendingSummary[], 
        public fuelIn: number, 
        public totalSpent: number
    ) { }
}

export class LoadSpendingSummaryFailureAction {
    public static readonly creator = (errorMsg: string) => new LoadSpendingSummaryFailureAction(errorMsg);

    public readonly type = SpendingSummaryActionTypes.LoadSpendingSummaryFailure;

    constructor(
        public errorMsg: string
    ) { }
}


// Create a discriminated union of all action types used to correctly type the
// actions in the reducer switch statement
export type SpendingSummaryActions =
    ResetSpendingSummaryAction |
    LoadSpendingSummaryFailureAction |
    LoadSpendingSummaryAction |
    LoadSpendingSummarySuccessAction