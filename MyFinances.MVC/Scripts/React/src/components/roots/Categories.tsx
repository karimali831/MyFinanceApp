import * as React from 'react';
import { Loader } from '../base/Loader';
import { commonApi } from '../../api/CommonApi';
import { ICategory } from '../../models/ICategory';
import Table from '../base/CommonTable';
import { ITableProps, ITableOptions } from 'react-bootstrap-table-next';

interface IOwnProps {
}

export interface IOwnState {
    categories: ICategory[],
    loading: boolean
}

export default class Categories extends React.Component<IOwnProps, IOwnState> {
    private tableName = "Categories";
    
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            loading: true,
            categories: []
        };
    }

    
    public componentDidMount() {
        this.loadCategories();
    }

    public render() {
        if (this.state.loading) {
            return <Loader text="Loading categories..." />
        }

        const columns: ITableProps[] = [{
            dataField: 'id',
            text: '#',
            hidden: true
          }, {
            dataField: 'name',
            text: 'Name'
          }, {
            dataField: 'typeId',
            text: 'Type Id'
          }, {
            dataField: 'secondTypeId',
            text: 'Second Type Id'
          }
        ];

        const options: ITableOptions = {
            deleteRow: true
        }

        return (
            <div>
                <Table 
                    table={this.tableName}
                    data={this.state.categories}
                    columns={columns}
                    options={options}
                /> 
            </div>
        )
    }

    private loadCategories = () => {
        commonApi.categories()
            .then(response => this.loadCategoriesSuccess(response.categories));
    }

    private loadCategoriesSuccess = (categories: ICategory[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                categories: categories
            }
        }) 
    }
}