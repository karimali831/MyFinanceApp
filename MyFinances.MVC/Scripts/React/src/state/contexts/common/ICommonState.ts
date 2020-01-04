import { IDateFilter } from 'src/models/IDateFilter';
import { CategoryType } from 'src/enums/CategoryType';

export default interface ICommonState {
    dateFilter?: IDateFilter | undefined,
    categoryType: CategoryType,
    loading: boolean
}

export class CommonState {
    public static readonly intialState = {
        dateFilter: undefined,
        categoryType: undefined,
        loading: true
    }
}