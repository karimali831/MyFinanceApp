export class Api {

    public rootUrl: string = "http://localhost:53822/api";

    public finances = async (): Promise<IFinanceResponse> => {
        return fetch(`${this.rootUrl}/finances`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'same-origin',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(data => data as IFinanceResponse);
    }

    public spendings = async (): Promise<ISpendingResponse> => {
        return fetch(`${this.rootUrl}/spendings`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'same-origin',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(data => data as ISpendingResponse);
    }

    public categories = async (): Promise<ICategoryResponse> => {
        return fetch(`${this.rootUrl}/spendings/categories`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'same-origin',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(data => data as ICategoryResponse);
    }

    public summary = async (): Promise<ISummaryResponse> => {
        return fetch(`${this.rootUrl}/spendings/summary`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'same-origin',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(data => data as ISummaryResponse);
    }

    public addExpense = async (name: string) => {
        return fetch(`${this.rootUrl}/finances/add/${name}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'same-origin',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        })
    }

    public addSpending = async (name: string, catId: number, amount: number) => {
        return fetch(`${this.rootUrl}/spendings/add/${name}/${catId}/${amount}/`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'same-origin',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        })
    }

    public updateExpense = async (field: string, value: any, id: number) => {
        return fetch(`${this.rootUrl}/finances/update/${field}/${id}/${value}/`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'same-origin',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        })
    }

    public updateSpending = async (field: string, value: any, id: number) => {
        return fetch(`${this.rootUrl}/spendings/update/${field}/${id}/${value}/`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'same-origin',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        })
    }

    public removeExpense = async (id: number) => {
        return fetch(`${this.rootUrl}/finances/delete/${id}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'same-origin',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        })
    }

    public removeSpending = async (id: number) => {
        return fetch(`${this.rootUrl}/spendings/delete/${id}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'same-origin',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        })
    }
}

export const financeApi = new Api();

export interface IFinanceResponse {
    finances: IFinance[]
    totalAvgCost: number
}

export interface ISpendingResponse {
    spendings: ISpending[]
}

export interface ICategoryResponse {
    categories: ICategory[]
}

export interface ISummaryResponse {
    totalSpent: number[]
}

export interface IFinance {
    id: number,
    name: string,
    avgMonthlyAmount: number,
    type: string,
    startDate: Date,
    endDate: Date,
    remaining: number,
    paid: number,
    monthlyDueDate: Date
}

export interface ISpending {
    id: number,
    name: string,
    amount: number,
    date: Date,
    info: string,
    category: string
}

export interface ICategory {
    id: number,
    name: string
}