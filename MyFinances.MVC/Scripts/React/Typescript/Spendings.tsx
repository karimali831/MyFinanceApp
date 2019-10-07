import * as React from 'react';
import { api } from '../Api/Api';
import { ISpending, ISpendingRequestDTO } from "../Models/ISpending";
import { Loader } from './Loader';
import { ITableOptions, ITableProps } from '../Models/ITable';
import Table from './CommonTable';
import { priceFormatter } from './Utils';
import { DateFrequency } from '../Enums/DateFrequency';
import { IDateFilter } from '../Models/IDateFilter';

interface IOwnProps {
}

export interface IOwnState {
    spendings: ISpending[],
    loading: boolean,
    catId: number | null,
    frequency: DateFrequency | null,
    interval: number | null,
    fromDate: string | null,
    toDate: string | null,
    isFinance: boolean,
    isSecondCat: boolean
}

export default class Spendings extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            loading: true,
            spendings: [],
            catId: this.props.match.params.catId,
            frequency: this.props.match.params.frequency,
            fromDate: this.props.match.params.fromDate,
            toDate: this.props.match.params.toDate,
            interval: this.props.match.params.interval,
            isFinance: this.props.match.params.isFinance,
            isSecondCat: this.props.match.params.isSecondCat
        };
    }

    private tableName = "Spendings"

    public componentDidMount() {
        this.loadSpendings();
    }

    private loadSpendings = () => {
        const dateFilter: IDateFilter = {
            frequency: this.state.frequency,
            interval: this.state.interval,
            fromDateRange: this.state.fromDate,
            toDateRange: this.state.toDate
        }

        const request: ISpendingRequestDTO = {
            catId: this.state.catId,
            dateFilter: dateFilter,
            isFinance: this.state.isFinance,
            isSecondCat: this.state.isSecondCat
        }

        api.spendings(request)
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

    render() {
        if (this.state.loading) {
            return <Loader text="Loading spendings..." />
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
            text: 'Amount',
            formatter: priceFormatter
          }, {
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
            deleteRow: true,
            pagination: true
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