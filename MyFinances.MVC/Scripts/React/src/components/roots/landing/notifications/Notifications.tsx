import * as React from 'react';
import { Load } from '../../../base/Loader';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoadNotificationsAction } from 'src/state/contexts/landing/Actions';
import { commonApi } from 'src/api/CommonApi';
import { priorityBadge } from 'src/components/utils/Utils';
import { IReminder, IReminderNotification } from 'src/models/IReminder';
import { ReminderType } from 'src/enums/ReminderType';

export interface IPropsFromState {
    notifications?: IReminderNotification,
    loading: boolean,
    type: string
}

export interface IPropsFromDispatch {
    loadNotifications: () => LoadNotificationsAction
}

export interface IOwnState {
    deletedReminderId?: number,
    loadingDeleted: boolean,
    loading: boolean,
    showReminders: ReminderType
}

type AllProps = IPropsFromState & IPropsFromDispatch;

export default class Notifications extends React.Component<AllProps, IOwnState> {

    constructor(props: AllProps) {
        super(props);
        this.state = { 
            loadingDeleted: false,
            loading: this.props.loading,
            deletedReminderId: undefined,
            showReminders: ReminderType.DueToday
        };
    }

    public componentDidUpdate(prevProps: AllProps, prevState: IOwnState) {
        if (prevState.deletedReminderId !== this.state.deletedReminderId) {
            this.props.loadNotifications()
        }
    }

    public render() {
        const { loading, notifications } = this.props;

        if (loading) {
            return <Load text="Loading notifications..." />
        }

        if (this.state.loadingDeleted) {
            return <Load />
        }

        if (notifications === undefined) {
            return;
        }

        return (
            <div>
                <button type="button" className="btn btn-danger" onClick={() => this.showReminders(ReminderType.Overdue)}>
                    <span className="notificationLabel">Overdue</span> <span className="badge">{notifications.overDueReminders.length}</span>
                </button>
                <button type="button" className="btn btn-warning" onClick={() => this.showReminders(ReminderType.DueToday)}>
                    <span className="notificationLabel">Due Today</span> <span className="badge">{notifications.dueTodayReminders.length}</span>
                </button>
                <button type="button" className="btn btn-info" onClick={() => this.showReminders(ReminderType.Upcoming)}>
                    <span className="notificationLabel">Upcoming</span> <span className="badge">{notifications.upcomingReminders.length}</span>
                </button>
                <button type="button" className="btn btn-dark" onClick={() => this.showReminders(ReminderType.Alert)}>
                    <span className="notificationLabel">Alerts</span> <span className="badge">{notifications.alerts.length}</span>
                </button>
                <>
                {
                    this.state.showReminders === ReminderType.Overdue && notifications.overDueReminders.length > 0 ? 
                        <div className="alert alert-danger d-flex flex-row" role="alert">
                            {
                                notifications.overDueReminders.length > 0 ? 
                                    <div style={{display: 'block'}}>
                                    {
                                        notifications.overDueReminders.map(r =>
                                            this.notificationCard(r)
                                        )
                                    }
                                    </div>
                                : null
                            }
                        </div>
                    : null    
                }
                {
                    this.state.showReminders === ReminderType.DueToday && notifications.dueTodayReminders.length > 0 ? 
                        <div className="alert alert-warning d-flex flex-row" role="alert">
                            {
                                notifications.dueTodayReminders.length > 0  ? 
                                    <div style={{display: 'block'}}>
                                    {
                                        notifications.dueTodayReminders.map(r =>
                                            this.notificationCard(r, true)
                                        )
                                    }
                                    </div>
                                : null
                            }
                        </div>
                : null    
                }
                {
                    this.state.showReminders === ReminderType.Upcoming && notifications.upcomingReminders.length > 0 ? 
                        <div className="alert alert-info d-flex flex-row" role="alert">
                            {
                                notifications.upcomingReminders.length > 0 ? 
                                    <div style={{display: 'block'}}>
                                    {
                                        notifications.upcomingReminders.map(r =>
                                            this.notificationCard(r)
                                        )
                                    }
                                    </div>
                                : null
                            }
                        </div>
                    : null    
                }
                {
                    this.state.showReminders === ReminderType.Alert && notifications.alerts.length > 0 ? 
                        <div className="alert alert-dark d-flex flex-row" role="alert">
                            {
                                notifications.alerts.length > 0 ? 
                                    <div style={{display: 'block'}}>
                                    {
                                        notifications.alerts.map(r =>
                                            this.notificationCard(r)
                                        )
                                    }
                                    </div>
                                : null
                            }
                        </div>
                    : null    
                }
                </>
            </div>
        )
    }

    private notificationCard = (reminder: IReminder, dueToday: boolean = false) => {
        return (
            <div key={reminder.id}>
                <span onClick={() => this.deleteReminder(reminder.id)}>
                    <FontAwesomeIcon icon={faTimes} />
                </span> 
                &nbsp;
                {priorityBadge(reminder.priority, reminder.category)} &nbsp;
                {(dueToday || reminder.dueDate === null) ? "" : <><span className="label label-default">due: {reminder.dueDate}</span>&nbsp;</>} 
                <span>{reminder.notes}</span>&nbsp;
            </div>
        )
    }

    private showReminders = (reminderType: ReminderType) => {
        this.setState({ ...this.state,  showReminders: reminderType })
    }

    private deleteReminder = (id: number) => {
        this.setState({ ...this.state, loadingDeleted: true, deletedReminderId: id })
  
        commonApi.remove(id, "Reminders")
          .then(() => this.deleteReminderSuccess());
    }

    private deleteReminderSuccess = () => {
        this.setState({ ...this.state,
            ...{ 
                loadingDeleted: false
            }
        }) 
      }

}