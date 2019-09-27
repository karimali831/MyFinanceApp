import * as React from 'react';
import { api } from '../Api/Api';
import { IFinance, PaymentStatus } from "../Models/IFinance";
import { Loader } from './Loader';
import Table from './CommonTable';
import { ITableOptions, ITableProps } from '../Models/ITable';
import { priceFormatter, intToOrdinalNumberString, paymentStatus } from './Utils';

interface IOwnProps {
}

export interface IOwnState {
    finances: IFinance[],
    totalAvgCost: number | undefined,
    loading: boolean,
    showEdit: number | undefined
}

export default class Finances extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            loading: true,
            finances: [],
            totalAvgCost: undefined,
            showEdit: undefined
        };
    }

    private tableName = "Finances";
    
    public componentDidMount() {
        this.loadFinances();
    }

    private loadFinances = (resyncNextDueDates = false) => {
        api.finances(resyncNextDueDates)
            .then(response => this.loadFinancesSuccess(response.finances, response.totalAvgCost));
    }

    private loadFinancesSuccess = (finances: IFinance[], totalAvgCost: number) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                finances: finances,
                totalAvgCost: totalAvgCost
            }
        }) 
    }

    private paymentStatus = (cell: any, row: any) => {
        return paymentStatus(cell, row['daysUntilDue'], row['daysLate'])
    }

    render() {
        if (this.state.loading) {
            return <Loader text="Loading finances..." />
        }

        const columns: ITableProps[] = [{
            dataField: 'id',
            text: '#',
            hidden: true
          }, {
            dataField: 'name',
            text: 'Name'
          }, {
            dataField: 'avgMonthlyAmount',
            text: 'Avg Monthly Cost',
            formatter: priceFormatter
          }, {
            dataField: 'overrideNextDueDate',
            text: 'Override Due Date',
            headerClasses: "hidden-xs",
            classes: "hidden-xs"
          }, {
            dataField: 'manualPayment',
            text: 'One-Off Payment',
            headerClasses: "hidden-xs",
            classes: "hidden-xs"
          }, {
            dataField: 'monthlyDueDate',
            text: 'Due Date',
            formatter: intToOrdinalNumberString
          }, {
            dataField: 'daysLate',
            text: 'Days Late',
            hidden: true
          }, {
            dataField: 'daysUntilDue',
            text: 'Next Due',
            hidden: true
          }, {
            dataField: 'paymentStatus',
            text: 'Status',
            formatter: this.paymentStatus
          }
        ];

        const options: ITableOptions = {
            deleteRow: true
        }

        return (
            <div>
                <Table 
                    table={this.tableName}
                    data={this.state.finances}
                    columns={columns}
                    options={options}
                /> 
                <a onClick={() => this.loadFinances(true)}>Re-sync next due dates</a><br />
                <label>Total average monthly cost: £{this.state.totalAvgCost}</label>
            </div>
        )
    }
}