import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";

interface IOwnProps {
}

export interface IOwnState {
    active: string
}

export default class Menu extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            active: ""
        };
    }

    render() {
        return (
            <div className="topnav" id="myTopnav">
                <Link className={"nav-link" + this.state.active} onClick={() => this.onMenuActive()} to="/home">Home</Link>
                <Link className={"nav-link" + this.state.active} onClick={() => this.onMenuActive()} to="/addroute">Add Route</Link>
                <Link className={"nav-link" + this.state.active} onClick={() => this.onMenuActive()} to="/addspending/">Add Spending</Link>
                <Link className={"nav-link" + this.state.active} onClick={() => this.onMenuActive()} to="/addincome/">Add Income</Link>
                <Link className={"nav-link" + this.state.active} onClick={() => this.onMenuActive()} to="/addexpense/">Add Expense</Link>
                <Link className={"nav-link" + this.state.active} onClick={() => this.onMenuActive()} to="/finance/">Finances</Link>
                <Link className={"nav-link" + this.state.active} onClick={() => this.onMenuActive()} to="/income/">Incomes</Link>
                <Link className={"nav-link" + this.state.active} onClick={() => this.onMenuActive()} to="/spending/">Spendings</Link>
                <Link className={"nav-link" + this.state.active} onClick={() => this.onMenuActive()} to="/route/">Routes</Link>
                <Link className={"nav-link" + this.state.active} onClick={() => this.onMenuActive()} to="/summary/">Summaries</Link>
                <a href="javascript:void(0);" className="icon" onClick={() => this.myFunction()}>
                    <FontAwesomeIcon icon={faBars} />
                </a>
            </div>
        )
    }

    private onMenuActive() {
        var x = document.getElementById("myTopnav");

        if (x.className === "topnav responsive") {
            x.className = "topnav";
        } 

        this.setState({ ...this.state, 
            ...{ 
                active: " "
            }
        })  
    }

    private myFunction() {
        var x = document.getElementById("myTopnav");
        x.className += " responsive";
    }
}