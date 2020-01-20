export interface IReminder {
    id: number,
    notes: string,
    dueDate: Date,
    addedDate: Date
}

export interface IReminderDTO {
    notes: string,
    dueDate: string,
}