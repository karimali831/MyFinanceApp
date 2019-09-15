import * as React from 'react';
import { api } from '../Api/Api'
import { Loader } from './Loader';
import { IFinance } from '../Models/IFinance';
import { faArrowDown, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { paymentStatus } from './Utils';


interface IOwnProps {
}

export interface IOwnState {
    upcomingPayments: IFinance[],
    loading: boolean
}

export default class UpcomingPayments extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            upcomingPayments: [],
            loading: true
        };
    }

    public componentDidMount() {
        this.loadUpcomingPayments();
    }

    private loadUpcomingPayments = () => {
        api.finances(false, true)
            .then(response => this.loadPaymentsSuccess(response.finances));
    }

    private loadPaymentsSuccess = (upcomingPayments: IFinance[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                upcomingPayments: upcomingPayments
            }
        }) 
    }

    render() {
        if (this.state.loading) {
            return <Loader text="Loading upcoming payments..." />
        }

        return (
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col" colSpan={2}>
                            Upcoming payments
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.upcomingPayments.filter(p => p.paymentStatus != 0).map(p => 
                        <tr>
                            <th scope="row">
                                <FontAwesomeIcon icon={p.manualPayment ? faExclamationCircle : faArrowDown} />  
                                 {p.name} - £{p.totalAmount == null ? p.avgMonthlyAmount : p.totalAmount}
                            </th>
                            <td>
                                {paymentStatus(p.paymentStatus, p.daysUntilDue, p.daysLate)}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        )
    }
}