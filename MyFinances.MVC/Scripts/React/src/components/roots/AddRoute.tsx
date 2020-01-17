import * as React from 'react';
import { commonApi } from '../../api/CommonApi'
import { Redirect } from 'react-router-dom'
import { Loader } from '../base/Loader';
import { AddMenu } from '../base/Menu';
import { ICategory } from '../../models/ICategory';
import { CategoryType } from '../../enums/CategoryType';
import { IRouteDTO } from '../../models/IRoute';

interface IOwnProps {
}

export interface IOwnState {
    routeTypes: ICategory[],
    selectedRouteType?: number | undefined,
    loading: boolean,
    redirect: boolean,
    routeDate: string,
    mileage?: number | undefined,
    extraMileage?: number | undefined,
    mpg?: number | undefined,
    fuelCost?: number | undefined,
    extraDrops?: number | undefined,
    info: string
}

export default class AddRoute extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            routeTypes: [],
            selectedRouteType: undefined,
            loading: true,
            redirect: false,
            routeDate: "",
            mileage: undefined,
            extraMileage: undefined,
            mpg: undefined,
            fuelCost: undefined,
            extraDrops: undefined,
            info: ""
        };
    }

    public componentDidMount() {
        this.loadRouteTypes();
    }

    public render() {
        const { redirect, loading } = this.state;

        if (redirect) {
            return <Redirect to='/route'/>;
        }

        if (loading) {
            return <Loader text="Loading..." />
        }

        return (
            <div style={{margin: '0 auto', border: 1}}>
                {AddMenu("route")}
                <div className="form-group">
                    <input className="form-control" type="date" value={this.state.routeDate} placeholder="dd-MM-yy" onChange={(e) => { this.onRouteDateChanged(e);}} />
                </div>
                <div className="form-group">
                    <input className="form-control" type="number" value={this.state.mileage} placeholder="Enter route mileage" onChange={(e) => { this.onMileageChanged(e);}} />
                </div>
                <div className="form-group">
                    <input className="form-control" type="number" value={this.state.mpg} placeholder="Enter route mpg" onChange={(e) => { this.onMPGChanged(e);}} />
                </div>
                <div className="form-group">
                    <input className="form-control" type="number" value={this.state.fuelCost} placeholder="Enter fuel cost" onChange={(e) => { this.onFuelCostChanged(e);}} />
                </div>
                <div className="form-group">
                    <input className="form-control" type="text" value={this.state.extraDrops} placeholder="Drops adjustment" onChange={(e) => { this.onExtraDropsChanged(e);}} />
                </div>
                <div className="form-group">
                    <input className="form-control" type="number" value={this.state.extraMileage} placeholder="Enter extra mileage" onChange={(e) => { this.onExtraMileageChanged(e);}} />
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

    private onChangeSelectedRouteType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state, selectedRouteType: Number(e.target.value) })
    }

    private onRouteDateChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, routeDate: e.target.value })  
    }

    private onMileageChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, mileage: Number(e.target.value) })  
    }

    private onExtraMileageChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, extraMileage: Number(e.target.value) })  
    }

    private onMPGChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, mpg: Number(e.target.value) })  
    }

    private onFuelCostChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, fuelCost: Number(e.target.value) })  
    }

    private onExtraDropsChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, extraDrops: Number(e.target.value) })  
    }

    private onInfoChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, info: e.target.value })  
    }

    private addRoute = () => {
        if (this.state.routeDate && this.state.selectedRouteType)
        {
            const addModel: IRouteDTO = {
                routeTypeId: this.state.selectedRouteType,
                routeDate: this.state.routeDate,
                mileage: this.state.mileage,
                extraMileage: this.state.extraMileage,
                mpg: this.state.mpg,
                fuelCost: this.state.fuelCost,
                extraDrops: this.state.extraDrops,
                info: this.state.info
            }

            commonApi.add(addModel, "cnw");
            this.setState({ ...this.state, redirect: true })  
        }
        else{
            alert("Enter route, date & type");
        }
    }
}