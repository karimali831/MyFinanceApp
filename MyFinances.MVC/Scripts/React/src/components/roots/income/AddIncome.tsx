import * as React from 'react';
import { commonApi } from '../../../api/CommonApi'
import { Redirect } from 'react-router-dom'
import { Load } from '../../base/Loader';
import { AddMenu } from '../../base/Menu';
import { IIncomeDTO } from '../../../models/IIncome';
import SelectCategories from '../category/SelectCategoriesConnected';

export interface IPropsFromState {
    secondTypeId?: number,
    selectedCat?: number,
    selectedSecondCat?: number,
}

export interface IPropsFromDispatch {
}

export interface IOwnState {
    loading: boolean,
    date: string,
    amount?: number | undefined
    redirect: boolean
}


type AllProps = IPropsFromState & IPropsFromDispatch;

export default class AddExpense extends React.Component<AllProps, IOwnState> {
    constructor(props: AllProps) {
        super(props);
        this.state = { 
            loading: true,
            amount: undefined,
            date: "",
            redirect: false
        };
    }

    public render() {
        const { redirect, loading } = this.state;

        if (redirect) {
            return <Redirect to='/income/'/>;
        }

        if (loading) {
            return <Load text="Loading..."/>
        }

        return (
            <div style={{margin: '0 auto', border: 1}}>
                {AddMenu("income")}
                <SelectCategories />
                <div className="form-group">
                    <input className="form-control" type="date" value={this.state.date} placeholder="dd-MM-yy" onChange={(e) => { this.onDateChanged(e);}} />
                </div>
                <div className="form-group">
                    <input className="form-control" type="number" value={this.state.amount} placeholder="Enter amount" onChange={(e) => { this.onAmountChanged(e);}} />
                </div>
                <div className="form-group">
                    <input type="submit" value="Add Item" onClick={() =>this.addExpense() } />
                </div>
            </div>
        )
    }
    
    private onDateChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, date: e.target.value })  
    }

    private onAmountChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state,  amount: Number(e.target.value) })  
    }

    private addExpense = () => {
        if (this.state.date && this.state.amount && this.props.selectedCat)
        {
            const addModel: IIncomeDTO = {
                sourceId: this.props.selectedCat,
                secondSourceId: this.props.selectedSecondCat,
                date: this.state.date,
                amount: this.state.amount
            }

            commonApi.add(addModel, "incomes");
            this.setState({ ...this.state, redirect: true })  
        }
        else{
            alert("Enter date, amount and select income source");
        }
    }
}