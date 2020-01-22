export interface IReminder {
    id: number,
    notes: string,
    dueDate: Date,
    addedDate: Date,
    display: boolean
}

export interface IReminderDTO {
    notes: string,
    dueDate: string,
}