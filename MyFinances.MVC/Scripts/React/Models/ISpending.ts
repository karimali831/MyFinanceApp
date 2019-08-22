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
    totalSpent: number,
    fuelCost: number,
    fuelCostByType: number[],
    fuelIn: number,
    foodCost: number,
    interestAndFees: number,
    overdraftFees: number,
    creditcardFees: number
}