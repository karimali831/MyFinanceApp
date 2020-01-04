import * as React from 'react';
import { commonApi } from '../../Api/CommonApi'
import { Redirect } from 'react-router-dom'
import { Loader } from '../base/Loader';
import { AddMenu } from '../base/Menu';
import { ICategory } from '../../models/ICategory';
import { CategoryType } from '../../enums/CategoryType';
import { IFinanceDTO } from '../../models/IFinance';

interface IOwnProps {
}

export interface IOwnState {
    categories: ICategory[],
    selectedCat?: number | undefined,
    loading: boolean,
    name: string,
    redirect: boolean
}

export default class AddExpense extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            categories: [],
            selectedCat: undefined,
            loading: true,
            name: "",
            redirect: false
        };
    }

    public componentDidMount() {
        this.loadCategories();
    }

    public render() {
        const { redirect, loading } = this.state;

        if (redirect) {
            return <Redirect to='/finance'/>;
        }

        if (loading) {
            return <Loader text="Loading..."/>
        }

        return (
            <div style={{margin: '0 auto', border: 1}}>
                {AddMenu("expense")}
                <div className="form-group">
                    <input className="form-control" type="text" value={this.state.name} placeholder="Enter expenditure" onChange={(e) => { this.onExpenseChanged(e);}} />
                </div>
                <div className="form-group">
                    <select onChange={e => this.onChangeSelectedCategory(e)} className="form-control">
                        <option value={0}>-- select category --</option>
                        {
                            this.state.categories.map(c =>
                                <option key={c.id} value={c.id}>{c.name}</option>
                            )
                        }
                    </select>
                </div>
                <div className="form-group">
                    <input type="submit" value="Add Item" onClick={() =>this.addExpense() } />
                </div>
            </div>
        )
    }

    private loadCategories = () => {
        commonApi.categories(CategoryType.Spendings)
            .then(response => this.loadCategoriesSuccess(response.categories));
    }

    private loadCategoriesSuccess = (categories: ICategory[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                categories: categories
            }
        }) 
    }
    
    private onExpenseChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, name: e.target.value })
    }

    private onChangeSelectedCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state, selectedCat: Number(e.target.value) })
    }

    private addExpense = () => {
        if (this.state.name && this.state.name.length > 2 && this.state.selectedCat)
        {
            const addModel: IFinanceDTO = {
                name: this.state.name,
                catId: this.state.selectedCat
            }

            commonApi.add(addModel, "finances");
            this.setState({ ...this.state, redirect: true })  
        }
        else{
            alert("Enter expense and category");
        }
    }
}