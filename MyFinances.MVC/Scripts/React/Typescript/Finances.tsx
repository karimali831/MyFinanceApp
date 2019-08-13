import * as React from 'react';
import { api } from '../Api/Api';
import { IFinance, PaymentStatus } from "../Models/IFinance";
import { Loader } from './Loader';
import Table from './CommonTable';
import { ITableOptions, ITableProps } from '../Models/ITable';
import { priceFormatter, intToOrdinalNumberString } from './Utils';

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

    private loadFinances = () => {
        api.finances()
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
        switch (cell) {
            case 0:
                return <span className="label label-success">{PaymentStatus[PaymentStatus.Paid]}</span>
            case 1:
                return <span className="label label-warning">{PaymentStatus[PaymentStatus.Upcoming]} ({row['daysUntilDue']} days)</span>
            case 2:
                return <span className="label label-danger">{PaymentStatus[PaymentStatus.Late]} ({row['daysUntilDue']} days)</span>
            case 3:
                return <span className="label label-default">{PaymentStatus[PaymentStatus.Unknown]}</span>
            case 4:
                return <span className="label label-danger">{PaymentStatus[PaymentStatus.DueToday]} ({row['daysUntilDue']} days)</span>
        }
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
          },, {
            dataField: 'endDate',
            text: 'End Date',
            headerClasses: "hidden-xs",
            classes: "hidden-xs"
          }, {
            dataField: 'remaining',
            text: 'Remaining',
            headerClasses: "hidden-xs",
            classes: "hidden-xs"
          }, {
            dataField: 'monthlyDueDate',
            text: 'Due Date',
            formatter: intToOrdinalNumberString
          }, {
            dataField: 'daysUntilDue',
            text: 'Next Due',
            hidden: true
          }
          , {
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
                <label>Total average monthly cost: £{this.state.totalAvgCost}</label>
            </div>
        )
    }
}