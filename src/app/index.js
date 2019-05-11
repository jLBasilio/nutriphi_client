import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import 'antd/dist/antd.css';
import 'frappe-charts/dist/frappe-charts.min.css';

import Entry from '../components/Entry/EntryContainer';
import Food from '../components/Food/FoodContainer';
import Home from '../components/Home/HomeContainer';
import Header from '../components/Header/HeaderContainer';
import Loader from '../components/Loader';
import Login from '../components/Login/LoginContainer';
import Signup from '../components/Signup/SignupContainer';
import Profile from '../components/Profile/ProfileContainer';
import About from '../components/About/AboutContainer';
import Meal from '../components/Meal/MealContainer';

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
      isLoggingOut
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
                <Route exact path="/" component={Home} />
                <Route exact path="/food/meal" component={Meal} />
                <Route exact path="/food/favorites" render={() => <Food toFetch="favorites" title={pageTitles.FAVORITES} />} />
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
                <Route exact path="/about" component={About} />
                <Route exact path="/profile" component={Profile} />
                <Redirect to="/profile" />
              </Switch>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Header />
              <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/signup" component={Signup} />
                <Redirect to="/" />
              </Switch>
            </React.Fragment>
          )
        }
      </Router>
    );
  }
}

export default App;
