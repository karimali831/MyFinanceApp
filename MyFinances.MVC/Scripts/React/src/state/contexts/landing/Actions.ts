import { ISpendingSummary } from '../../../models/ISpending';
import { IDateFilter } from "../../../models/IDateFilter";
import { IIncomeSummary } from 'src/models/IIncome';

// action types
export class LandingSummaryActionTypes {
    public static readonly LoadSpendingSummary = "@@landingsummary/loadspendingsummary";
    public static readonly LoadSpendingSummarySuccess = "@@landingsummary/loadspendingsummarysuccess";
    public static readonly LoadSpendingSummaryFailure = "@@landingsummary/loadspendingsummaryfailure";
    public static readonly LoadIncomeSummary = "@@landingsummary/loadincomesummary";
    public static readonly LoadIncomeSummarySuccess = "@@landingsummary/loadincomesummarysuccess";
    public static readonly LoadIncomeSummaryFailure = "@@landingsummary/loadincomesummaryfailure";
}

// actions defined as classes with a creator as a static function
export class LoadSpendingSummaryAction {
    public static readonly creator = (dateFilter: IDateFilter) => new LoadSpendingSummaryAction(dateFilter);

    public readonly type = LandingSummaryActionTypes.LoadSpendingSummary;

    constructor(
        public dateFilter: IDateFilter
    ) { }
}

export class LoadSpendingSummarySuccessAction {
    public static readonly creator = (spendingSummary: ISpendingSummary[], fuelIn: number, totalSpent: number) => new LoadSpendingSummarySuccessAction(spendingSummary, fuelIn, totalSpent);

    public readonly type = LandingSummaryActionTypes.LoadSpendingSummarySuccess;

    constructor(
        public spendingSummary: ISpendingSummary[], 
        public fuelIn: number, 
        public totalSpent: number
    ) { }
}

export class LoadSpendingSummaryFailureAction {
    public static readonly creator = (errorMsg: string) => new LoadSpendingSummaryFailureAction(errorMsg);

    public readonly type = LandingSummaryActionTypes.LoadSpendingSummaryFailure;

    constructor(
        public errorMsg: string
    ) { }
}

export class LoadIncomeSummaryAction {
    public static readonly creator = (dateFilter: IDateFilter) => new LoadIncomeSummaryAction(dateFilter);

    public readonly type = LandingSummaryActionTypes.LoadIncomeSummary;

    constructor(
        public dateFilter: IDateFilter
    ) { }
}

export class LoadIncomeSummarySuccessAction {
    public static readonly creator = (incomeSummary: IIncomeSummary[], totalIncome: number) => new LoadIncomeSummarySuccessAction(incomeSummary, totalIncome);

    public readonly type = LandingSummaryActionTypes.LoadIncomeSummarySuccess;

    constructor(
        public incomeSummary: IIncomeSummary[], 
        public totalIncome: number
    ) { }
}

export class LoadIncomeSummaryFailureAction {
    public static readonly creator = (errorMsg: string) => new LoadIncomeSummaryFailureAction(errorMsg);

    public readonly type = LandingSummaryActionTypes.LoadIncomeSummaryFailure;

    constructor(
        public errorMsg: string
    ) { }
}

// Create a discriminated union of all action types used to correctly type the
// actions in the reducer switch statement
export type LandingSummaryActions =
    LoadSpendingSummaryAction |
    LoadSpendingSummarySuccessAction |
    LoadSpendingSummaryFailureAction |
    LoadIncomeSummaryAction |
    LoadIncomeSummarySuccessAction |
    LoadIncomeSummaryFailureAction