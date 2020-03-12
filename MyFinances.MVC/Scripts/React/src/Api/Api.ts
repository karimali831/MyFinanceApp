import { ICategory } from '../models/ICategory'
import { ISpending, ISpendingSummary } from '../models/ISpending'
import { IFinance } from '../models/IFinance'
import { IRoute } from '../models/IRoute'
import { IIncome, IIncomeSummary } from '../models/IIncome';
import { ICNWPayment } from '../models/ICNWPayment';
import { IDateFilter } from '../models/IDateFilter';
import { rootUrl } from '../components/utils/Utils';
import { IReminder, IReminderNotification } from 'src/models/IReminder';
import { IMonthComparisonChart, IChartSummary } from 'src/models/IChart';
import { CategoryType } from 'src/enums/CategoryType';

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
        return fetch(`${this.rootUrl}/incomes/summary`, {
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
        return fetch(`${this.rootUrl}/reminders/notifications`, {
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

    public monthlyComparison = async (request: IMonthComparisonChartRequest, subUrl: string): Promise<IMonthComparisonChartResponse> => {
        return fetch(`${this.rootUrl}/${subUrl}`, {
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
        .then(data => data as IMonthComparisonChartResponse);
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
        return fetch(`${this.rootUrl}/incomes`, {
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

    public reminders = async (): Promise<IReminderResponse> => {
        return fetch(`${this.rootUrl}/reminders`, {
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
        .then(data => data as IReminderResponse);
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

export interface IMonthComparisonChartRequest
{
    dateFilter?: IDateFilter,
    catId?: number,
    secondCatId?: number,
    isFinance?: boolean,
    categoryType?: CategoryType
}

export interface IMonthComparisonChartResponse
{
    summary: IChartSummary,
    title: string,
    data: IMonthComparisonChart[]
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
    notifications: IReminderNotification
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

export interface IReminderResponse {
    reminders: IReminder[]
}