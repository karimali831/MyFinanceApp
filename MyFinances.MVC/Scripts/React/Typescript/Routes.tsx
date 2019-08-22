import * as React from 'react';
import { api } from '../Api/Api';
import { IRoute } from "../Models/IRoute";
import { Loader } from './Loader';
import { ITableProps, ITableOptions } from '../Models/ITable';
import Table from './CommonTable';
import { WeekPeriodSync } from '../Enums/WeekPeriodSync';
import { weekSummaryUrl } from '../Typescript/Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet, faInfo } from '@fortawesome/free-solid-svg-icons'

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

    private syncWeek = (date: string) => {
        this.setState({ ...this.state, ...{ loading: true }}) 
            api.syncWeek(date);
    }

    private syncWeekButton = (cell: any, row: any) => {
        switch (cell) {
            case WeekPeriodSync.NotWeekstartPeriod:
                return null
            case WeekPeriodSync.NotSynced:
                return <span><FontAwesomeIcon icon={faRetweet} /> <a onClick={() => this.syncWeek(row['routeDate'])}>Sync</a></span>
            case WeekPeriodSync.Synced:
                return <span>
                           <FontAwesomeIcon icon={faRetweet} /> <a onClick={() => this.syncWeek(row['routeDate'])}>Re-Sync</a><br />
                           <FontAwesomeIcon icon={faInfo} /> <a href={weekSummaryUrl(row['routeDate'])}>Details</a>
                        </span>
        }
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
            text: 'Route',
            headerClasses: "hidden-xs",
            classes: "hidden-xs"
          }, {
            dataField: 'routeType',
            text: 'Type'
          },, {
            dataField: 'routeDate',
            text: 'Date',

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
          , {
            dataField: 'weekstartPeriod',
            text: 'Sync Week',
            editable: false,
            formatter: this.syncWeekButton
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