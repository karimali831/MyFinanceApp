import { ICategory } from '../Models/ICategory'
import { ISpending} from '../Models/ISpending'
import { IFinance } from '../Models/IFinance'
import { IRoute } from '../Models/IRoute'
import { CategoryType } from '../Enums/CategoryType'

export class Api {

    public devRootUrl: string = "http://localhost:53822/api";
    public rootUrl: string = "http://myfinanceapp.developforme.com/api";

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

export interface ISummaryResponse {
    totalSpent: number[]
}

export interface IFinanceResponse {
    finances: IFinance[]
    totalAvgCost: number
}

export interface ICNWResponse {
    routes: IRoute[]
    calculatedWeeklyPay: number
}