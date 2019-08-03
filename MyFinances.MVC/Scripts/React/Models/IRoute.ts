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
    routeTypeId: number,
    routeDate: Date,
    mileage: number,
    drops: number,
    extraDrops: number,
    info: string
}
