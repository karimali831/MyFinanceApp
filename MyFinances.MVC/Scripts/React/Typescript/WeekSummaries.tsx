import * as React from 'react';
import { api } from '../Api/Api';
import { ICNWPayment } from "../Models/ICNWPayment"
import { Loader } from './Loader';
import Table from './CommonTable';
import { ITableOptions, ITableProps } from '../Models/ITable';
import { priceFormatter, weekSummaryUrl } from './Utils';

interface IOwnProps {
}

export interface IOwnState {
    weekSummaries: ICNWPayment[],
    loading: boolean
}

export default class WeekSummaries extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            loading: true,
            weekSummaries: []
        };
    }

    private tableName = "CNWPayments";
    
    public componentDidMount() {
        this.loadWeekSummaries();
    }

    private loadWeekSummaries = () => {
        api.weekSummaries()
            .then(response => this.loadWeekSummariesSuccess(response.weekSummaries));
    }

    private loadWeekSummariesSuccess= (weekSummaries: ICNWPayment[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                weekSummaries: weekSummaries
            }
        }) 
    }

    private weekSummary = (cell: any, row: any) => <a href={weekSummaryUrl(cell)}>{cell}</a>

    render() {
        if (this.state.loading) {
            return <Loader text="Loading week summaries..." />
        }

        const columns: ITableProps[] = [{
            dataField: 'id',
            text: '#',
            hidden: true
          }, {
            dataField: 'weekDate',
            text: 'Week Date',
            editable: false,
            formatter: this.weekSummary
          }, {
            dataField: 'invoiceNo',
            text: 'Invoice No',
            headerClasses: "hidden-xs",
            classes: "hidden-xs"
          }, {
            dataField: 'actualMiles',
            text: 'Actual Miles'
          }, {
            dataField: 'actualRoutePay',
            text: 'Actual Route Pay',
            formatter: priceFormatter
          }, {
            dataField: 'actualTotalPay',
            text: 'Actual Total Pay',
            formatter: priceFormatter
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
                    data={this.state.weekSummaries}
                    columns={columns}
                    options={options}
                /> 
            </div>
        )
    }
}