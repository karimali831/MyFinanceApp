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
    totalIncome: number,
    incomeSB: number,
    incomeCWTL: number,
    incomeUberEats: number
}