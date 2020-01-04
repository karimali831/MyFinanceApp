export default interface IIncomeState {
    error: string | null
}

export class IncomeState {
    public static readonly intialState = {
        error: null
    }
}