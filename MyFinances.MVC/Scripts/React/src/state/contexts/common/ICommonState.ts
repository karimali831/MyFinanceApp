import { IDateFilter } from 'src/models/IDateFilter';
import { CategoryType } from 'src/enums/CategoryType';
import { ICategory } from 'src/models/ICategory';

export default interface ICommonState {
    dateFilter?: IDateFilter,
    categoryType?: CategoryType,
    categories: ICategory[],
    secondCategories: ICategory[],
    secondTypeId?: number,
    selectedCat?: number,
    selectedSecondCat?: number,
    loadingCategories: boolean,
    loadingSecondCategories: boolean
}

export class CommonState {
    public static readonly intialState = {
        dateFilter: undefined,
        categoryType: undefined,
        categories: [],
        secondCategories: [],
        secondTypeId: undefined,
        selectedCat: undefined,
        selectedSecondCat: undefined,
        loadingCategories: false,
        loadingSecondCategories: false
    }
}