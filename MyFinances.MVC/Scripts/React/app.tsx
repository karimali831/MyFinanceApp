import React from 'react';
import './App.css';
import Finances from './Typescript/Finances'
import Spendings from './Typescript/Spendings'
import Summary from './Typescript/Summary'
import Routes from './Typescript/Routes'
import Incomes from './Typescript/Incomes'
import Categories from './Typescript/Categories'
import AddSpending from './Typescript/AddSpending'
import AddExpense from './Typescript/AddExpense'
import AddIncome from './Typescript/AddIncome'
import AddCategory from './Typescript/AddCategory'
import WeekSummaries from './Typescript/WeekSummaries'
import Menu from './Typescript/Menu'
import AddRoute from './Typescript/AddRoute'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

class App extends React.Component{
    render() {
        return (
            <div className="App">
                <Router>
                    <Menu />
                    <Redirect exact from="/" to="/home" component={Summary} />
                    <Route path="/home" component={Summary} />
                    <Route path="/addroute" component={AddRoute} />
                    <Route path="/addspending/" component={AddSpending} />
                    <Route path="/addexpense/" component={AddExpense} />
                    <Route path="/addincome/" component={AddIncome} />
                    <Route path="/addcategory" component={AddCategory} />
                    <Route path="/finance/" component={Finances} />
                    <Route path="/income/:sourceId?/:frequency?/:interval?" exact component={Incomes} />
                    <Route path="/spending/:catId?/:frequency?/:interval?/:isFinance?/:isSecondCat?" exact component={Spendings} />
                    <Route path="/route/" component={Routes} />
                    <Route path="/summary/" component={WeekSummaries} />
                    <Route path="/category/" component={Categories} />
                </Router>
            </div>
        );
    }
}

export default App;