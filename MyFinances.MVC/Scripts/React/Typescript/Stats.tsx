import * as React from 'react';
import { financeApi, } from '../Api';

interface IOwnProps {
}

export interface IOwnState {
    totalSpent: number[],
    loading: boolean
}

export default class SpendingSummary extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            totalSpent: [],
            loading: true
        };
    }

    public componentDidMount() {
        this.loadSummary();
    }

    private loadSummary = () => {
        financeApi.summary()
            .then(response => this.loadSummarySuccess(response.totalSpent));
    }

    private loadSummarySuccess = (totalSpent: number[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                totalSpent: totalSpent
            }
        }) 
    }

    render() {
        return (
            <div style={{margin: '0 auto'}}>
                <div><h3>Spent in last day: £{this.state.totalSpent[0]}</h3></div>
                <div><h3>Spent in last 7 days: £{this.state.totalSpent[1]}</h3></div>
                <div><h3>Spent in last 30 days: £{this.state.totalSpent[2]}</h3></div>
            </div>
        )
    }
}