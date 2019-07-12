import * as React from 'react';
// import 'Finances.less';
import { IFinances, financeApi } from './Api';

interface IOwnProps {
}

export interface IOwnState {
    finances: IFinances[],
    loading: boolean
}

export default class Finances extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            loading: true,
            finances: []
        };
    }

    public componentDidMount() {
        this.loadFinances();
    }

    loadFinances = () => {
        financeApi.finances()
            .then(response => this.loadFinancesSuccess(response.finances));
    }

    loadFinancesSuccess = (finances: IFinances[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                finances: finances
            }
        }) 
    }

    render() {
        if (this.state.finances.length > 0) {
            return (
                <ul>
                {
                    this.state.finances.map((a, idx) => 
                        <li className="finance" key={a.id}>
                            <div className="title">{a.name}</div>
                        </li>
                    
                    )
                }
                </ul>
            )
        } else {
            return "No finances";
        }
    }
}