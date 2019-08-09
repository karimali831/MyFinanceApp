import * as React from 'react';
import { api } from '../Api/Api';
import { IFinance } from "../Models/IFinance";
import { Loader } from './Loader';
import Table from './CommonTable';
import { ITableOptions, ITableProps } from '../Models/ITable';

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
            text: 'Name'
          }, {
            dataField: 'avgMonthlyAmount',
            text: 'Avg Monthly Cost'
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
            text: 'Next Due'
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