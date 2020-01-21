import { ICategory } from '../models/ICategory'
import { ISpending, ISpendingSummary } from '../models/ISpending'
import { IFinance, IFinanceNotification } from '../models/IFinance'
import { IRoute } from '../models/IRoute'
import { IIncome, IIncomeSummary } from '../models/IIncome';
import { ICNWPayment } from '../models/ICNWPayment';
import { IDateFilter } from '../models/IDateFilter';
import { rootUrl } from '../components/roots/utils/Utils';

export class FinanceApi {

    public rootUrl: string = `${rootUrl}/api`;

    public spendings = async (request?: ISpendingRequest): Promise<ISpendingResponse> => {
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

    public notifications = async (): Promise<INotificationResponse> => {
        return fetch(`${this.rootUrl}/finances/notifications`, {
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
        .then(data => data as INotificationResponse);
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

    public incomes = async (request?: IIncomeRequest): Promise<IIncomeResponse> => {
        return fetch(`${this.rootUrl}/finances/incomes`, {
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

    public resyncWeek = async (weekNo: number) => {
        return fetch(`${this.rootUrl}/cnw/resyncweek/${weekNo}`, {
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

    public hideReminder = async (id: number) => {
        return fetch(`${this.rootUrl}/reminders/hide/${id}`, {
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

export const api = new FinanceApi();

export interface ISpendingRequest
{
    catId?: number | null,
    dateFilter?: IDateFilter,
    isFinance?: boolean,
    isSecondCat?: boolean
}

export interface IIncomeRequest
{
    sourceId?: number | null,
    dateFilter?: IDateFilter,
    isSecondCat?: boolean
}

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

export interface INotificationResponse {
    notifications: IFinanceNotification
}

export interface IFinanceResponse {
    finances: IFinance[]
    totalAvgCost: number,
    spentThisMonth: number,
    spentLastMonth : number
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