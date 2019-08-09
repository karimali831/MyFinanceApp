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
    date: Date,
    amount: number,
    catId: number,
    secondCatId: number
}