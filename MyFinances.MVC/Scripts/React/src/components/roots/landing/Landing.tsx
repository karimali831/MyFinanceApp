import * as React from 'react';
import SpendingSummary from './SpendingSummaryConnected';
import IncomeSummary from './IncomeSummaryConnected';
import UpcomingPayments from '../UpcomingPayments';

class Landing extends React.Component {

    public render() {
        return (
            <div className="landing">
                <SpendingSummary />    
                <IncomeSummary />
                <UpcomingPayments />
            </div>

        );
    }
}

export default Landing