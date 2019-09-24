export interface IIncome {
    id: number,
    source: string,
    secondSource: string,
    date: Date,
    amount: number
}

export interface IIncomeDTO {
    sourceId: number,
    secondCatId: number,
    date: string,
    amount: number
}

export interface IIncomeSummary {
    source: string,
    sourceId: number,
    secondSource: string,
    secondCats: IIncomeSummary[],
    totalIncome: number,
}