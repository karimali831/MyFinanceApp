import { ICategory } from '../Models/ICategory'
import { ISpending, ISpendingSummary} from '../Models/ISpending'
import { IFinance } from '../Models/IFinance'
import { IRoute } from '../Models/IRoute'
import { IIncome, IIncomeSummary } from '../Models/IIncome';
import { ICNWPayment } from '../Models/ICNWPayment';
import { rootUrl } from '../Typescript/Utils';

export class Api {

    public rootUrl: string = `${rootUrl}/api`;

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

    public summary = async (daysPeriod: number): Promise<ISpendingSummaryResponse> => {
        return fetch(`${this.rootUrl}/spendings/summary/${daysPeriod}`, {
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
        .then(data => data as ISpendingSummaryResponse);
    }

    public incomeSummary = async (monthsPeriod: number): Promise<IIncomeSummaryResponse> => {
        return fetch(`${this.rootUrl}/finances/summary/income/${monthsPeriod}`, {
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
        .then(data => data as IIncomeSummaryResponse);
    }

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

    public incomes = async (): Promise<IIncomeResponse> => {
        return fetch(`${this.rootUrl}/finances/incomes`, {
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
        .then(data => data as IIncomeResponse);
    }

    public weekSummaries = async (): Promise<IWeekSummariesResponse> => {
        return fetch(`${this.rootUrl}/cnw/weeksummaries`, {
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
        .then(data => data as IWeekSummariesResponse);
    }

    public routes = async (weekNo?: number): Promise<ICNWResponse> => {
        return fetch(`${this.rootUrl}/cnw/${weekNo}`, {
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
        .then(data => data as ICNWResponse);
    }

    public syncWeek = async (date: string) => {
        return fetch(`${this.rootUrl}/cnw/syncweek/${date}`, {
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

export const api = new Api();

export interface ISpendingResponse {
    spendings: ISpending[]
}

export interface ICategoryResponse {
    categories: ICategory[]
}

export interface ISpendingSummaryResponse {
    spendingSummary: ISpendingSummary[],
    totalSpent: number,
    fuelIn: number
}

export interface IIncomeSummaryResponse {
    incomeSummary: IIncomeSummary
}

export interface IFinanceResponse {
    finances: IFinance[]
    totalAvgCost: number
}

export interface IIncomeResponse {
    incomes: IIncome[]
}

export interface ICNWResponse {
    routes: IRoute[]
    calculatedWeeklyPay: number
}

export interface IWeekSummariesResponse {
    weekSummaries: ICNWPayment[]
}