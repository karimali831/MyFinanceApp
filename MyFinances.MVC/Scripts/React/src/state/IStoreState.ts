import ICommonState, { CommonState } from './contexts/common/ICommonState';
// import ICWTLState, { CWTLState } from './contexts/cwtl/ICWTLState';
// import IFinanceState, { FinanceState } from './contexts/finance/IFinanceState';
// import IIncomeState, { IncomeState } from './contexts/income/IIncomeState';
// import ISpendingState, { SpendingState } from './contexts/spending/ISpendingState';
import ISpendingSummaryState, { SpendingSummaryState } from './contexts/landing/ISpendingSummaryState';
// import IErrorState, { ErrorState } from './contexts/error/IErrorState';
import { IRouteState, RouteState } from './contexts/router/IRouteState';
import IIncomeSummaryState, { IncomeSummaryState } from './contexts/landing/IIncomeSummaryState';

// this represents the state of the 'entire' application
// it should be composed of other state definitions which represent state 'contexts'
// managed by seperate reducers and have actions which alter those contexts

export default interface IStoreState {
    router: IRouteState,
    common: ICommonState,
    // cwtl: ICWTLState,
    // finance: IFinanceState
    // error: IErrorState,
    // income: IIncomeState,
    // spending: ISpendingState,
    spendingSummary: ISpendingSummaryState,
    incomeSummary: IIncomeSummaryState
}

export class StoreState {
    public static readonly initialState: IStoreState = {
        router: RouteState.initialState,
        common: CommonState.intialState,
        // cwtl: CWTLState.intialState,
        // finance: FinanceState.intialState,
        // error: ErrorState.intialState,
        // income: IncomeState.intialState,
        // spending: SpendingState.intialState,
        spendingSummary: SpendingSummaryState.intialState,
        incomeSummary: IncomeSummaryState.intialState
    };
}

