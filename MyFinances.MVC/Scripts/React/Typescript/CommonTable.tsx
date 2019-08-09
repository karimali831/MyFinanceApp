import * as React from 'react';
import { ITableOptions, ITableProps } from '../Models/ITable';
import { commonApi } from '../Api/CommonApi';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';

export interface IOwnProps {
    table: string,
    data: any,
    columns: ITableProps[],
    options?: ITableOptions,
}

export interface IOwnState {
    deleteId: number | undefined
}

export default class Table extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            deleteId: undefined
        };
    }

    render() {
        const cellEdit = cellEditFactory({
            mode: 'click',
            blurToSave: true,
            beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
            afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell  
        });

        const selectRow = {
            mode: 'radio',
            onSelect: (row: any) => {
                this.setState({ ...this.state, 
                    ...{ 
                        deleteId: row['id']
                    }
                }) 
            }
        };

        return(
            <div>
                <BootstrapTable 
                    keyField='id' 
                    selectRow={ this.props.options && this.props.options.deleteRow ? selectRow : null }
                    data={ this.props.data } 
                    columns={ this.props.columns } 
                    striped={ true } 
                    hover={ true }
                    cellEdit={ cellEdit } 
                />
                <button onClick={() => this.remove()} className="btn btn-danger">Delete</button>
            </div>
        );
    }
    
    private onAfterSaveCell = (oldValue: string, newValue: string, row: { [x: string]: string; }, column: { [x: string]: string; }) => {
        let id = Number(row['id']);
        this.update(column['dataField'], newValue, id)
    }
      
    private onBeforeSaveCell(row: any, cellName: any, cellValue: any) {
        // You can do any validation on here for editing value,
        // return false for reject the editing
        return true;
    }

    private priceFormatter(cell: any, row: any) {  
        return `<i class='glyphicon glyphicon-gbp'></i> ${cell}`;
    }

    public onItemChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, 
            ...{ 
                name: e.target.value,
                loading: e.target.value.length > 2
            }
        })  
    }

    private update = (key: string, value: any, id: number) => {
        this.setState({ ...this.state, ...{ loading: true }}) 
        commonApi.update(this.props.table, key, value, id);
    }

    private remove = () => {
        if (this.state.deleteId && this.props.options && this.props.options.deleteRow) {
            this.setState({ ...this.state, 
                ...{ 
                    loading: true,
                    deleteId: undefined
                }
            }) 

            commonApi.remove(this.state.deleteId, this.props.table);
        }
    }
}