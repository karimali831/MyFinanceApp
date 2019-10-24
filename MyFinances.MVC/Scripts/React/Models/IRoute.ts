export interface IRoute {
    id: number,
    weekNo: string,
    routeType: string
    routeDate: Date,
    mileage: number,
    extaMileage: number,
    mpg: number,
    extraDrops: number,
    info: string,
    fuelCost: number
}

export interface IRouteDTO {
    routeTypeId: number,
    routeDate: string,
    mileage: number,
    extraMileage: number,
    mpg: number
    extraDrops: number,
    info: string,
    fuelCost: number
}
