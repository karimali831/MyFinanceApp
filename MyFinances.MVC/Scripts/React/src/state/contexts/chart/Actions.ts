import { IMonthComparisonChartRequest, IMonthComparisonChartResponse } from 'src/api/Api';

// action types
export class ChartActionTypes {
    public static readonly LoadIncomeExpenseChartSuccess = "@@chart/loadincomeexpensechartsuccess"
    public static readonly LoadIncomesByCategoryChartSuccess = "@@chart/loadincomesbycategorychartsuccess"
    public static readonly LoadExpensesByCategoryChartSuccess = "@@chart/loadexpensesbycategorychartsuccess"
    public static readonly LoadIncomeExpenseChart = "@@chart/loadincomeexpenseactionchart"
    public static readonly LoadIncomesByCategoryChart = "@@chart/loadincomesbycategorychart"
    public static readonly LoadExpensesByCategoryChart = "@@chart/loadexpensesbycategorychart"
    public static readonly LoadIncomeExpenseChartFailure = "@@chart/loadincomeexpensechartfailure"
    public static readonly LoadIncomesByCategoryChartFailure = "@@chart/loadincomesbycategorychartfailure"
    public static readonly LoadExpensesByCategoryChartFailure = "@@chart/loadexpensesbycategorychartfailure"
}

// action defined as classes with a creator as a static function
export class LoadIncomeExpenseChartAction {
    public static readonly creator = (request: IMonthComparisonChartRequest) => new LoadIncomeExpenseChartAction(request);

    public readonly type = ChartActionTypes.LoadIncomeExpenseChart;

    constructor(
        public request: IMonthComparisonChartRequest
    ) { }
}

export class LoadIncomesByCategoryChartAction {
    public static readonly creator = (request: IMonthComparisonChartRequest) => new LoadIncomesByCategoryChartAction(request);

    public readonly type = ChartActionTypes.LoadIncomesByCategoryChart;

    constructor(
        public request: IMonthComparisonChartRequest
    ) { }
}

export class LoadExpensesByCategoryChartAction {
    public static readonly creator = (request: IMonthComparisonChartRequest) => new LoadExpensesByCategoryChartAction(request);

    public readonly type = ChartActionTypes.LoadExpensesByCategoryChart;

    constructor(
        public request: IMonthComparisonChartRequest
    ) { }
}

export class LoadIncomeExpenseChartSuccessAction {
    public static readonly creator = (chart: IMonthComparisonChartResponse) => new LoadIncomeExpenseChartSuccessAction(chart);

    public readonly type = ChartActionTypes.LoadIncomeExpenseChartSuccess;

    constructor(
        public chart: IMonthComparisonChartResponse
    ) { }
}

export class LoadIncomesByCategoryChartSuccessAction {
    public static readonly creator = (chart: IMonthComparisonChartResponse) => new LoadIncomesByCategoryChartSuccessAction(chart);

    public readonly type = ChartActionTypes.LoadIncomesByCategoryChartSuccess;

    constructor(
        public chart: IMonthComparisonChartResponse
    ) { }
}

export class LoadExpensesByCategoryChartSuccessAction {
    public static readonly creator = (chart: IMonthComparisonChartResponse) => new LoadExpensesByCategoryChartSuccessAction(chart);

    public readonly type = ChartActionTypes.LoadExpensesByCategoryChartSuccess;

    constructor(
        public chart: IMonthComparisonChartResponse
    ) { }
}

export class LoadIncomeExpenseChartFailureAction {
    public static readonly creator = (errorMsg: string) => new LoadIncomeExpenseChartFailureAction(errorMsg);

    public readonly type = ChartActionTypes.LoadIncomeExpenseChartFailure;

    constructor(
        public errorMsg: string
    ) { }
}

export class LoadIncomesByCategoryChartFailureAction {
    public static readonly creator = (errorMsg: string) => new LoadIncomesByCategoryChartFailureAction(errorMsg);

    public readonly type = ChartActionTypes.LoadIncomesByCategoryChartFailure;

    constructor(
        public errorMsg: string
    ) { }
}

export class LoadExpensesByCategoryChartFailureAction {
    public static readonly creator = (errorMsg: string) => new LoadExpensesByCategoryChartFailureAction(errorMsg);

    public readonly type = ChartActionTypes.LoadExpensesByCategoryChartFailure;

    constructor(
        public errorMsg: string
    ) { }
}

// Create a discriminated union of all action typed used to correctly type the
// actions in the reducer switch statement
export type ChartActions =
LoadIncomeExpenseChartSuccessAction |
LoadIncomesByCategoryChartSuccessAction |
LoadExpensesByCategoryChartSuccessAction |
LoadIncomeExpenseChartAction |
LoadIncomesByCategoryChartAction |
LoadExpensesByCategoryChartAction |
LoadIncomeExpenseChartFailureAction |
LoadIncomesByCategoryChartFailureAction |
LoadExpensesByCategoryChartFailureAction 