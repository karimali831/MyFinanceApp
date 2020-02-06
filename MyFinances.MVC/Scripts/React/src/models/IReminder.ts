export interface IReminder {
    id: number,
    notes: string,
    dueDate: Date,
    addedDate: Date,
    display: boolean,
    priority: number,
    category: string
}

export interface IReminderDTO {
    notes: string,
    dueDate: string,
    priority: number,
    catId: number
}