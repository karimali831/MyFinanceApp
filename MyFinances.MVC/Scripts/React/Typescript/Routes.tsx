import * as React from 'react';
import { api } from '../Api/Api';
import { IRoute } from "../Models/IRoute";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { commonApi } from '../Api/CommonApi';
import { Loader } from './Loader';

interface IOwnProps {
}

export interface IOwnState {
    loading: boolean,
    routes: IRoute[]
    calculateWeeklyPay: number
}

export default class Routes extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            loading: true,
            routes: [],
            calculateWeeklyPay: undefined
        };
    }

    private tableName = "CNWRoutes";
    
    public componentDidMount() {
        this.loadRoutes();
    }

    private loadRoutes = () => {
        api.routes()
            .then(response => this.loadRoutesSuccess(response.routes));
    }

    private loadRoutesSuccess = (routes: IRoute[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                routes: routes
            }
        }) 
    }

    private onAfterSaveCell = (row: { [x: string]: string; }, cellName: any, cellValue: any) => {
        let key = cellName;
        let value = cellValue;
        let id = Number(row['id']);
        this.updateRoute(key, value, id)
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
            noDataText: 'No routes found',
            onDeleteRow: this.removeRoute
        };
        if (this.state.loading) {
            return <Loader />
        }
        return (
            <div style={{margin: '0 auto'}}>
                <BootstrapTable 
                    selectRow={{ mode: 'radio' }} 
                    remote={ true }  
                    data={ this.state.routes } 
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
                    <TableHeaderColumn dataField='routeNo'>Route</TableHeaderColumn>
                    <TableHeaderColumn dataField='routeType' columnClassName="hidden-xs" className="hidden-xs">Type</TableHeaderColumn>
                    <TableHeaderColumn dataField='routeDate'  editable={{ placeholder: "dd-MM-yyyy"}} >Date</TableHeaderColumn>
                    <TableHeaderColumn dataField='mileage' columnClassName="hidden-xs" className="hidden-xs">Mileage</TableHeaderColumn>
                    <TableHeaderColumn dataField='drops'>Drops</TableHeaderColumn>
                    <TableHeaderColumn dataField='extraDrops'>Extra Drops</TableHeaderColumn>
                    <TableHeaderColumn dataField='info' columnClassName="hidden-xs" className="hidden-xs">Info</TableHeaderColumn>
                </BootstrapTable>
                <label>Calculated wage amount: £{this.state.calculateWeeklyPay}</label>
            </div>
        )
    }
    private updateRoute = (key: string, value: any, id: number) => {
        this.setState({ ...this.state, ...{ loading: true } })
        commonApi.update(this.tableName, key, value, id)
            .then(() => this.loadRoutes());
    }

    private removeRoute = (id: any) => {
        this.setState({ ...this.state, ...{ loading: true } })
        commonApi.remove(id, this.tableName)
            .then(() => this.loadRoutes());
    }
}