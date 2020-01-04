
// action types
export class IncomeActionTypes {
    public static readonly Income = "@@income/income"
}

// action defined as classes with a creator as a static function

export class IncomeAction {
    public static readonly creator = (IncomeMessage: string) => new IncomeAction(IncomeMessage);

    public readonly type = IncomeActionTypes.Income;

    constructor(
        public IncomeMessage: string,
    ) { }
}

// Create a discriminated union of all action typed used to correctly type the
// actions in the reducer switch statement
export type IncomeActions =
    IncomeAction 