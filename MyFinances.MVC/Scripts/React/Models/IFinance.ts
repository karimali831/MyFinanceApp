export interface IFinance {
    id: number,
    name: string,
    avgMonthlyAmount: number,
    startDate: Date,
    endDate: Date,
    remaining: number,
    paid: number,
    monthlyDueDate: number,
    manualPayment: boolean,
    daysUntilDue: number,
    paymentStatus: PaymentStatus
}

export enum PaymentStatus {
    Paid,
    Upcoming,
    Late,
    Unknown,
    DueToday
}

export interface IFinanceDTO {
    name: string,
    catId: number
}