import * as React from 'react';
import { api } from '../Api/Api';
import { IFinance } from "../Models/IFinance";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { commonApi } from '../Api/CommonApi';

export interface IOwnProps {
    table: string,
    addModel: any,
    updateRow: { [x: string]: string; },
    updateCellName: any,
    updateCellValue: any
}


export interface IOwnState {
    apiRoute: string
}

export default class CommonTable extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            table: props.table
        };
    }
    
    public onAfterSaveCell = (props: IOwnProps) => {
        let key = props.updateCellName;
        let value = props.updateCellValue;
        let id = Number(props.updateRow['id']);
        this.update(key, value, id)
    }
      
    public onBeforeSaveCell(row: any, cellName: any, cellValue: any) {
        // You can do any validation on here for editing value,
        // return false for reject the editing
        return true;
    }

    public priceFormatter(cell: any, row: any) {  
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

    public add = (props: IOwnProps) => {
        if (props.addModel != null)
        {
            this.setState({ ...this.state, ...{ loading: true }})  
            
            commonApi.add(props.addModel, this.state.table )
        }
    }

    private update = (key: string, value: any, id: number) => {
        this.setState({ ...this.state, ...{ loading: true }}) 
        commonApi.update(this.state.table, key, value, id);
    }

    private remove = (id: any) => {
        this.setState({ ...this.state, ...{ loading: true }}) 
        commonApi.remove(id, this.state.table);
    }
}