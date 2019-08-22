import * as React from 'react';
import { Redirect } from 'react-router-dom'
import { ICategory } from '../Models/ICategory'
import { commonApi } from '../Api/CommonApi';
import { CategoryType } from '../Enums/CategoryType';
import { ISpendingDTO } from '../Models/ISpending';
import { Loader } from './Loader';
import { IFinance } from '../Models/IFinance';
import { api } from '../Api/Api';
import { Link } from "react-router-dom";
import { AddMenu } from './Menu';

interface IOwnProps {
}

export interface IOwnState {
    categories: ICategory[],
    secondCategories: ICategory[],
    finances: IFinance[],
    selectedCat?: number | undefined,
    selectedSecondCat?: number | undefined,
    secondTypeId?: number | undefined,  
    amount?: number | undefined,
    loading: boolean,
    name: string,
    date: string,
    selectedFinanceId: number | undefined
    redirect: boolean
}

export default class AddSpending extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            categories: [],
            secondCategories: [],
            finances: [],
            selectedCat: undefined,
            selectedSecondCat: undefined,
            secondTypeId: undefined,  
            amount: undefined,
            loading: true,
            name: "",
            date: "",
            selectedFinanceId: undefined,
            redirect: false
        };
    }

    public componentDidMount() {
        this.loadCategories();
        this.loadFinances();
    }

    public componentDidUpdate(prevProps: IOwnProps, prevState: IOwnState) {
        if (this.state.secondTypeId !== undefined && prevState.secondTypeId !== this.state.secondTypeId) {
            this.loadSecondCategories(this.state.secondTypeId);
        }
    }

    private loadCategories = () => {
        commonApi.categories(CategoryType.Spendings)
            .then(response => this.loadCategoriesSuccess(response.categories));
    }

    private loadFinances = () => {
        api.finances()
            .then(response => this.loadFinancesSuccess(response.finances));
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

    private loadFinancesSuccess = (finances: IFinance[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                finances: finances
            }
        }) 
    }

    render() {
        const { redirect, loading } = this.state;

        if (redirect) {
            return <Redirect to='/spending'/>;
        }

        if (loading) {
            return <Loader text="Loading..." />
        }

        return (
            <div style={{margin: '0 auto', border: 1}}>
                {AddMenu("spending")}
                <div className="form-group">
                    <input className="form-control" type="text" value={this.state.name} placeholder="Enter item" onChange={(e) => { this.onSpendingChanged(e);}} />
                </div>
                <div className="form-group">
                    <input className="form-control" type="date" value={this.state.date} placeholder="dd-MM-yy" onChange={(e) => { this.onDateChanged(e);}} />
                </div>
                <div className="form-group">
                    <input className="form-control" type="number" value={this.state.amount} placeholder="Enter amount" onChange={(e) => { this.onAmountChanged(e);}} />
                </div>
                <div className="form-group">
                    <select onChange={e => this.onChangeSelectedFinance(e)} className="form-control">
                        <option value={0}>-- of finance --</option>
                        {
                            this.state.finances.map(f =>
                                <option key={f.id} value={f.id}>{f.name}</option>
                            )
                        }
                    </select>
                </div>
                {this.state.selectedFinanceId == undefined || this.state.selectedFinanceId == 0 ? 
                <>
                <div className="form-group">
                    <select onChange={e => this.onChangeSelectedCategory(e)} className="form-control">
                        <option value={0}>-- category --</option>
                        {
                            this.state.categories.map(c =>
                                <option key={c.id} value={c.id + "-" + c.secondTypeId}>{c.name}</option>
                            )
                        }
                    </select>
                </div>
                
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
                : null}
                <div className="form-group">
                    <input type="submit" value="Add Item" onClick={() => this.addSpending() } />
                </div>
            </div>
        )
    }

    private onSpendingChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, 
            ...{ 
                name: e.target.value,
            }
        })  
    }

    private onDateChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, date: e.target.value })  
    }

    private onAmountChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, 
            ...{ 
                amount: Number(e.target.value),
            }
        })  
    }

    private onChangeSelectedCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        var value = e.target.value;
        var ids = value.split("-", 2);

        this.setState({ ...this.state, 
            ...{ 
                selectedCat: Number(ids[0]),
                secondTypeId: ids[1] !== "0" ? Number(ids[1]) : undefined
            }
        })  
    }

    private onChangeSelectedSecondCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state, 
            ...{ 
                selectedSecondCat: Number(e.target.value)
            }
        })  
    }

    private onChangeSelectedFinance = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state, 
            ...{ 
                selectedFinanceId: Number(e.target.value)
            }
        })  
    }

    private addSpending = () => {
        if (this.state.name && this.state.name.length > 2 && (this.state.selectedCat || this.state.selectedFinanceId) && this.state.amount)
        {
            this.setState({ ...this.state, 
                ...{ 
                    loading: true, 
                    redirect: true,
                    name: "", 
                    amount: 0,
                    selectedCat: undefined,
                    selectedSecondCat: undefined,
                    secondTypeId: undefined,
                    selectedFinanceId: undefined
                }
            })  

            const addModel: ISpendingDTO = {
                name: this.state.name,
                catId: this.state.selectedCat,
                secondCatId: this.state.selectedSecondCat,
                amount: this.state.amount,
                date: this.state.date,
                financeId: this.state.selectedFinanceId
            }
            
            commonApi.add(addModel, "spendings");
        }
        else{
            alert("Enter item and amount first");
        }
    }
}