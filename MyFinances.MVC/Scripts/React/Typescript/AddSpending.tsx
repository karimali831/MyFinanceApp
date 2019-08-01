import * as React from 'react';
import { financeApi, ICategory } from '../Api';
import SpendingSummary from './Stats';

interface IOwnProps {
}

export interface IOwnState {
    categories: ICategory[],
    selectedCat?: number | undefined,
    amount?: number | undefined,
    loading: boolean,
    name: string
}

export default class AddSpending extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            categories: [],
            selectedCat: undefined,
            amount: 0,
            loading: true,
            name: ""
        };
    }

    public componentDidMount() {
        this.loadCategories();
    }

    private loadCategories = () => {
        financeApi.categories()
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
        return (
            <div style={{margin: '0 auto'}}>
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
                    <input type="submit" value="Add Item" onClick={(e) =>this.addSpending() } />
                </div>
                <SpendingSummary />
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
                    name: "", 
                    amount: 0,
                    selectedCat: undefined
                }
            })  
            
            financeApi.addSpending(this.state.name, this.state.selectedCat, this.state.amount);
        }
        else{
            alert("Enter item and amount first");
        }
    }
}