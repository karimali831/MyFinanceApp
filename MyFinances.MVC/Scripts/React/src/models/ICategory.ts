
export interface ICategory {
    id: number,
    name: string,
    secondTypeId: number
}

export interface ICategoryDTO {
    name: string,
    typeId: number | null
}