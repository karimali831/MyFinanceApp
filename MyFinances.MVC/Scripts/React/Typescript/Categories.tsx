import * as React from 'react';
import { Loader } from './Loader';
import Table from './CommonTable';
import { ITableOptions, ITableProps } from '../Models/ITable';
import { ICategory } from '../Models/ICategory';
import { commonApi } from '../Api/CommonApi';

interface IOwnProps {
}

export interface IOwnState {
    categories: ICategory[],
    loading: boolean
}

export default class Categories extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            loading: true,
            categories: []
        };
    }

    private tableName = "Categories";
    
    public componentDidMount() {
        this.loadCategories();
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

    render() {
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
}