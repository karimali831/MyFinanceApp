import * as React from 'react';

import { DateFrequency } from 'src/enums/DateFrequency';
import { DateFilterChangeAction } from 'src/state/contexts/common/Actions';
import { IDateFilter } from 'src/models/IDateFilter';
import { cleanText } from './Utils';
import { CategoryType } from 'src/enums/CategoryType';

export interface IPropsFromState {
    dateFilter: IDateFilter | undefined,
    type: CategoryType,
    loading: boolean
}

export interface IPropsFromDispatch {
    dateFilterChanged: (filter: IDateFilter, category: CategoryType) => DateFilterChangeAction
}

type AllProps = IPropsFromState & IPropsFromDispatch;


export default class DateFilter extends React.Component<AllProps> {


    public componentDidUpdate(prevProps: AllProps) {
        if (prevProps.dateFilter !== undefined && this.props.dateFilter !== undefined)
        {
            if (prevProps.dateFilter.frequency !== DateFrequency.DateRange && (
                prevProps.dateFilter.frequency !== this.props.dateFilter.frequency || 
                prevProps.dateFilter.interval !== this.props.dateFilter.interval)) {
                    this.props.dateFilterChanged(this.props.dateFilter, CategoryType.Spendings);
            }
            else if ((
                this.props.dateFilter.fromDateRange!= null && this.props.dateFilter.toDateRange != null) && 
                prevProps.dateFilter.fromDateRange !== this.props.dateFilter.fromDateRange ||
                prevProps.dateFilter.toDateRange !== this.props.dateFilter.toDateRange) {
                    this.props.dateFilterChanged(this.props.dateFilter, CategoryType.Spendings);
            }
        }
    }

    
    public render() {
        // if (this.props.loading) {
        //     return <Loader text="Loading spending summary..." />
        // }

        return (
            this.props.dateFilter !== undefined ?
            <>
                <div className="form-group" style={{width: 'auto'}}>
                    <select onChange={(e) => this.onChangeSelectedFrequency(e)} className="form-control">
                    {
                        Object.keys(DateFrequency).filter(o => !isNaN(o as any)).map(key => 
                            <option key={key} value={key} defaultChecked={this.props.dateFilter !== undefined && this.props.dateFilter.frequency === DateFrequency[key]}>
                                {cleanText(DateFrequency[key])}
                            </option>
                        )
                    }
                    </select>
                    {
                        this.props.dateFilter.frequency && this.props.dateFilter.frequency.toString().includes("Last") ?
                            <select onChange={(e) => this.onChangeSelectedInterval(e)} className="form-control">
                            {
                                Array.from(Array(30), (e, i) => {
                                    return <option value={i+1}>X = {i+1}</option>
                                })
                            }
                            </select>
                        : this.props.dateFilter.frequency === DateFrequency.DateRange ? 
                        <>
                            <div className="form-group">
                                <input className="form-control" type="date" value={this.props.dateFilter.fromDateRange !== null ? this.props.dateFilter.fromDateRange : undefined} placeholder="dd-MM-yy" onChange={(e) => { this.onFromDateChanged(e);}} />
                            </div>
                            <div className="form-group">
                                <input className="form-control" type="date" value={this.props.dateFilter.toDateRange !== null ? this.props.dateFilter.toDateRange : undefined} placeholder="dd-MM-yy" onChange={(e) => { this.onToDateChanged(e);}} />
                            </div>
                        </>
                        : null
                    }
                </div>
            </> : null
        )
    }

    private onChangeSelectedFrequency = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state, frequency: DateFrequency[e.target.value], fromDate: null, toDate: null })
    }

    private onChangeSelectedInterval = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state, interval: Number(e.target.value), fromDate: null, toDate: null })
    }

    private onFromDateChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, fromDate: e.target.value })  
    }

    private onToDateChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, toDate: e.target.value })  
    }
}