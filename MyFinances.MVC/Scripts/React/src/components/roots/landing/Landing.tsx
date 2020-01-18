import * as React from 'react';
import Notification from './notifications/NotificationsConnected';
import SpendingSummary from './spendingSummary/SpendingSummaryConnected';
import IncomeSummary from './incomeSummary/IncomeSummaryConnected';
import UpcomingPayments from '../UpcomingPayments';

class Landing extends React.Component {

    public render() {
        return (
            <div className="landing">
                <Notification />
                <SpendingSummary />    
                <IncomeSummary />
                <UpcomingPayments />
            </div>

        );
    }
}

export default Landing