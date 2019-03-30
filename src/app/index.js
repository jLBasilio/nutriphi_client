import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import 'antd/dist/antd.css';

import Entry from '../components/Entry/EntryContainer';
import Food from '../components/Food/FoodContainer';
import Home from '../components/Home/HomeContainer';
import Header from '../components/Header/HeaderContainer';
import Loader from '../components/Loader';
import Login from '../components/Login/LoginContainer';
import Signup from '../components/Signup/SignupContainer';

import * as pageTitles from '../constants/pages';

class App extends Component {
  componentDidMount() {
    const {
      user,
      getSession
    } = this.props;
    if (!user) getSession();
  }

  render() {
    const {
      user,
      isLoggingIn,
      isGettingSession,
      isLoggingOut,
      logout
    } = this.props;
    return (
      <Router>
        {
          isGettingSession || isLoggingIn || isLoggingOut ? (
            <Loader />
          ) : user ? (

            <React.Fragment>
              <Header />
              <Switch>
                <Route exact path="/" render={() => <Home logout={logout} />} />
                <Route exact path="/food/all" render={() => <Food toFetch="all" title={pageTitles.ALL} />} />
                <Route exact path="/food/vegetable" render={() => <Food toFetch="vegetable" title={pageTitles.VEGETABLE} />} />
                <Route exact path="/food/fruit" render={() => <Food toFetch="fruit" title={pageTitles.FRUIT} />} />
                <Route exact path="/food/milk" render={() => <Food toFetch="milk" title={pageTitles.MILK} />} />
                <Route exact path="/food/rice" render={() => <Food toFetch="rice" title={pageTitles.RICE} />} />
                <Route exact path="/food/meat" render={() => <Food toFetch="meat" title={pageTitles.MEAT} />} />
                <Route exact path="/food/fat" render={() => <Food toFetch="fat" title={pageTitles.FATS} />} />
                <Route exact path="/food/sugar" render={() => <Food toFetch="sugar" title={pageTitles.SUGAR} />} />
                <Route exact path="/food/free" render={() => <Food toFetch="free" title={pageTitles.FREE} />} />
                <Route exact path="/food/beverage" render={() => <Food toFetch="beverage" title={pageTitles.BEVERAGE} />} />
                <Route exact path="/entry" component={Entry} />
                <Redirect to="/" />
              </Switch>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Header />
              <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/signup" component={Signup} />
              </Switch>
            </React.Fragment>
          )
        }
      </Router>
    );
  }
}

export default App;
