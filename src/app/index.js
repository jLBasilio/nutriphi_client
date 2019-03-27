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
                <Route exact path="/food" component={Food} />
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
