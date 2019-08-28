import { WeekPeriodSync } from '../Enums/WeekPeriodSync'

export interface IRoute {
    id: number,
    weekNo: string,
    routeType: string
    routeDate: Date,
    mileage: number,
    extaMileage: number,
    mpg: number,
    drops: string,
    extraDrops: number,
    info: string,
    weekstartPeriod: WeekPeriodSync
}

export interface IRouteDTO {
    routeTypeId: number,
    routeDate: string,
    mileage: number,
    extraMileage: number,
    mpg: number
    drops: number,
    extraDrops: number,
    info: string
}
