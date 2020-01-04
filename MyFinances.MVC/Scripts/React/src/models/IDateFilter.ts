import { DateFrequency } from '../enums/DateFrequency'

export interface IDateFilter {
    frequency?: DateFrequency | undefined,
    interval?: number | undefined,
    dateField?: string,
    fromDateRange: string | null,
    toDateRange: string | null
}