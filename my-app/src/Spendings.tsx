import * as React from 'react';
import { ISpending, financeApi, ICategory } from './Api';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

interface IOwnProps {
}

export interface IOwnState {
    spendings: ISpending[],
    totalSpent: number[],
    categories: ICategory[],
    selectedCat?: number | undefined,
    loading: boolean,
    name: string
}

export default class Spendings extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            loading: true,
            spendings: [],
            totalSpent: [],
            categories: [],
            selectedCat: undefined,
            name: ""
        };
    }

    public componentDidMount() {
        this.loadSpendings();
    }

    private loadSpendings = () => {
        financeApi.spendings()
            .then(response => this.loadSpendingsSuccess(response.spendings, response.totalSpent, response.categories));
    }

    private loadSpendingsSuccess = (spendings: ISpending[], totalSpent: number[], categories: ICategory[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                spendings: spendings,
                totalSpent: totalSpent,
                categories: categories
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
            <div style={{width: '75%', margin: '0 auto'}}>
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
                    <TableHeaderColumn isKey dataField='id' hidden autoValue={true}>ID</TableHeaderColumn>
                    <TableHeaderColumn dataField='name'>Item</TableHeaderColumn>
                    <TableHeaderColumn dataField='amount' dataFormat={ this.priceFormatter }>Amount</TableHeaderColumn>
                    <TableHeaderColumn dataField='date' editable={{ placeholder: "dd-MM-yyyy"}} >Date</TableHeaderColumn>
                    <TableHeaderColumn dataField='info'>Info</TableHeaderColumn>
                    <TableHeaderColumn dataField='category'>Category</TableHeaderColumn>
                </BootstrapTable>
                <input className={"form-control"} type="text" value={this.state.name} placeholder="Add spending..." onChange={(e) => { this.onSpendingChanged(e);}} onKeyDown={this.onKeyDown} />
                <select onChange={e => this.onChangeSelectedCategory(e)} className={"form-control"}>
                    <option value="">-- category --</option>
                    {
                        this.state.categories.map(c =>
                            <option key={c.id} value={c.id}>{c.name}</option>
                        )
                    }
                </select>
                <input type={"submit"} value={"Add"} className={"form-control"} onClick={() => this.addSpending()} />
                <label>Last day total spent: £{this.state.totalSpent[0]}</label>
            </div>
        )
    }

    private onSpendingChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, 
            ...{ 
                name: e.target.value,
                loading: e.target.value.length > 2
            }
        })  
    }

    private onChangeSelectedCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state, 
            ...{ 
                selectedCat: Number(e.target.value),
                loading: e.target.value.length > 2
            }
        })  
    }

    private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            this.addSpending();
        }
    }

    private addSpending = () => {
        if (this.state.name && this.state.name.length > 2 && this.state.selectedCat)
        {
            this.setState({ ...this.state, 
                ...{ 
                    loading: true, 
                    name: "", 
                    selectedCat: undefined 
                }
            })  
            
            financeApi.addSpending(this.state.name, this.state.selectedCat)
                .then(() => this.loadSpendings())
        }
        else{
            alert("Must select name and category");
        }
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