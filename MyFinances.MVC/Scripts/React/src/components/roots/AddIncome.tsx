import * as React from 'react';
import { commonApi } from '../../Api/CommonApi'
import { Redirect } from 'react-router-dom'
import { Loader } from '../base/Loader';
import { AddMenu } from '../base/Menu';
import { ICategory } from '../../models/ICategory';
import { CategoryType } from '../../enums/CategoryType';
import { IIncomeDTO } from '../../models/IIncome';

interface IOwnProps {
}

export interface IOwnState {
    categories: ICategory[],
    secondCategories: ICategory[],
    selectedCat?: number | undefined,
    selectedSecondCat?: number | undefined,
    secondTypeId?: number | undefined,  
    loading: boolean,
    date: string,
    amount?: number | undefined
    redirect: boolean
}

export default class AddExpense extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            categories: [],
            secondCategories: [],
            selectedCat: undefined,
            selectedSecondCat: undefined,
            secondTypeId: undefined, 
            loading: true,
            amount: undefined,
            date: "",
            redirect: false
        };
    }

    public componentDidMount() {
        this.loadCategories();
    }

    public render() {
        const { redirect, loading } = this.state;

        if (redirect) {
            return <Redirect to='/income'/>;
        }

        if (loading) {
            return <Loader text="Loading..."/>
        }

        return (
            <div style={{margin: '0 auto', border: 1}}>
                {AddMenu("income")}
                <div className="form-group">
                    <select onChange={e => this.onChangeSelectedCategory(e)} className="form-control">
                        <option value={0}>-- select category --</option>
                        {
                            this.state.categories.map(c =>
                                <option key={c.id} value={c.id + "-" + c.secondTypeId}>{c.name}</option>
                            )
                        }
                    </select>
                </div>
                <>
                    {
                        this.state.secondTypeId !== undefined ?
                            <div className="form-group">
                                <select onChange={e => this.onChangeSelectedSecondCategory(e)} className="form-control">
                                    <option value={0}>-- category --</option>
                                    {
                                        this.state.secondCategories.map(c =>
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        )
                                    }
                                </select>
                            </div>
                        : null
                    }
                </>
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


    public componentDidUpdate(prevProps: IOwnProps, prevState: IOwnState) {
        if (this.state.secondTypeId !== undefined && prevState.secondTypeId !== this.state.secondTypeId) {
            this.loadSecondCategories(this.state.secondTypeId);
        }
    }

    private loadCategories = () => {
        commonApi.categories(CategoryType.IncomeSources)
            .then(response => this.loadCategoriesSuccess(response.categories));
    }

    private loadSecondCategories = (secondTypeId: number) => {
        commonApi.categories(secondTypeId)
            .then(response => this.loadSecondCategoriesSuccess(response.categories));
    }

    private loadCategoriesSuccess = (categories: ICategory[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                categories: categories
            }
        }) 
    }

    private loadSecondCategoriesSuccess = (categories: ICategory[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                secondCategories: categories
            }
        }) 
    }
    
    private onDateChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, date: e.target.value })  
    }

    private onAmountChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state,  amount: Number(e.target.value) })  
    }

    private onChangeSelectedCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const ids = value.split("-", 2);

        this.setState({ ...this.state, 
            ...{ 
                selectedCat: Number(ids[0]),
                secondTypeId: ids[1] !== "null" && ids[1] !== "0" ? Number(ids[1]) : undefined
            }
        })  
    }

    private onChangeSelectedSecondCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state, selectedSecondCat: Number(e.target.value) })  
    }

    private addExpense = () => {
        if (this.state.date && this.state.amount && this.state.selectedCat)
        {
            const addModel: IIncomeDTO = {
                sourceId: this.state.selectedCat,
                secondCatId: this.state.selectedSecondCat,
                date: this.state.date,
                amount: this.state.amount
            }

            commonApi.add(addModel, "finances", "income");
            this.setState({ ...this.state, redirect: true })  
        }
        else{
            alert("Enter date, amount and select income source");
        }
    }
}