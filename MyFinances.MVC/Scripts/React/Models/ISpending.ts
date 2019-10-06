import { IDateFilter } from '../Models/IDateFilter'

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
    cat1: string,
    catId: number,
    secondCatId: number,
    isFinance: boolean,
    cat2: string,
    secondCats: ISpendingSummary[],
    totalSpent: number,
}

export interface ISpendingRequestDTO 
{
    catId: number,
    dateFilter: IDateFilter,
    isFinance: boolean,
    isSecondCat: boolean
}