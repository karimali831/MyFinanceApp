import * as React from 'react';
import { ISpending, financeApi } from '../Api';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

interface IOwnProps {
}

export interface IOwnState {
    spendings: ISpending[],
    loading: boolean
}

export default class Spendings extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            loading: true,
            spendings: []
        };
    }

    public componentDidMount() {
        this.loadSpendings();
    }

    private loadSpendings = () => {
        financeApi.spendings()
            .then(response => this.loadSpendingsSuccess(response.spendings));
    }

    private loadSpendingsSuccess = (spendings: ISpending[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                spendings: spendings
            }
        }) 
    }

    private onAfterSaveCell = (row: { [x: string]: string; }, cellName: any, cellValue: any) => {
        let key = cellName;
        let value = cellValue;
        let id = Number(row['id']);
        this.updateSpending(key, value, id)
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
            noDataText: 'No spendings in this period found',
            onDeleteRow: this.removeSpending
        };
        return (
            <div>
                <BootstrapTable 
                    selectRow={{ mode: 'radio' }} 
                    remote={ true }  
                    data={ this.state.spendings } 
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
                    <TableHeaderColumn isKey dataField='id' hidden autoValue={true}>ID ??</TableHeaderColumn>
                    <TableHeaderColumn dataField='name' >Item</TableHeaderColumn>
                    <TableHeaderColumn dataField='amount' dataFormat={ this.priceFormatter }>Amount</TableHeaderColumn>
                    <TableHeaderColumn dataField='date' editable={{ placeholder: "dd-MM-yyyy"}} >Date</TableHeaderColumn>
                    <TableHeaderColumn dataField='info' columnClassName="hidden-xs" className="hidden-xs">Info</TableHeaderColumn>
                    <TableHeaderColumn dataField='category' columnClassName="hidden-xs" className="hidden-xs">Category</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }

    private updateSpending = (key: string, value: any, id: number) => {
        this.setState({ ...this.state, ...{ loading: true }}) 
        financeApi.updateSpending(key, value, id)
            .then(() => this.loadSpendings());
    }

    private removeSpending = (id: any) => {
        this.setState({ ...this.state, ...{ loading: true }}) 
        financeApi.removeSpending(id)
            .then(() => this.loadSpendings());
    }
}