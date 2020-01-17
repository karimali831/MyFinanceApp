export interface IIncome {
    id: number,
    source: string,
    secondSource: string,
    date: Date,
    amount: number
}

export interface IIncomeDTO {
    sourceId: number,
    secondCatId: number | undefined,
    date: string,
    amount: number
}

export interface IIncomeSummary {
    cat1: string,
    catId: number,
    secondCatId: number,
    isFinance: boolean, // remove this
    cat2: string,
    secondCats: IIncomeSummary[],
    total: number,
}

export interface IBaseModel<T> {
    cat1: string,
    catId: number,
    secondCatId: number,
    isFinance: boolean,
    cat2: string,
    secondCats: T[],
    total: number
}