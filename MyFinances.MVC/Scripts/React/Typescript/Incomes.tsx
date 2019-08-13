import * as React from 'react';
import { api } from '../Api/Api';
import { IIncome } from "../Models/IIncome"
import { Loader } from './Loader';
import Table from './CommonTable';
import { ITableOptions, ITableProps } from '../Models/ITable';
import { priceFormatter } from './Utils';

interface IOwnProps {
}

export interface IOwnState {
    incomes: IIncome[],
    loading: boolean
}

export default class Finances extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            loading: true,
            incomes: []
        };
    }

    private tableName = "Incomes";
    
    public componentDidMount() {
        this.loadIncomes();
    }

    private loadIncomes = () => {
        api.incomes()
            .then(response => this.loadIncomesSuccess(response.incomes));
    }

    private loadIncomesSuccess = (incomes: IIncome[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                incomes: incomes
            }
        }) 
    }

    render() {
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