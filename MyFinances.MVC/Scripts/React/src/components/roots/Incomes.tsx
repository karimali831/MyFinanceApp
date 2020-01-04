import * as React from 'react';
import { IIncome } from '../../models/IIncome';
import { Loader } from '../base/Loader';
import { priceFormatter } from './utils/Utils';
import Table from '../base/CommonTable';
import { ITableProps, ITableOptions } from 'react-bootstrap-table-next';

interface IOwnProps {
}

export interface IOwnState {
    incomes: IIncome[],
    loading: boolean
    // sourceId: number | null,
    // frequency: DateFrequency | null,
    // interval: number | null,
    // fromDate: string | null,
    // toDate: string | null
}

export default class Finances extends React.Component<IOwnProps, IOwnState> {
    private tableName = "Incomes";

    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            loading: true,
            incomes: []
            // sourceId: this.props.match.params.sourceId,
            // frequency: this.props.match.params.frequency,
            // fromDate: this.props.match.params.fromDate,
            // toDate: this.props.match.params.toDate,
            // interval: this.props.match.params.interval,
        };
    }
    // public componentDidMount() {
    //     this.loadIncomes();
    // }

    // private loadIncomes = () => {
    //     const dateFilter: IDateFilter = {
    //         frequency: this.state.frequency,
    //         interval: this.state.interval,
    //         fromDateRange: this.state.fromDate,
    //         toDateRange: this.state.toDate
    //     }

    //     api.incomes(dateFilter, this.state.sourceId)
    //         .then(response => this.loadIncomesSuccess(response.incomes));
    // }

    // private loadIncomesSuccess = (incomes: IIncome[]) => {
    //     this.setState({ ...this.state,
    //         ...{ 
    //             loading: false, 
    //             incomes: incomes
    //         }
    //     }) 
    // }

    public render() {
        if (this.state.loading) {
            return <Loader text="Loading incomes..." />
        }

        const columns: ITableProps[] = [{
            dataField: 'id',
            text: '#',
            hidden: true
          }, {
            dataField: 'source',
            text: 'Source'
          }, {
            dataField: 'date',
            text: 'Paid Date'
          }, {
            dataField: 'amount',
            text: 'Amount',
            formatter: priceFormatter
          }, {
            dataField: 'secondSource',
            text: 'Second Source',
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
                    data={this.state.incomes}
                    columns={columns}
                    options={options}
                /> 
            </div>
        )
    }
}