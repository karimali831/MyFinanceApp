import { IReminder } from './IReminder';

export interface IFinance {
    id: number,
    name: string,
    avgMonthlyAmount: number,
    startDate: Date,
    endDate: Date,
    monthlyDueDate: number,
    nextDueDate: Date,
    overrideNextDueDate: number,
    remaining: number,
    totalAmount: number,
    totalPaid: number,
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

export interface IFinanceNotification {
    latePaymentsCount: number,
    latePaymentsTotal: number,
    upcomingPaymentsCount: number,
    upcomingPaymentsTotal: number,
    dueTodayPaymentsCount: number,
    dueTodayPaymentsTotal: number,
    overDueReminders: IReminder[],
    upcomingReminders: IReminder[],
    dueTodayReminders: IReminder[]
}