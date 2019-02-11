import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import 'antd/dist/antd.css';

import Home from '../components/Home';
import Loader from '../components/Loader';
import Login from '../components/Login';
import Signup from '../components/Signup';
import * as auth from '../api/auth';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      user: ''
    };
  }

  async componentDidMount() {
    const { data: { user } } = await auth.getSession();
    if (user) {
      this.setState({ user });
    }
    setTimeout(() => this.setState({ isLoading: false }), 1500);
  }

  render() {
    const { user, isLoading } = this.state;
    return (
      <Router>
        {
          isLoading ? (
            <Loader />
          ) : user ? (
            <Switch>
              <Route exact path="/" component={Home} />
              <Redirect to="/" />
            </Switch>
          ) : (
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Redirect to="/login" />
            </Switch>
          )
        }
      </Router>
    );
  }
}

export default App;
