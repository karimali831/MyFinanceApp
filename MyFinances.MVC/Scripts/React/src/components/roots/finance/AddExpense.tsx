import * as React from 'react';
import { commonApi } from '../../../api/CommonApi'
import { Redirect } from 'react-router-dom'
import { AddMenu } from '../../base/Menu';
import { IFinanceDTO } from '../../../models/IFinance';
import SelectionRefinementForSpendingCategories from '../spending/SelectionRefinementForSpendingCategories';

export interface IPropsFromState {
    selectedCat?: number
}

export interface IOwnState {
    name: string,
    redirect: boolean
}

export default class AddExpense extends React.Component<IPropsFromState, IOwnState> {
    constructor(props: IPropsFromState) {
        super(props);
        this.state = { 
            name: "",
            redirect: false
        };
    }

    public render() {
        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/finance'/>;
        }

        return (
            <div>
                {AddMenu("expense")}
                <form className="form-horizontal">
                    <div className="form-group form-group-lg">
                        <input className="form-control" type="text" value={this.state.name} placeholder="Enter expenditure" onChange={(e) => { this.onExpenseChanged(e);}} />
                    </div>
                    <div className="form-group form-group-lg">
                        <SelectionRefinementForSpendingCategories />
                    </div>
                    <button className="btn btn-primary" onClick={() =>this.addExpense() }>Add Expense</button>
                </form>
            </div>
        )
    }

    
    private onExpenseChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, name: e.target.value })
    }

    private addExpense = () => {
        if (this.state.name && this.state.name.length > 2 && this.props.selectedCat)
        {
            const addModel: IFinanceDTO = {
                name: this.state.name,
                catId: this.props.selectedCat
            }

            commonApi.add(addModel, "finances");
            this.setState({ ...this.state, redirect: true })  
        }
        else{
            alert("Enter expense and category");
        }
    }
}