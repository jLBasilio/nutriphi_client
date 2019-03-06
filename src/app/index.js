import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import 'antd/dist/antd.css';

import Home from '../components/Home/HomeContainer';
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
            <Switch>
              <Route exact path="/" render={() => <Home logout={logout} />} />
              <Redirect to="/" />
            </Switch>
          ) : (
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/signup" component={Signup} />
            </Switch>
          )
        }
      </Router>
    );
  }
}

export default App;
