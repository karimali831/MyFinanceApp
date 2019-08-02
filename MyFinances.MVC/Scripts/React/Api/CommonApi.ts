import { ICategoryResponse } from './Api';
import { CategoryType } from '../Enums/CategoryType';

export class CommonApi {

    public rootUrl: string = "http://localhost:53822/api";

    public add = async (model: any, route: string) => {
        return fetch(`${this.rootUrl}/${route}/add`, {
            method: "POST",
            body: JSON.stringify(model),
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

    public update = async (table: string, field: string, value: any, id: number) => {
        return fetch(`${this.rootUrl}/update/${table}/${field}/${id}/${value}/`, {
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

    public remove = async (id: number, table: string) => {
        return fetch(`${this.rootUrl}/delete/${id}/${table}`, {
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

    public categories = async (typeId: CategoryType): Promise<ICategoryResponse> => {
        return fetch(`${this.rootUrl}/categories/${typeId}`, {
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
}

export const commonApi = new CommonApi();
