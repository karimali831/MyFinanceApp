import React from 'react';
import './App.css';
import Finances from './Typescript/Finances'
import Spendings from './Typescript/Spendings'
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

function App() {
    return (
        <div className="App">

            <Router>
                <div>
                    <nav>
                    <ul>
                        <li>
                        <Link to="/">Home</Link>
                        </li>
                        <li>
                        <Link to="/finances/">Finances</Link>
                        </li>
                        <li>
                        <Link to="/spendings/">Spendings</Link>
                        </li>
                    </ul>
                    </nav>

                    <Route path="/finances/" component={Finances} />
                    <Route path="/spendings/" component={Spendings} />
                </div>
                </Router>
        </div>
    );
}

export default App;