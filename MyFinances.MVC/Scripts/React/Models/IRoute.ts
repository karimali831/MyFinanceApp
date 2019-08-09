export interface IRoute {
    id: number,
    routeNo: string,
    routeType: string
    routeDate: Date,
    mileage: number,
    extaMileage: number,
    mpg: number,
    drops: string,
    extraDrops: number,
    info: string
}

export interface IRouteDTO {
    routeNo: string,
    routeTypeId: number,
    routeDate: string,
    mileage: number,
    extaMileage: number,
    mpg: number
    drops: number,
    extraDrops: number,
    info: string
}
