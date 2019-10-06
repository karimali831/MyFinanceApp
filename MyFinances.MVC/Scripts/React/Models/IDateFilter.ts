import { DateFrequency } from '../Enums/DateFrequency'

export interface IDateFilter {
    frequency?: DateFrequency,
    interval?: number,
    dateField?: string,
    fromDateRange?: string,
    toDateRange?: string
}