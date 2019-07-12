import * as React from 'react';
import { IFinances, financeApi } from './Api';

interface IOwnProps {
}

export interface IOwnState {
    finances: IFinances[],
    loading: boolean,
    expense: string
}

export default class Finances extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            loading: true,
            finances: [],
            expense: ""
        };
    }

    public componentDidMount() {
        this.loadFinances();
    }

    // public componentDidUpdate(prevProps: IOwnProps, prevState: IOwnState) {

    //     console.log("prevState = " + prevState.finances);
    //     console.log("currState = " + this.state.finances);

    //     if (!prevState.finances.length) {
    //      this.loadFinances();
    //     }
    // }

    private loadFinances = () => {
        financeApi.finances()
            .then(response => this.loadFinancesSuccess(response.finances));
    }

    private loadFinancesSuccess = (finances: IFinances[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                finances: finances
            }
        }) 
    }

    render() {
        if (this.state.finances.length > 0) {
            return (
                <div>
                    <input type="text" value={this.state.expense} placeholder="Enter expense..." onChange={(e) => { this.onExpenseChanged(e);}} onKeyDown={this.onKeyDown} />
                    <ul>
                    {
                        this.state.finances.map((a, idx) => 
                            <li className="finance" key={a.id}>
                                <div className="title">{a.name}</div>
                                <a href="javascript:void(0)" onClick={() => this.removeExpense(a.id)}>[DEL]</a>
                            </li>
                        
                        )
                    }
                    </ul>
                </div>
            )
        } else {
            return <input type="text" value={this.state.expense} placeholder="Enter expense..." onChange={(e) => { this.onExpenseChanged(e);}} onKeyDown={this.onKeyDown} />;
        }
    }

    private reset = () => {
        this.setState({ ...this.state, 
            ...{ 
                expense: ""
            }
        })  
    }

    private onExpenseChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, 
            ...{ 
                expense: e.target.value,
                loading: e.target.value.length > 2
            }
        })  
    }

    private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            this.addExpense();
        }
    }

    private addExpense = () => {
        if (this.state.expense && this.state.expense.length > 2)
        {
            this.setState({ ...this.state, ...{ loading: true }})  
            
            financeApi.addExpense({ name: this.state.expense })
                .then(() => this.updateSuccess())
        }
    }

    private removeExpense = (id: number) => {
        this.setState({ ...this.state, ...{ loading: true }}) 

        financeApi.removeExpense(id)
            .then(() => this.updateSuccess())
    }

    private updateSuccess = () => {
        this.setState({ ...this.state, loading: false })  
        this.loadFinances();
    }
}