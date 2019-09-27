import * as React from 'react';
import { api } from '../Api/Api';
import { IFinance, PaymentStatus } from "../Models/IFinance";
import { Loader } from './Loader';
import Table from './CommonTable';
import { ITableOptions, ITableProps } from '../Models/ITable';
import { priceFormatter, intToOrdinalNumberString, paymentStatus, cleanText, boolHighlight } from './Utils';
import { OverrideDueDate } from '../Enums/OverrideDueDate';

interface IOwnProps {
}

export interface IOwnState {
    finances: IFinance[],
    totalAvgCost: number | undefined,
    spentThisMonth: number | undefined,
    spentLastMonth: number | undefined,
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
            spentThisMonth: undefined,
            spentLastMonth: undefined,
            showEdit: undefined
        };
    }

    private tableName = "Finances";
    
    public componentDidMount() {
        this.loadFinances();
    }

    private loadFinances = (resyncNextDueDates = false) => {
        api.finances(resyncNextDueDates)
            .then(response => this.loadFinancesSuccess(response.finances, response.totalAvgCost, response.spentThisMonth, response.spentLastMonth));
    }

    private loadFinancesSuccess = (finances: IFinance[], totalAvgCost: number, spentThisMonth: number, spentLastMonth: number) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                finances: finances,
                totalAvgCost: totalAvgCost,
                spentThisMonth: spentThisMonth,
                spentLastMonth: spentLastMonth
            }
        }) 
    }

    private paymentStatus = (cell: any, row: any) => {
        return paymentStatus(cell, row['daysUntilDue'], row['daysLate'])
    }

    private overrideDueDate = (cell: any, row: any) => {
        return <span className="label label-primary">{cleanText(OverrideDueDate[cell])}</span>
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
            classes: "hidden-xs",
            formatter: this.overrideDueDate
          }, {
            dataField: 'manualPayment',
            text: 'One-Off Payment',
            headerClasses: "hidden-xs",
            classes: "hidden-xs",
            formatter: boolHighlight
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
                <label>Total average monthly cost: £{this.state.totalAvgCost}</label><br />
                <label>Spent last month: £{this.state.spentLastMonth}</label><br />
                <label>Spent this month: £{this.state.spentThisMonth}</label>
            </div>
        )
    }
}