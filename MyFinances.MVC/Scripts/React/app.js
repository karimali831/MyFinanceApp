import React from 'react';
import './App.css';
import Finances from './Typescript/Finances'
import Spendings from './Typescript/Spendings'
import Summary from './Typescript/Summary'
import Routes from './Typescript/Routes'
import AddSpending from './Typescript/AddSpending'
import AddExpense from './Typescript/AddExpense'
import Menu from './Typescript/Menu'
import AddRoute from './Typescript/AddRoute'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <Router>
                <Menu />
                <Redirect exact from="/" to="/home" component={Summary} />
                <Route path="/home" component={Summary} />
                <Route path="/addroute" component={AddRoute} />
                <Route path="/addspending/" component={AddSpending} />
                <Route path="/addexpense/" component={AddExpense} />
                <Route path="/finance/" component={Finances} />
                <Route path="/spending/" component={Spendings} />
                <Route path="/route/" component={Routes} />
            </Router>
        </div>
    );
}

export default App;