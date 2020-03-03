import { PaymentStatus } from 'src/enums/PaymentStatus';

export interface IReminder {
    id: number,
    notes: string,
    dueDate?: Date,
    paymentStatus: PaymentStatus
    priority: string,
    category: string
}

export interface IReminderDTO {
    notes: string,
    dueDate: string,
    priority: number,
    catId: number
}

export interface IReminderNotification {
    overDueReminders: IReminder[],
    upcomingReminders: IReminder[],
    dueTodayReminders: IReminder[],
    alerts: IReminder[]
}