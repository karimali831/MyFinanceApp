export interface IFinance {
    id: number,
    name: string,
    avgMonthlyAmount: number,
    startDate: Date,
    endDate: Date,
    remaining: number,
    paid: number,
    monthlyDueDate: number,
    income: boolean,
    manualPayment: boolean
}

export interface IFinanceDTO {
    name: string,
    catId: number
}