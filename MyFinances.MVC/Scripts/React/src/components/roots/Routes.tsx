import * as React from 'react';
import { api } from '../../Api/Api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons'
import { IRoute } from '../../models/IRoute';
import { routeSummaryUrl } from '../utils/Utils';
import { Load } from '../base/Loader';
import Table from '../base/CommonTable';
import { ITableProps, ITableOptions } from 'react-bootstrap-table-next';

interface IOwnProps {
}

export interface IOwnState {
    loading: boolean,
    routes: IRoute[]
}

export default class Routes extends React.Component<IOwnProps, IOwnState> {
    private tableName = "CNWRoutes";

    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            loading: true,
            routes: []
        };
    }
    public componentDidMount() {
        this.loadRoutes();
    }

    public render() {
      if (this.state.loading) {
          return <Load text="Loading routes..." />
      }

      const columns: ITableProps[] = [{
          dataField: 'id',
          text: '#',
          hidden: true
        }, {
          dataField: 'weekNo',
          text: 'Week',
          headerClasses: "hidden-xs",
          classes: "hidden-xs"
        }, {
          dataField: 'routeType',
          text: 'Type'
        }, {
          dataField: 'routeDate',
          text: 'Date',
          editor:  {
              type: 'date'
          }
        }, {
          dataField: 'fuelCost',
          text: 'Fuel Cost'
        }, {
          dataField: 'extraDrops',
          text: 'Extra Stops'
        }, {
          dataField: 'coFuel',
          text: 'Co-Fuel',
          headerClasses: "hidden-xs",
          classes: "hidden-xs"
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
          dataField: "",
          text: 'Info',
          editable: false,
          formatter: this.routeSummary
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
          </div>
      )
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

    private routeSummary = (cell: any, row: any) => {
        return <span><FontAwesomeIcon icon={faInfo} /> <a href={routeSummaryUrl(row['id'])}>Route Summary</a></span>
    }
}