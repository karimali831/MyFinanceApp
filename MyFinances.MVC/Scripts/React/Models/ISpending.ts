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
    secondCatId: number
}

export interface ISpendingSummary
{
    totalSpent: number,
    totalFuelCost: number,
    totalFuelCostByType: number[],
    totalFoodCost: number
}