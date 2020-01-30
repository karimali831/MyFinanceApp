import * as React from 'react';
import { Redirect } from 'react-router-dom'
import * as moment from 'moment'
import { IFinance } from '../../../models/IFinance';
import { commonApi } from '../../../api/CommonApi';
import { api } from '../../../api/Api';
import { Load } from '../../base/Loader';
import { AddMenu } from '../../base/Menu';
import { ISpendingDTO } from '../../../models/ISpending';
import SelectCategoriesConnected from '../category/SelectCategoriesConnected';

export interface IPropsFromState {
    secondTypeId?: number,
    selectedCat?: number,
    selectedSecondCat?: number,
}

export interface IPropsFromDispatch {
}

export interface IOwnState {
    finances: IFinance[],
    amount?: number | undefined,
    loading: boolean,
    name: string,
    date: string,
    selectedFinanceId: number | undefined
    redirect: boolean
}

type AllProps = IPropsFromState & IPropsFromDispatch;

export default class AddSpending extends React.Component<AllProps, IOwnState> {
    constructor(props: AllProps) {
        super(props);
        this.state = { 
            finances: [],
            amount: undefined,
            loading: true,
            name: "",
            date: moment(new Date()).format('YYYY-MM-DD'),
            selectedFinanceId: undefined,
            redirect: false
        };
    }

    public componentDidMount() {
        this.loadFinances();
    }
    
    public render() {
        const { redirect, loading } = this.state;

        if (redirect) {
            return <Redirect to='/home'/>;
        }

        if (loading) {
            return <Load text="Loading..." />
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
                    <select onChange={e => this.onChangeSelectedFinance(e)} className="form-control">
                        <option value={0}>-- of finance --</option>
                        {
                            this.state.finances.map(f =>
                                <option key={f.id} value={f.id + "-" + f.name + "-" + f.avgMonthlyAmount}>{f.name}</option>
                            )
                        }
                    </select>
                </div>
                {this.state.selectedFinanceId === undefined || this.state.selectedFinanceId === 0 ? 
                    <SelectCategoriesConnected />
                : null}
                <div className="form-group">
                    <input className="form-control" type="number" value={this.state.amount} placeholder="Enter amount" onChange={(e) => { this.onAmountChanged(e);}} />
                </div>
                <div className="form-group">
                    <input type="submit" value="Add Item" onClick={() => this.addSpending() } />
                </div>
            </div>
        )
    }


    private loadFinances = () => {
        api.finances()
            .then(response => this.loadFinancesSuccess(response.finances));
    }

    private loadFinancesSuccess = (finances: IFinance[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                finances: finances
            }
        }) 
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

    private onChangeSelectedFinance = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const finance = value.split("-", 3);

        this.setState({ ...this.state, 
            ...{ 
                selectedFinanceId: Number(finance[0]),
                amount: Number(finance[2]),
                name: finance[1]
            }
        })  
    }

    private addSpending = () => {
        if (this.state.name && this.state.name.length > 2 && (this.props.selectedCat || this.state.selectedFinanceId) && (this.state.amount || this.state.amount === 0))
        {
            const addModel: ISpendingDTO = {
                name: this.state.name,
                catId: this.props.selectedCat,
                secondCatId: this.props.selectedSecondCat,
                amount: this.state.amount,
                date: this.state.date,
                financeId: this.state.selectedFinanceId
            }
            
            commonApi.add(addModel, "spendings");
            this.setState({ ...this.state, redirect: true })  
        }
        else{
            alert("Enter item and amount first");
        }
    }
}