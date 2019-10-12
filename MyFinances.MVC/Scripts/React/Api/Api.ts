import { ICategory } from '../Models/ICategory'
import { ISpending, ISpendingSummary, ISpendingRequestDTO } from '../Models/ISpending'
import { IFinance } from '../Models/IFinance'
import { IRoute } from '../Models/IRoute'
import { IIncome, IIncomeSummary } from '../Models/IIncome';
import { ICNWPayment } from '../Models/ICNWPayment';
import { rootUrl } from '../Typescript/Utils';
import { DateFrequency } from '../Enums/DateFrequency';
import { IDateFilter } from '../Models/IDateFilter';

export class Api {

    public rootUrl: string = `${rootUrl}/api`;

    public spendings = async (request: ISpendingRequestDTO): Promise<ISpendingResponse> => {
        return fetch(`${this.rootUrl}/spendings`, {
            method: "POST",
            body: JSON.stringify(request),
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

    public summary = async (dateFilter: IDateFilter): Promise<ISpendingSummaryResponse> => {
        return fetch(`${this.rootUrl}/spendings/summary`, {
            method: "POST",
            body: JSON.stringify(dateFilter),
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

    public incomeSummary = async (dateFilter: IDateFilter): Promise<IIncomeSummaryResponse> => {
        return fetch(`${this.rootUrl}/finances/summary/income`, {
            method: "POST",
            body: JSON.stringify(dateFilter),
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

    public finances = async (resyncNextDueDates = false, upcomingPayments = false): Promise<IFinanceResponse> => {
        return fetch(`${this.rootUrl}/finances/${resyncNextDueDates}/${upcomingPayments}`, {
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

    public incomes = async (dateFilter: IDateFilter, sourceId?: number): Promise<IIncomeResponse> => {
        return fetch(`${this.rootUrl}/finances/incomes/${sourceId}`, {
            method: "POST",
            body: JSON.stringify(dateFilter),
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
    incomeSummary: IIncomeSummary[],
    totalIncome: number
}

export interface IFinanceResponse {
    finances: IFinance[]
    totalAvgCost: number,
    spentThisMonth,
    spentLastMonth
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