import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";

interface IOwnProps {
}

export interface IOwnState {
    active: string
}

export const AddMenu = (active: string) => 
    <nav className="navbar navbar-default">
        <div className="container-fluid">
            <ul className="nav navbar-nav">
                <li className={active === "spending" ? "active" : null}><Link to="/addspending">Add Spending</Link></li>
                <li className={active === "route" ? "active" : null} ><Link to="/addroute">Add Route</Link></li>
                <li className={active === "income" ? "active" : null}><Link to="/addincome/">Add Income</Link></li>
                <li className={active === "expense" ? "active" : null}><Link to="/addexpense/">Add Finance</Link></li>
                <li className={active === "category" ? "active" : null}><Link to="/addcategory/">Add Category</Link></li>
            </ul>
        </div>
    </nav>

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
                <Link className={"nav-link" + this.state.active} onClick={() => this.onMenuActive()} to="/addspending/">Add</Link>
                <Link className={"nav-link" + this.state.active} onClick={() => this.onMenuActive()} to="/finance/">Finances</Link>
                <Link className={"nav-link" + this.state.active} onClick={() => this.onMenuActive()} to="/income/">Incomes</Link>
                <Link className={"nav-link" + this.state.active} onClick={() => this.onMenuActive()} to="/spending/">Spendings</Link>
                <Link className={"nav-link" + this.state.active} onClick={() => this.onMenuActive()} to="/route/">Routes</Link>
                <Link className={"nav-link" + this.state.active} onClick={() => this.onMenuActive()} to="/summary/">Summaries</Link>
                <Link className={"nav-link" + this.state.active} onClick={() => this.onMenuActive()} to="/category/">Categories</Link>
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