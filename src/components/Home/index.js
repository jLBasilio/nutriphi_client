import React, { Component } from 'react';
import {
  Button
} from 'antd';
import Login from '../Login';
import * as auth from '../../api/auth';
import './home.scss';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false
    };
  }

  handleLogout = async () => {
    try {
      await auth.logout();
      this.props.updateUser(null);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Login />;
    }
    return (
      <div>
        <h1> HOME PAGE </h1>
        <Button
          type="primary"
          name="login"
          onClick={this.handleLogout}
        >
          LOGOUT
        </Button>
      </div>
    );
  }
}

export default Home;
