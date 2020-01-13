import { IDateFilter } from 'src/models/IDateFilter';
import { CategoryType } from 'src/enums/CategoryType';

// action types
export class CommonActionTypes {

    public static readonly DateFilterChange = "@@common/datefilterchange"
    public static readonly DateFilterChangeSuccess = "@@common/datefilterchangesuccess"
}

// action defined as classes with a creator as a static function
export class DateFilterChangeAction {
    public static readonly creator = (filter: IDateFilter, categoryType: CategoryType) => new DateFilterChangeAction(filter, categoryType);

    public readonly type = CommonActionTypes.DateFilterChange

    constructor(
        public filter: IDateFilter,
        public categoryType: CategoryType 
    ) { }
}

export class DateFilterChangeSuccessAction {
    public static readonly creator = () => new DateFilterChangeSuccessAction();

    public readonly type = CommonActionTypes.DateFilterChangeSuccess;

}

// Create a discriminated union of all action typed used to correctly type the
// actions in the reducer switch statement
export type CommonActions =
    DateFilterChangeAction |
    DateFilterChangeSuccessAction 