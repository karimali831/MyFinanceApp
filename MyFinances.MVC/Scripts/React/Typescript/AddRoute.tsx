import * as React from 'react';
import { commonApi } from './../Api/CommonApi'
import { CategoryType } from '../Enums/CategoryType';
import { ICategory } from '../Models/ICategory';
import { IRouteDTO } from '../Models/IRoute'
import { Redirect } from 'react-router-dom'
import { Loader } from './Loader';

interface IOwnProps {
}

export interface IOwnState {
    routeTypes: ICategory[],
    selectedRouteType?: number | undefined,
    loading: boolean,
    redirect: boolean,
    routeNo: string,
    routeDate: Date,
    mileage?: number | undefined,
    extraDrops?: number | undefined,
    info?: string | null
}

export default class AddRoute extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            routeTypes: [],
            selectedRouteType: undefined,
            loading: true,
            redirect: false,
            routeNo: "",
            routeDate: undefined,
            mileage: undefined,
            extraDrops: undefined,
            info: null
        };
    }

    public componentDidMount() {
        this.loadRouteTypes();
    }

    private loadRouteTypes = () => {
        commonApi.categories(CategoryType.CNWRouteType)
            .then(response => this.loadRouteTypesSuccess(response.categories));
    }

    private loadRouteTypesSuccess = (routeTypes: ICategory[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                routeTypes: routeTypes
            }
        }) 
    }

    render() {
        const { redirect, loading } = this.state;

        if (redirect) {
            return <Redirect to='/route'/>;
        }

        if (loading) {
            return <Loader />
        }

        return (
            <div style={{margin: '0 auto', border: 1}}>
                <div className="form-group">
                    <input className="form-control" type="text" value={this.state.routeNo} placeholder="Enter route no" onChange={(e) => { this.onRouteNoChanged(e);}} />
                </div>
                <div className="form-group">
                    <input className="form-control" type="date" value={this.state.routeDate} placeholder="dd-MM-yy" onChange={(e) => { this.onRouteDateChanged(e);}} />
                </div>
                <div className="form-group">
                    <input className="form-control" type="number" value={this.state.mileage} placeholder="Enter route mileage" onChange={(e) => { this.onMileageChanged(e);}} />
                </div>
                <div className="form-group">
                    <input className="form-control" type="number" value={this.state.extraDrops} placeholder="Enter extra drops" onChange={(e) => { this.onExtraDropsChanged(e);}} />
                </div>
                <div className="form-group">
                    <input className="form-control" type="text" value={this.state.info} placeholder="Enter info" onChange={(e) => { this.onInfoChanged(e);}} />
                </div>
                <div className="form-group">
                    <select onChange={e => this.onChangeSelectedRouteType(e)} className="form-control">
                        <option value={0}>-- route type --</option>
                        {
                            this.state.routeTypes.map(c =>
                                <option key={c.id} value={c.id}>{c.name}</option>
                            )
                        }
                    </select>
                </div>
                <div className="form-group">
                    <input type="submit" value="Add Item" onClick={() =>this.addRoute() } />
                </div>
            </div>
        )
    }

    
    // const value = Number.isInteger(Number(e.target.value) ? Number(e.target.value) : e.target.value);

    private onRouteNoChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, routeNo: e.target.value })  
    }

    private onChangeSelectedRouteType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state, selectedRouteType: Number(e.target.value) })
    }

    private onRouteDateChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, routeDate: e.target.value })  
    }

    private onMileageChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, mileage: Number(e.target.value) })  
    }

    private onExtraDropsChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, extraDrops: Number(e.target.value) })  
    }

    private onInfoChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, info: e.target.value })  
    }

    private addRoute = () => {
        if (this.state.routeNo && this.state.routeNo.length > 2 && this.state.selectedRouteType)
        {
            this.setState({ ...this.state, 
                ...{ 
                    routeTypes: [],
                    selectedRouteType: undefined,
                    loading: true,
                    redirect: true,
                    routeNo: "",
                    routeDate: undefined,
                    mileage: undefined,
                    extraDrops: undefined,
                    info: null
                }
            })  

            const addModel: IRouteDTO = {
                routeNo: this.state.routeNo,
                routeTypeId: this.state.selectedRouteType,
                routeDate: this.state.routeDate,
                mileage: this.state.mileage,
                extraDrops: this.state.extraDrops,
                info: this.state.info
            }

            commonApi.add(addModel, "cnw");
        }
        else{
            alert("Enter item and amount first");
        }
    }
}