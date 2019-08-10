import { ICategory } from '../Models/ICategory'
import { ISpending, ISpendingSummary} from '../Models/ISpending'
import { IFinance } from '../Models/IFinance'
import { IRoute } from '../Models/IRoute'

export class Api {

    public rootUrl: string = window.location.origin + "/api";

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

    public routes = async (): Promise<ICNWResponse> => {
        return fetch(`${this.rootUrl}/cnw`, {
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
}

export const api = new Api();

export interface ISpendingResponse {
    spendings: ISpending[]
}

export interface ICategoryResponse {
    categories: ICategory[]
}

export interface ISpendingSummaryResponse {
    spendingSummary: ISpendingSummary
}

export interface IFinanceResponse {
    finances: IFinance[]
    totalAvgCost: number
}

export interface ICNWResponse {
    routes: IRoute[]
    calculatedWeeklyPay: number
}