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
import * as constants from '../constants';

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
                <Route
                  exact
                  path="/food/all"
                  render={() => <Food toFetch="all" foodCount={constants.ALL_COUNT} foo title={pageTitles.ALL} />}
                />
                <Route
                  exact
                  path="/food/vegetable"
                  render={() => <Food toFetch="vegetable" foodCount={constants.VEG_COUNT} title={pageTitles.VEGETABLE} />}
                />
                <Route
                  exact
                  path="/food/fruit"
                  render={() => <Food toFetch="fruit" foodCount={constants.FRUIT_COUNT} title={pageTitles.FRUIT} />}
                />
                <Route
                  exact
                  path="/food/milk"
                  render={() => <Food toFetch="milk" foodCount={constants.MILK_COUNT} title={pageTitles.MILK} />}
                />
                <Route
                  exact
                  path="/food/rice"
                  render={() => <Food toFetch="rice" foodCount={constants.RICE_COUNT} title={pageTitles.RICE} />}
                />
                <Route
                  exact
                  path="/food/meat"
                  render={() => <Food toFetch="meat" foodCount={constants.MEAT_COUNT} title={pageTitles.MEAT} />}
                />
                <Route
                  exact
                  path="/food/fat"
                  render={() => <Food toFetch="fat" foodCount={constants.FAT_COUNT} title={pageTitles.FATS} />}
                />
                <Route
                  exact
                  path="/food/sugar"
                  render={() => <Food toFetch="sugar" foodCount={constants.SUGAR_COUNT} title={pageTitles.SUGAR} />}
                />
                <Route
                  exact
                  path="/food/free"
                  render={() => <Food toFetch="free" foodCount={constants.FREE_COUNT} title={pageTitles.FREE} />}
                />
                <Route
                  exact
                  path="/food/beverage"
                  render={() => <Food toFetch="beverage" foodCount={constants.BEV_COUNT} title={pageTitles.BEVERAGE} />}
                />
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
