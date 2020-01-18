import * as React from 'react';
import { Load } from '../../../base/Loader';
import { IFinanceNotification } from 'src/models/IFinance';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface IPropsFromState {
    notifications?: IFinanceNotification,
    loading: boolean,
    type: string
}

export interface IPropsFromDispatch {

}

type AllProps = IPropsFromState & IPropsFromDispatch;

export default class Notifications extends React.Component<AllProps> {

    public render() {
        const { loading, notifications } = this.props;

        if (loading) {
            return <Load text="Loading notifications..." />
        }

        if (notifications === undefined) {
            return;
        }

        return (
            <div>
                {
                    notifications.latePaymentsCount !== 0 ? 
                        <div className="alert alert-danger d-flex flex-row" role="alert">
                            <FontAwesomeIcon icon={faExclamationCircle} /> &nbsp;
                            <span style={{fontWeight: 'bold'}}>You have {notifications.latePaymentsCount} late payments totalling £{notifications.latePaymentsTotal}</span>
                        </div>
                :    null    
                }
                {
                    notifications.dueTodayPaymentsCount !== 0 ? 
                    <div className="alert alert-danger d-flex flex-row notification-flash" role="alert">
                        <FontAwesomeIcon icon={faExclamationCircle} /> &nbsp;
                        <span style={{fontWeight: 'bold'}}>You have {notifications.dueTodayPaymentsCount} payments due today totalling £{notifications.dueTodayPaymentsTotal}</span>
                    </div>
                : null    
                }
                {
                    notifications.upcomingPaymentsCount !== 0 ? 
                        <div className="alert alert-warning d-flex flex-row" role="alert">
                            <FontAwesomeIcon icon={faExclamationCircle} /> &nbsp;
                            <span style={{fontWeight: 'bold'}}>You have {notifications.upcomingPaymentsCount} upcoming payments due in the next 7 days totalling £{notifications.upcomingPaymentsTotal}</span>
                        </div>
                    : null    
                }
            </div>
        )
    }
}