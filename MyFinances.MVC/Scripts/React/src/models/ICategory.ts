
export interface ICategory {
    id: number,
    name: string,
    typeId: number,
    secondTypeId: number,
    disabled: boolean,
    monzoTag: string
}

export interface ICategoryDTO {
    name: string,
    typeId: number | null
}