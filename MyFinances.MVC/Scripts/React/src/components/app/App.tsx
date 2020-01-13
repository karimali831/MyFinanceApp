import * as React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import initialiseStore from '../../state/InitialiseStore';
import AddRoute from '../roots/AddRoute';
import AddSpending from '../roots/spending/AddSpending';
import AddExpense from '../roots/AddExpense';
import Incomes from '../roots/Incomes'
import AddIncome from '../roots/AddIncome';
import AddCategory from '../roots/AddCategory';
import Finances from '../roots/Finances';
import Routes from '../roots/Routes';
import WeekSummaries from '../roots/WeekSummaries';
import Categories from '../roots/Categories';
import { ConnectedRouter } from 'connected-react-router';
import Menu from '../base/Menu';
import { createHashHistory, createBrowserHistory } from 'history';
import Landing from '../roots/landing/Landing';

const browserHistory = history.pushState ? createBrowserHistory() : createHashHistory();

class App extends React.Component {
  private appElement: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

  public render() {
    const store = initialiseStore(browserHistory);

    return (
      <Provider store={store}>
        <ConnectedRouter history={(browserHistory)}>
          <div className="App" ref={this.appElement}>>
            <Menu />
            <Switch>
                <Route exact={true} path="/" component={Landing} />
                <Route path="/home" component={Landing} />
                <Route path="/addroute" component={AddRoute} />
                <Route path="/addspending/" component={AddSpending} />
                <Route path="/addexpense/" component={AddExpense} />
                <Route path="/addincome/" component={AddIncome} />
                <Route path="/addcategory" component={AddCategory} />
                <Route path="/finance/" component={Finances} />
                <Route path="/income/:sourceId?/:frequency?/:interval?/:fromDate?/:toDate?" exact={true} component={Incomes} />
                {/* <Route exact={true} path="/spending/:catId?/:frequency?/:interval?/:isFinance?/:isSecondCat?/:fromDate?/:toDate?" render={() => <Spendings/>} /> */}
                <Route path="/route/" component={Routes} />
                <Route path="/summary/" component={WeekSummaries} />
                <Route path="/category/" component={Categories} />
            </Switch>
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}
  
export default App;