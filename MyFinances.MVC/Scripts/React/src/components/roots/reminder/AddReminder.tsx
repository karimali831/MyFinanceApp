import * as React from 'react';
import { commonApi } from '../../../api/CommonApi'
import { Redirect } from 'react-router-dom'
import { Load } from '../../base/Loader';
import { AddMenu } from '../../base/Menu';
import { IReminderDTO } from '../../../models/IReminder';
import { Priority } from 'src/enums/Priority';

import SelectionRefinementForReminderCategories from './SelectionRefinementForReminderCategories';
import { cleanText } from '../../utils/Utils';

export interface IPropsFromState {
    selectedCat?: number
}

export interface IOwnState {
    loading: boolean,
    redirect: boolean,
    notes: string,
    dueDate: string,
    priority: string,
    alert: boolean,
    reminder: boolean
}

export default class AddReminder extends React.Component<IPropsFromState, IOwnState> {
    constructor(props: IPropsFromState) {
        super(props);
        this.state = { 
            loading: false,
            redirect: false,
            notes: "",
            dueDate: "",
            priority: Priority[Priority.Low],
            alert: false,
            reminder: true
        };
    }

    public render() {
        const { redirect, loading } = this.state;

        if (redirect) {
            return <Redirect to='/home'/>;
        }

        if (loading) {
            return <Load text="Loading..."/>
        }

        return (
            <div>
                {AddMenu("reminder")}
                <form className="form-horizontal">
                    <div className="form-check form-check-lg" style={{display:'inline',padding: '5px', marginRight: '2px'}}>
                        <input id="reminder" type="radio" name="type" className="form-check-input" checked={this.state.reminder} onChange={(e) => { this.onTypeChanged(e);}} />
                        <label className="form-check-label" htmlFor="reminder">
                            Reminder
                        </label>
                    </div>
                    <div className="form-check form-check-lg" style={{display:'inline',padding: '5px', marginRight: '2px'}}>
                        <input id="alert" type="radio" name="type" className="form-check-input" checked={this.state.alert} onChange={(e) => { this.onTypeChanged(e);}} />
                        <label className="form-check-label" htmlFor="alert">
                            Alert
                        </label>
                    </div>
                    {this.state.reminder ?
                        <>
                            <div className="form-group form-group-lg">
                                <label htmlFor="dueDate" className="control-label">Due Date</label>
                                <input id="dueDate" className="form-control" type="datetime-local" value={this.state.dueDate}  onChange={(e) => { this.onDueDateInputChanged(e);}} />
                            </div>
                        </>
                    : null 
                    }
                    <div className="form-group form-group-lg">
                        <label htmlFor="notes" className="control-label">Notes</label>
                        <textarea id="notes" className="form-control" cols={40} rows={4} onChange={(e) => { this.onNotesInputChanged(e);}} >{this.state.notes}</textarea>
                    </div>
                    <div className="form-group form-group-lg">
                        <label htmlFor="categories" className="control-label">Type</label>
                        <SelectionRefinementForReminderCategories />
                    </div>
                    <div className="form-group form-group-lg">
                        <label htmlFor="priority" className="control-label">Priority</label>
                        <select id="priority" onChange={(e) => this.onChangeSelectedPriority(e)} className="form-control">
                        {
                            Object.keys(Priority).filter(o => !isNaN(o as any)).map(key => 
                                <option key={key} value={Priority[key]} selected={this.state.priority === Priority[key]}>
                                    {cleanText(Priority[key])}
                                </option>
                            )
                        }
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={() =>this.addReminder() }>Add Reminder</button>
                </form>
            </div>
        )
    }

    private onChangeSelectedPriority = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state,
            ...{
                priority: Priority[e.target.value]
            }
        })
    }

    private onNotesInputChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ ...this.state, notes: e.target.value })
    }

    private onTypeChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, alert: !this.state.alert, reminder: !this.state.reminder })
    }

    private onDueDateInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, dueDate: e.target.value })
    }

    private addReminder = () => {
        if (this.state.notes && this.state.notes.length > 2 && this.props.selectedCat && this.state.priority)
        {
            const addModel: IReminderDTO = {
                notes: this.state.notes,
                dueDate: this.state.dueDate,
                priority: Priority[this.state.priority],
                catId: this.props.selectedCat
            }

            commonApi.add(addModel, "reminders");
            this.setState({ ...this.state, redirect: true })  
        }
        else{
            alert("Enter reminder notes and due date...");
        }
    }
}