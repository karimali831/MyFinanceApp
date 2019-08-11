import * as React from 'react';
import { api } from '../Api/Api';
import { IRoute } from "../Models/IRoute";
import { Loader } from './Loader';
import { ITableProps, ITableOptions } from '../Models/ITable';
import Table from './CommonTable';

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

    render() {

        if (this.state.loading) {
            return <Loader text="Loading routes..." />
        }

        const columns: ITableProps[] = [{
            dataField: 'id',
            text: '#',
            hidden: true
          }, {
            dataField: 'routeNo',
            text: 'Route'
          }, {
            dataField: 'routeType',
            text: 'Type'
          },, {
            dataField: 'routeDate',
            text: 'Date'
          }, {
            dataField: 'drops',
            text: 'Stops'
          }, {
            dataField: 'extraDrops',
            text: 'Extra Stops'
          }, {
            dataField: 'mileage',
            text: 'Route Mileage',
            headerClasses: "hidden-xs",
            classes: "hidden-xs"
          }, {
            dataField: 'extraMileage',
            text: 'Support Mileage',
            headerClasses: "hidden-xs",
            classes: "hidden-xs"
          }, {
            dataField: 'mpg',
            text: 'MPG',
            headerClasses: "hidden-xs",
            classes: "hidden-xs"
          }, {
            dataField: 'info',
            text: 'Info',
            headerClasses: "hidden-xs",
            classes: "hidden-xs",
            hidden: true
          }
        ];

        const options: ITableOptions = {
            deleteRow: true
        }


        return (
            <div>
                <Table 
                    table={this.tableName}
                    data={this.state.routes}
                    columns={columns}
                    options={options}
                />      
                <label>Calculated wage amount: £{this.state.calculateWeeklyPay}</label>
            </div>
        )
    }

}