import * as React from 'react';
import { api } from '../Api/Api';
import { ICNWPayment } from "../Models/ICNWPayment"
import { Loader } from './Loader';
import Table from './CommonTable';
import { ITableOptions, ITableProps } from '../Models/ITable';
import { priceFormatter, weekSummaryUrl } from './Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

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

    // public componentDidUpdate(prevProps: IOwnProps, prevState: IOwnState) {
    //   if (prevState.loading !== this.state.loading) {
    //       this.loadWeekSummaries()
    //   }
    // }
    
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

    private resyncWeek = (weekNo: number) => {
      this.setState({ ...this.state, loading: true })

      api.resyncWeek(weekNo)
        .then(() => this.syncWeekSuccess(weekNo));
    }

    private syncWeekSuccess = (weekNo: number) => {
      this.setState({ ...this.state,
          ...{ 
              loading: false
          }
      }) 
    }

    private weekSummary = (cell: any, row: any) => {
      return <span>
                <a href={weekSummaryUrl(cell)}>{cell}</a> <FontAwesomeIcon icon={faSync} /> <a onClick={() => this.resyncWeek(cell)}>Re-Sync</a>
             </span>               
    }

    render() {
        if (this.state.loading) {
            return <Loader text="Loading week summaries..." />
        }

        const columns: ITableProps[] = [{
            dataField: 'id',
            text: '#',
            hidden: true
          }, {
            dataField: 'payDate',
            text: 'Pay Date',
            editable: false
          }, {
            dataField: 'weekNo',
            text: 'Week No',
            editable: false,
            formatter: this.weekSummary
          }, {
            dataField: 'actualMiles',
            text: 'Invoice Miles'
          }, {
            dataField: 'actualRoutePay',
            text: 'Invoice Route Pay',
            formatter: priceFormatter
          }, {
            dataField: 'actualTotalPay',
            text: 'Invoice Total Pay',
            formatter: priceFormatter
          }, {
            dataField: 'actualSupportPay',
            text: 'Invoice Support Pay',
            formatter: priceFormatter
          }, {
            dataField: 'byod',
            text: 'Invoice BYOD',
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