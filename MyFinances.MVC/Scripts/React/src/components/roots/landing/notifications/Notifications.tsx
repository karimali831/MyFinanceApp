import * as React from 'react';
import { Load } from '../../../base/Loader';
import { IFinanceNotification } from 'src/models/IFinance';
import { faExclamationCircle, faEyeSlash, faStickyNote } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { api } from 'src/api/Api';
import { LoadNotificationsAction } from 'src/state/contexts/landing/Actions';

export interface IPropsFromState {
    notifications?: IFinanceNotification,
    loading: boolean,
    type: string
}

export interface IPropsFromDispatch {
    loadNotifications: () => LoadNotificationsAction
}


export interface IOwnState {
    hiddenReminderId?: number,
    loading: boolean,
    showReminders: boolean
}

type AllProps = IPropsFromState & IPropsFromDispatch;

export default class Notifications extends React.Component<AllProps, IOwnState> {

    constructor(props: AllProps) {
        super(props);
        this.state = { 
            loading: this.props.loading,
            hiddenReminderId: undefined,
            showReminders: false
        };
    }

    public componentDidUpdate(prevProps: AllProps, prevState: IOwnState) {
        if (prevState.hiddenReminderId !== this.state.hiddenReminderId) {
            this.props.loadNotifications()
        }
    }

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
                <span onClick={() => this.showReminders()}>
                    <FontAwesomeIcon icon={faStickyNote} /> Show/Hide Reminders
                </span>

                {this.state.showReminders ?
                <>
                {
                    notifications.latePaymentsCount !== 0 || notifications.overDueReminders.length > 0 ? 
                        <div className="alert alert-danger d-flex flex-row" role="alert">
                            <FontAwesomeIcon icon={faExclamationCircle} /> &nbsp;
                            {
                                notifications.latePaymentsCount !== 0 ? <>
                                    <span style={{fontWeight: 'bold'}}>
                                        You have {notifications.latePaymentsCount} late payments totalling £{notifications.latePaymentsTotal}
                                    </span>
                                </> : null
                            }
                            {
                                notifications.overDueReminders.length > 0 ? 
                                    <div style={{fontWeight: 'bold'}}>Overdue reminders: <br />
                                        {notifications.overDueReminders.map(r =>
                                            <div key={r.id}>
                                                <span>due: {r.dueDate}</span> -&nbsp;
                                                <span>{r.notes}</span>&nbsp;
                                                <span onClick={() => this.hideReminder(r.id)}>
                                                    <FontAwesomeIcon icon={faEyeSlash} />
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                : null
                            }
                    </div>
                : null    
                }
                {
                    notifications.dueTodayPaymentsCount !== 0 || notifications.dueTodayReminders.length > 0 ? 
                    <div className="alert alert-danger d-flex flex-row" role="alert">
                        <FontAwesomeIcon icon={faExclamationCircle} className="notification-flash" /> &nbsp;
                            {
                                notifications.dueTodayPaymentsCount !== 0 ? <>
                                    <span style={{fontWeight: 'bold'}}>
                                        You have {notifications.dueTodayPaymentsCount} payments due today totalling £{notifications.dueTodayPaymentsTotal}
                                    </span>
                                </> : null
                            }
                            {
                                notifications.dueTodayReminders.length > 0 ? 
                                    <div style={{fontWeight: 'bold'}}>Reminders due today: <br />
                                        {notifications.dueTodayReminders.map(r =>
                                            <div key={r.id}>
                                                <span>due: {r.dueDate}</span> -&nbsp;
                                                <span>{r.notes}</span>&nbsp;
                                                <span onClick={() => this.hideReminder(r.id)}>
                                                    <FontAwesomeIcon icon={faEyeSlash} />
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                : null
                            }
                    </div>
                : null    
                }
                {
                    notifications.upcomingPaymentsCount !== 0 || notifications.upcomingReminders.length > 0 ? 
                        <div className="alert alert-warning d-flex flex-row" role="alert">
                            <FontAwesomeIcon icon={faExclamationCircle} /> &nbsp;
                                {
                                    notifications.upcomingPaymentsCount !== 0 ? <>
                                    <span style={{fontWeight: 'bold'}}>
                                        You have {notifications.upcomingPaymentsCount} upcoming payments due in the next 7 days totalling £{notifications.upcomingPaymentsTotal}
                                    </span>
                                    </> : null
                                }
                                {
                                    notifications.upcomingReminders.length > 0 ? 
                                    <div style={{fontWeight: 'bold'}}>Upcoming reminders: <br />
                                        {notifications.upcomingReminders.map(r =>
                                            <div key={r.id}>
                                                <span>due: {r.dueDate}</span> -&nbsp;
                                                <span>{r.notes}</span>&nbsp;
                                                <span onClick={() => this.hideReminder(r.id)}>
                                                    <FontAwesomeIcon icon={faEyeSlash} />
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                : null
                                }
                        </div>
                    : null    
                }
                </>
                : null }
            </div>
        )
    }

    private showReminders = () => {
        this.setState({ ...this.state, showReminders: !this.state.showReminders })
    }

    private hideReminder = (id: number) => {
        this.setState({ ...this.state, loading: true, hiddenReminderId: id })
  
        api.hideReminder(id)
          .then(() => this.hideReminderSuccess(id));
    }

    private hideReminderSuccess = (id: number) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false
            }
        }) 
      }

}