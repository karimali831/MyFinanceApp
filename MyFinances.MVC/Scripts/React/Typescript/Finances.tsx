import * as React from 'react';
import { IFinance, financeApi } from '../Api';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

interface IOwnProps {
}

export interface IOwnState {
    finances: IFinance[],
    totalAvgCost: number | undefined,
    loading: boolean,
    name: string
}

export default class Finances extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            loading: true,
            finances: [],
            totalAvgCost: undefined,
            name: ""
        };
    }

    public componentDidMount() {
        this.loadFinances();
    }

    private loadFinances = () => {
        financeApi.finances()
            .then(response => this.loadFinancesSuccess(response.finances, response.totalAvgCost));
    }

    private loadFinancesSuccess = (finances: IFinance[], totalAvgCost: number) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                finances: finances,
                totalAvgCost: totalAvgCost
            }
        }) 
    }

    private onAfterSaveCell = (row: { [x: string]: string; }, cellName: any, cellValue: any) => {
        let key = cellName;
        let value = cellValue;
        let id = Number(row['id']);
        this.updateExpense(key, value, id)
    }
      
    private onBeforeSaveCell(row: any, cellName: any, cellValue: any) {
        // You can do any validation on here for editing value,
        // return false for reject the editing
        return true;
    }

    private priceFormatter(cell: any, row: any) {   // String example
        return `<i class='glyphicon glyphicon-gbp'></i> ${cell}`;
    }

    render() {
        const options = {
            noDataText: 'No finances found',
            onDeleteRow: this.removeExpense
        };
        
        // const cellEditProp = {
        //     mode: 'click',
        //     blurToSave: 'true',
        //     beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
        //     afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell
        // };
        return (
            <div style={{width: '75%', margin: '0 auto'}}>
                <BootstrapTable 
                    selectRow={{ mode: 'radio' }} 
                    remote={ true }  
                    data={ this.state.finances } 
                    striped={ true } 
                    hover={ true } 
                    options={ options } 
                    deleteRow={ true } 
                    cellEdit={{
                        mode: 'click',
                        blurToSave: true,
                        beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
                        afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell  
                    }} >
                    <TableHeaderColumn isKey dataField='id' hidden autoValue={true}>ID</TableHeaderColumn>
                    <TableHeaderColumn dataField='name'>Expense</TableHeaderColumn>
                    <TableHeaderColumn dataField='avgMonthlyCost' dataFormat={ this.priceFormatter }>Avg Monthly Cost</TableHeaderColumn>
                    <TableHeaderColumn dataField='type'>Type</TableHeaderColumn>
                    <TableHeaderColumn dataField='endDate' editable={{ placeholder: "dd-MM-yyyy"}} >End Date</TableHeaderColumn>
                    <TableHeaderColumn dataField='remaining'>Remaining</TableHeaderColumn>
                </BootstrapTable>
                <input className={"form-control"} type="text" value={this.state.name} placeholder="Add expense..." onChange={(e) => { this.onExpenseChanged(e);}} onKeyDown={this.onKeyDown} />
                <label>Total average monthly cost: £{this.state.totalAvgCost}</label>
            </div>
        )
    }

    private onExpenseChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, 
            ...{ 
                name: e.target.value,
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
        if (this.state.name && this.state.name.length > 2)
        {
            this.setState({ ...this.state, ...{ loading: true, name: "" }})  
            
            financeApi.addExpense(this.state.name)
                .then(() => this.loadFinances())
        }
    }

    private updateExpense = (key: string, value: any, id: number) => {
        this.setState({ ...this.state, ...{ loading: true }}) 
        financeApi.updateExpense(key, value, id)
            .then(() => this.loadFinances());
    }

    private removeExpense = (id: any) => {
        this.setState({ ...this.state, ...{ loading: true }}) 
        financeApi.removeExpense(id)
            .then(() => this.loadFinances());
    }
}