import { IFinanceNotification } from 'src/models/IFinance';

export default interface INotificationState {
    notifications?: IFinanceNotification,
    type: string,
    loading: boolean,
}

export class NotificationState {
    public static readonly intialState = {
        notifications: undefined,
        type: "",
        loading: true
    }
}