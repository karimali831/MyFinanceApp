export interface ISpending {
    id: number,
    name: string,
    amount: number,
    date: Date,
    info: string,
    category: string
}

export interface ISpendingDTO {
    name: string,
    amount: number,
    catId: number
}