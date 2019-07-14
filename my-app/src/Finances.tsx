import * as React from 'react';
import { IFinances, financeApi } from './Api';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

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

    private onAfterSaveCell(row: { [x: string]: string; }, cellName: any, cellValue: any) {
        alert(`Save cell ${cellName} with value ${cellValue} of Id: ${row['id']}`);
        
        let key = cellName;
        let value = cellValue;
        let id = row['id'];

        let rowStr = '';
        for (const prop in row) {
            rowStr += prop + ': ' + row[prop] + '\n';
        }
        
        alert('Thw whole row :\n' + rowStr);
    }
      
    private onBeforeSaveCell(row: any, cellName: any, cellValue: any) {
        // You can do any validation on here for editing value,
        // return false for reject the editing
        return true;
    }

    render() {
        const options = {
            noDataText: 'No income or expenditure for the day',
            onDeleteRow: this.removeExpense
        };
        const cellEditProp = {
            mode: 'click',
            blurToSave: 'true',
            beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
            afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell
        };
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
                    <TableHeaderColumn dataField='avgMonthlyCost'>Avg Monthly Cost</TableHeaderColumn>
                    <TableHeaderColumn dataField='type'>Type</TableHeaderColumn>
                    <TableHeaderColumn dataField='endDate'>End Date</TableHeaderColumn>
                    <TableHeaderColumn dataField='remaining'>Remaining</TableHeaderColumn>
                </BootstrapTable>
                <input className={"form-control"} type="text" value={this.state.expense} placeholder="Add expense..." onChange={(e) => { this.onExpenseChanged(e);}} onKeyDown={this.onKeyDown} />
            </div>
        )
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
            this.setState({ ...this.state, ...{ loading: true, expense: "" }})  
            
            financeApi.addExpense({ name: this.state.expense })
                .then(() => this.loadFinances())
        }
    }

    private removeExpense = (id: any) => {
        this.setState({ ...this.state, ...{ loading: true }}) 

        financeApi.removeExpense(id)
            .then(() => this.loadFinances())
    }
}