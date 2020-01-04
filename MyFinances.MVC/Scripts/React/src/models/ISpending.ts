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
    catId: number | undefined,
    secondCatId: number | undefined,
    financeId: number | undefined
}

export interface ISpendingSummary
{
    cat1: string,
    catId: number,
    secondCatId: number,
    isFinance: boolean,
    cat2: string,
    secondCats: ISpendingSummary[],
    totalSpent: number,
}