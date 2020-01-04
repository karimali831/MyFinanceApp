import * as React from 'react';
import { ISpending } from '../../../models/ISpending';
import { priceFormatter } from '../utils/Utils';
import Table from '../../base/CommonTable';
import { ITableProps, ITableOptions } from 'react-bootstrap-table-next';


interface IOwnProps {
}

export interface IPropsFromState {
    spendings: ISpending[],
    loading: boolean
}

export interface IPropsFromDispatch {

}

type AllProps = IOwnProps & IPropsFromState & IPropsFromDispatch;


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

export const Spendings : React.SFC<AllProps> = (props) => (
    <>
        {

                <Table 
                    table="Spendings"
                    data={props.spendings}
                    columns={columns}
                    options={options}
                /> 
        }
    </>
)

export default Spendings