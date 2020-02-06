import * as React from 'react';
import { commonApi } from '../../../api/CommonApi'
import { Redirect } from 'react-router-dom'
import { Load } from '../../base/Loader';
import { AddMenu } from '../../base/Menu';
import { IReminderDTO } from '../../../models/IReminder';
import { Priority } from 'src/enums/Priority';

import SelectionRefinementForReminderCategories from './SelectionRefinementForReminderCategories';
import { cleanText } from '../utils/Utils';

export interface IPropsFromState {
    selectedCat?: number
}

export interface IOwnState {
    loading: boolean,
    redirect: boolean,
    notes: string,
    dueDate: string,
    priority: string
}

export default class AddReminder extends React.Component<IPropsFromState, IOwnState> {
    constructor(props: IPropsFromState) {
        super(props);
        this.state = { 
            loading: false,
            redirect: false,
            notes: "",
            dueDate: "",
            priority: Priority[Priority.Low]
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
            <div style={{margin: '0 auto', border: 1}}>
                {AddMenu("reminder")}
                <div className="form-group">
                    <span>Due Date</span><br />
                    <input className="form-control" type="datetime-local" value={this.state.dueDate}  onChange={(e) => { this.onDueDateInputChanged(e);}} />
                </div>
                <div className="form-group">
                    <span>Reminder</span> <br />
                    <textarea className="form-control" cols={40} rows={4} onChange={(e) => { this.onNotesInputChanged(e);}} >{this.state.notes}</textarea>
                </div>
                <SelectionRefinementForReminderCategories />
                <div className="form-group">
                    <span>Priority</span><br />
                    <select onChange={(e) => this.onChangeSelectedPriority(e)} className="form-control">
                    {
                        Object.keys(Priority).filter(o => !isNaN(o as any)).map(key => 
                            <option key={key} value={Priority[key]} selected={this.state.priority === Priority[key]}>
                                {cleanText(Priority[key])}
                            </option>
                        )
                    }
                    </select>
                </div>
                <div className="form-group">
                    <input type="submit" value="Add" onClick={() =>this.addReminder() } />
                </div>
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