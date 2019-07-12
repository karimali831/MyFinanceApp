export class Api {

    public rootUrl: string = "http://localhost:53822";

    public finances = async (): Promise<IFinanceResponse> => {
        return fetch(`${this.rootUrl}/api/finances/all`, {
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
}

export const financeApi = new Api();

export interface IFinanceResponse {
    finances: IFinances[]
}

export interface IFinances {
    id: number,
    name: string
}