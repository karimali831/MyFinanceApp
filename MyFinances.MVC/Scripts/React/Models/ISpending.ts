export interface ISpending {
    id: number,
    name: string,
    amount: number,
    date: Date,
    info: string,
    category: string,
    secondCategory: string
}

export interface ISpendingDTO {
    name: string,
    date: string,
    amount: number,
    catId: number,
    secondCatId: number,
    financeId: number
}

export interface ISpendingSummary
{
    firstCats: ISpendingSummaryCats[],
    secondCats: ISpendingSummarySecondCats[]
}

export interface ISpendingSummaryCats
{
    cat1: string,
    cat2: string,
    totalSpent: number,
}

export interface ISpendingSummarySecondCats
{
    category: string,
    totalSpent: number,
    secondCats: ISpendingSummaryCats[]
}