import * as React from 'react';
import { Load } from '../../../base/Loader';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoadNotificationsAction } from 'src/state/contexts/landing/Actions';
import { commonApi } from 'src/api/CommonApi';
import { priorityBadge } from 'src/components/roots/utils/Utils';
import { IReminder, IReminderNotification } from 'src/models/IReminder';

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
    showOverdueReminders: boolean,
    showDueTodayReminders: boolean,
    showUpcomingReminders: boolean
}

type AllProps = IPropsFromState & IPropsFromDispatch;

export default class Notifications extends React.Component<AllProps, IOwnState> {

    constructor(props: AllProps) {
        super(props);
        this.state = { 
            loadingDeleted: false,
            loading: this.props.loading,
            deletedReminderId: undefined,
            showOverdueReminders: false,
            showDueTodayReminders: true,
            showUpcomingReminders: false
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
                <button type="button" className="btn btn-danger" onClick={() => this.showOverdueReminders()}>
                    <span className="notificationLabel">Overdue</span> <span className="badge">{notifications.overDueReminders.length}</span>
                </button>
                <button type="button" className="btn btn-warning" onClick={() => this.showdueTodayReminders()}>
                    <span className="notificationLabel">Due Today</span> <span className="badge">{notifications.dueTodayReminders.length}</span>
                </button>
                <button type="button" className="btn btn-info" onClick={() => this.showUpcomingReminders()}>
                    <span className="notificationLabel">Upcoming</span> <span className="badge">{notifications.upcomingReminders.length}</span>
                </button>
                <>
                {
                    this.state.showOverdueReminders && notifications.overDueReminders.length > 0 ? 
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
                    this.state.showDueTodayReminders && notifications.dueTodayReminders.length > 0 ? 
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
                    this.state.showUpcomingReminders && notifications.upcomingReminders.length > 0 ? 
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

    private showOverdueReminders = () => {
        this.setState({ ...this.state, showOverdueReminders: !this.state.showOverdueReminders })
    }

    private showdueTodayReminders = () => {
        this.setState({ ...this.state, showDueTodayReminders: !this.state.showDueTodayReminders })
    }

    private showUpcomingReminders = () => {
        this.setState({ ...this.state, showUpcomingReminders: !this.state.showUpcomingReminders})
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