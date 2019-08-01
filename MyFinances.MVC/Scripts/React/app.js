import React from 'react';
import './App.css';
import Finances from './Typescript/Finances'
import Spendings from './Typescript/Spendings'
import AddSpending from './Typescript/AddSpending'
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <Router>
                <nav className="navbar navbar-expand-sm bg-light">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/addspending/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/finance/">Finances</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/spending/">Spendings</Link>
                        </li>
                    </ul>
                </nav>
                <Route path="/addspending/" component={AddSpending} />
                <Route path="/finance/" component={Finances} />
                <Route path="/spending/" component={Spendings} />
            </Router>
        </div>
    );
}

export default App;