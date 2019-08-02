import * as React from 'react';
import { Redirect } from 'react-router-dom'
import { ICategory } from '../Models/ICategory'
import { commonApi } from '../Api/CommonApi';
import { CategoryType } from '../Enums/CategoryType';
import { ISpendingDTO } from '../Models/ISpending';
import { Loader } from './Loader';

interface IOwnProps {
}

export interface IOwnState {
    categories: ICategory[],
    selectedCat?: number | undefined,
    amount?: number | undefined,
    loading: boolean,
    name: string,
    redirect: boolean
}

export default class AddSpending extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            categories: [],
            selectedCat: undefined,
            amount: 0,
            loading: true,
            name: "",
            redirect: false
        };
    }

    public componentDidMount() {
        this.loadCategories();
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

    render() {
        const { redirect, loading } = this.state;

        if (redirect) {
            return <Redirect to='/spending'/>;
        }

        if (loading) {
            return <Loader />
        }

        return (
            <div style={{margin: '0 auto', border: 1}}>
                <div className="form-group">
                    <input className="form-control" type="text" value={this.state.name} placeholder="Enter item" onChange={(e) => { this.onSpendingChanged(e);}} />
                </div>
                <div className="form-group">
                    <input className="form-control" type="number" value={this.state.amount} placeholder="Enter amount" onChange={(e) => { this.onAmountChanged(e);}} />
                </div>
                <div className="form-group">
                    <select onChange={e => this.onChangeSelectedCategory(e)} className="form-control">
                        <option value={0}>-- category --</option>
                        {
                            this.state.categories.map(c =>
                                <option key={c.id} value={c.id}>{c.name}</option>
                            )
                        }
                    </select>
                </div>
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

    private onAmountChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, 
            ...{ 
                amount: Number(e.target.value),
            }
        })  
    }

    private onChangeSelectedCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state, 
            ...{ 
                selectedCat: Number(e.target.value),
            }
        })  
    }

    private addSpending = () => {
        if (this.state.name && this.state.name.length > 2 && this.state.selectedCat && this.state.amount)
        {
            this.setState({ ...this.state, 
                ...{ 
                    loading: true, 
                    redirect: true,
                    name: "", 
                    amount: 0,
                    selectedCat: undefined
                }
            })  

            const addModel: ISpendingDTO = {
                name: this.state.name,
                catId: this.state.selectedCat,
                amount: this.state.amount
            }
            
            commonApi.add(addModel, "spendings");
        }
        else{
            alert("Enter item and amount first");
        }
    }
}