import * as React from 'react';
import { DateFrequency } from 'src/enums/DateFrequency';
import { IDateFilter } from 'src/models/IDateFilter';
import { cleanText } from './Utils';
import { CategoryType } from 'src/enums/CategoryType';

export interface IOwnState {
    dateFilter: IDateFilter,
    selectedFrequency: string
}

interface IOwnProps {
    dateFilter?: IDateFilter,
    selectedFrequency: string,
    categoryType: CategoryType,
    dateFilterChanged: (filter: IDateFilter, category: CategoryType) => void,
}

export default class DateFilter extends React.Component<IOwnProps, IOwnState> {

    constructor(props: IOwnProps) {
        super(props);

        this.state = {
            dateFilter: this.props.dateFilter !== undefined ? this.props.dateFilter : this.state.dateFilter,
            selectedFrequency: this.props.dateFilter !== undefined ? DateFrequency[this.props.dateFilter.frequency] : DateFrequency[this.props.selectedFrequency]
        };
    }

    public componentDidUpdate(prevProps: IOwnProps, prevState: IOwnState) {
        if (this.state.dateFilter.frequency !== DateFrequency.DateRange && (
            prevState.dateFilter.frequency !== this.state.dateFilter.frequency || 
            prevState.dateFilter.interval !== this.state.dateFilter.interval)) {
                this.props.dateFilterChanged(this.state.dateFilter, this.props.categoryType); 
        }
        else if ((
            this.state.dateFilter.fromDateRange != null && this.state.dateFilter.toDateRange != null) && 
            prevState.dateFilter.fromDateRange !== this.state.dateFilter.fromDateRange ||
            prevState.dateFilter.toDateRange !== this.state.dateFilter.toDateRange) {
                this.props.dateFilterChanged(this.state.dateFilter, this.props.categoryType); 
        }
    }

    
    public render() {
        return (
            <div className="form-group" style={{width: 'auto'}}>
                <select onChange={(e) => this.onChangeSelectedFrequency(e)} className="form-control">
                {
                    Object.keys(DateFrequency).filter(o => !isNaN(o as any)).map(key => 
                        <option key={key} value={DateFrequency[key]} selected={this.state.selectedFrequency === DateFrequency[key]}>
                            {cleanText(DateFrequency[key])}
                        </option>
                    )
                }
                </select>
                {
                    DateFrequency[this.state.dateFilter.frequency].includes("Last") ?
                        <select onChange={(e) => this.onChangeSelectedInterval(e)} className="form-control">
                        {
                            Array.from(Array(30), (e, i) => {
                                return <option key={i} value={i+1} selected={this.state.dateFilter.interval === i+1}>X = {i+1}</option>
                            })
                        }
                        </select>
                    : this.state.dateFilter.frequency === DateFrequency.DateRange ? 
                    <>
                        <div className="form-group">
                            <input className="form-control" type="date" value={this.state.dateFilter.fromDateRange !== null ? this.state.dateFilter.fromDateRange : undefined} placeholder="dd-MM-yy" onChange={(e) => { this.onFromDateChanged(e);}} />
                        </div>
                        <div className="form-group">
                            <input className="form-control" type="date" value={this.state.dateFilter.toDateRange !== null ? this.state.dateFilter.toDateRange : undefined} placeholder="dd-MM-yy" onChange={(e) => { this.onToDateChanged(e);}} />
                        </div>
                    </>
                    : null
                }
            </div>
        )
    }

    private onChangeSelectedFrequency = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state,
            ...{
                dateFilter: {
                    frequency: DateFrequency[e.target.value], 
                    interval: this.state.dateFilter.interval,
                    fromDateRange: null, 
                    toDateRange: null
                }
            }
        })
    }

    private onChangeSelectedInterval = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state,
            ...{
                dateFilter: {
                    frequency: this.state.dateFilter.frequency,
                    interval: Number(e.target.value), 
                    fromDateRange: null, 
                    toDateRange: null 
                }
            }
        })
    }


    private onFromDateChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        let toDate;

        if (this.state.dateFilter.toDateRange === null) {
            toDate = e.target.value;
        } else if (this.state.dateFilter.toDateRange !== undefined && Date.parse(e.target.value) > Date.parse(this.state.dateFilter.toDateRange)) {
            toDate = e.target.value
        } else {
            toDate = this.state.dateFilter.toDateRange
        }

        this.setState({ ...this.state,
            ...{
                dateFilter: {
                    frequency: this.state.dateFilter.frequency, 
                    interval: this.state.dateFilter.interval,
                    fromDateRange: e.target.value, 
                    toDateRange: toDate
                }
            }
        })
    }

    private onToDateChanged =  (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state,
            ...{
                dateFilter: {
                    frequency: this.state.dateFilter.frequency, 
                    interval: this.state.dateFilter.interval,
                    fromDateRange: this.state.dateFilter.fromDateRange,
                    toDateRange: e.target.value
                }
            }
        }) 
    }
}