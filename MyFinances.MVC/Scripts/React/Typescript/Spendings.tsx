import * as React from 'react';
import { api } from '../Api/Api';
import { ISpending } from "../Models/ISpending";
import { Loader } from './Loader';
import { ITableOptions, ITableProps } from '../Models/ITable';
import { textFilter } from 'react-bootstrap-table2-filter';
import Table from './CommonTable';

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

    private tableName = "Spendings"

    public componentDidMount() {
        this.loadSpendings();
    }

    private loadSpendings = () => {
        api.spendings()
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

    private priceFormatter(cell: any, row: any) {  
        return `<i class='glyphicon glyphicon-gbp'></i> ${cell}`;
    }

    render() {

        if (this.state.loading) {
            return <Loader />
        }

        const columns: ITableProps[] = [{
            dataField: 'id',
            text: '#',
            hidden: true
          }, {
            dataField: 'name',
            text: 'Item'
          }, {
            dataField: 'amount',
            text: 'Amount'
          },, {
            dataField: 'date',
            text: 'Date'
          }, {
            dataField: 'category',
            text: 'Category',
            headerClasses: "hidden-xs",
            classes: "hidden-xs"
          }, {
            dataField: 'secondCategory',
            text: 'Second Cat',
            headerClasses: "hidden-xs",
            classes: "hidden-xs"
          }, {
            dataField: 'info',
            text: 'Info',
            headerClasses: "hidden-xs",
            classes: "hidden-xs"
          }
        ];

        const options: ITableOptions = {
            deleteRow: true
        }

        return (
            <div>
                <Table 
                    table={this.tableName}
                    data={this.state.spendings}
                    columns={columns}
                    options={options}
                /> 
            </div>
        )
    }
}