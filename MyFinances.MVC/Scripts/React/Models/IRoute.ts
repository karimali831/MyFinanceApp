import { ICategory } from './ICategory'

export interface IRoute {
    id: number,
    routeNo: string,
    routeType: string
    routeDate: Date,
    mileage: number,
    drops: string,
    extraDrops: number,
    info: string
}

export interface IRouteDTO {
    routeNo: string,
    routeTypeId: ICategory
    routeDate: Date,
    mileage: number,
    extraDrops: number,
    info: string
}
