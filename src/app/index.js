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
      user: null
    };
  }

  async componentDidMount() {
    try {
      const { data: { user } } = await auth.getSession();
      this.setState({ user }, () => {
        this.setState({ isLoading: false });
      });
    } catch (err) {
      console.log(err);
    }
  }

  updateUser = (user) => {
    this.setState({ user });
  }

  updateLoader = (isLoading) => {
    this.setState({ isLoading });
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
              <Route
                exact
                path="/"
                render={() =>
                <Home updateUser={this.updateUser} updateLoader={this.updateLoader} />}/>
              <Redirect to="/" />
            </Switch>
          ) : (
            <Switch>
              <Route exact path="/login" render={() => <Login updateUser={this.updateUser} />}/>
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
