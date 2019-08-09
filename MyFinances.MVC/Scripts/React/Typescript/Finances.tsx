import * as React from 'react';
import { api } from '../Api/Api';
import { IFinance } from "../Models/IFinance";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { commonApi } from '../Api/CommonApi';
import { Loader } from './Loader';

interface IOwnProps {
}

export interface IOwnState {
    finances: IFinance[],
    totalAvgCost: number | undefined,
    loading: boolean
}

export default class Finances extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            loading: true,
            finances: [],
            totalAvgCost: undefined
        };
    }

    private tableName = "Finances";
    
    public componentDidMount() {
        this.loadFinances();
    }

    private loadFinances = () => {
        api.finances()
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
        if (this.state.loading) {
            return <Loader />
        }
        return (
            <div>
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
                    <TableHeaderColumn dataField='avgMonthlyAmount' dataFormat={ this.priceFormatter }>Avg Monthly Cost</TableHeaderColumn>
                    <TableHeaderColumn dataField='endDate' columnClassName="hidden-xs" className="hidden-xs" editable={{ placeholder: "dd-MM-yyyy"}} >End Date</TableHeaderColumn>
                    <TableHeaderColumn dataField='remaining' columnClassName="hidden-xs" className="hidden-xs">Remaining</TableHeaderColumn>
                    <TableHeaderColumn dataField='monthlyDueDate' editable={{ placeholder: "dd-MM-yyyy"}}>Next Due</TableHeaderColumn>
                </BootstrapTable>
                <label>Total average monthly cost: £{this.state.totalAvgCost}</label>
            </div>
        )
    }
    private updateExpense = (key: string, value: any, id: number) => {
        this.setState({ ...this.state, ...{ loading: true } })
        commonApi.update(this.tableName, key, value, id)
            .then(() => this.loadFinances());
    }

    private removeExpense = (id: any) => {
        this.setState({ ...this.state, ...{ loading: true } })
        commonApi.remove(id, this.tableName)
            .then(() => this.loadFinances());
    }
}