import { IMonthComparisonChart } from 'src/models/IMonthComparisonChart';
import { IMonthComparisonChartRequest } from 'src/api/Api';
import { IDateFilter } from 'src/models/IDateFilter';

// action types
export class ChartActionTypes {
    public static readonly LoadIncomeExpenseSuccess = "@@chart/loadincomeexpensesuccess"
    public static readonly LoadIncomesByCategorySuccess = "@@chart/loadincomesbycategorysuccess"
    public static readonly LoadExpensesByCategorySuccess = "@@chart/loadexpensesbycategorysuccess"
    public static readonly LoadIncomeExpense = "@@chart/loadincomeaction"
    public static readonly LoadIncomesByCategory = "@@chart/loadincomesbycategory"
    public static readonly LoadExpensesByCategory = "@@chart/loadexpensesbycategory"
    public static readonly LoadIncomeExpenseFailure = "@@chart/loadincomeexpensefailure"
    public static readonly LoadIncomesByCategoryFailure = "@@chart/loadincomesbycategoryfailure"
    public static readonly LoadExpensesByCategoryFailure = "@@chart/loadexpensesbycategoryfailure"
}

// action defined as classes with a creator as a static function
export class LoadIncomeExpenseAction {
    public static readonly creator = (filter: IDateFilter) => new LoadIncomeExpenseAction(filter);

    public readonly type = ChartActionTypes.LoadIncomeExpense;

    constructor(
        public filter: IDateFilter
    ) { }
}

export class LoadIncomesByCategoryAction {
    public static readonly creator = (request: IMonthComparisonChartRequest) => new LoadIncomesByCategoryAction(request);

    public readonly type = ChartActionTypes.LoadIncomesByCategory;

    constructor(
        public request: IMonthComparisonChartRequest
    ) { }
}

export class LoadExpensesByCategoryAction {
    public static readonly creator = (request: IMonthComparisonChartRequest) => new LoadExpensesByCategoryAction(request);

    public readonly type = ChartActionTypes.LoadExpensesByCategory;

    constructor(
        public request: IMonthComparisonChartRequest
    ) { }
}

export class LoadIncomeExpenseSuccessAction {
    public static readonly creator = (chart: IMonthComparisonChart[]) => new LoadIncomeExpenseSuccessAction(chart);

    public readonly type = ChartActionTypes.LoadIncomeExpenseSuccess;

    constructor(
        public chart: IMonthComparisonChart[]
    ) { }
}

export class LoadIncomesByCategorySuccessAction {
    public static readonly creator = (chart: IMonthComparisonChart[]) => new LoadIncomesByCategorySuccessAction(chart);

    public readonly type = ChartActionTypes.LoadIncomesByCategorySuccess;

    constructor(
        public chart: IMonthComparisonChart[]
    ) { }
}

export class LoadExpensesByCategorySuccessAction {
    public static readonly creator = (chart: IMonthComparisonChart[]) => new LoadExpensesByCategorySuccessAction(chart);

    public readonly type = ChartActionTypes.LoadExpensesByCategorySuccess;

    constructor(
        public chart: IMonthComparisonChart[]
    ) { }
}

export class LoadIncomeExpenseFailureAction {
    public static readonly creator = (errorMsg: string) => new LoadIncomeExpenseFailureAction(errorMsg);

    public readonly type = ChartActionTypes.LoadIncomeExpenseFailure;

    constructor(
        public errorMsg: string
    ) { }
}

export class LoadIncomesByCategoryFailureAction {
    public static readonly creator = (errorMsg: string) => new LoadIncomesByCategoryFailureAction(errorMsg);

    public readonly type = ChartActionTypes.LoadIncomesByCategoryFailure;

    constructor(
        public errorMsg: string
    ) { }
}

export class LoadExpensesByCategoryFailureAction {
    public static readonly creator = (errorMsg: string) => new LoadExpensesByCategoryFailureAction(errorMsg);

    public readonly type = ChartActionTypes.LoadExpensesByCategoryFailure;

    constructor(
        public errorMsg: string
    ) { }
}

// Create a discriminated union of all action typed used to correctly type the
// actions in the reducer switch statement
export type ChartActions =
LoadIncomeExpenseSuccessAction |
LoadIncomesByCategorySuccessAction |
LoadExpensesByCategorySuccessAction |
LoadIncomeExpenseAction |
LoadIncomesByCategoryAction |
LoadExpensesByCategoryAction |
LoadIncomeExpenseFailureAction |
LoadIncomesByCategoryFailureAction |
LoadExpensesByCategoryFailureAction 