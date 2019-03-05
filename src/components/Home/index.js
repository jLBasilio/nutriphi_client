import React, { Component } from 'react';
import {
  Button
} from 'antd';
import './home.scss';

import Header from '../Header/HeaderContainer';

class Home extends Component {
  render() {
    const { logout } = this.props;
    return (
      <div className="home">
        <Header title="Home" />
        <div className="home-body">
          <br />
          <br />
          <h1> HOME PAGE </h1>
          <Button type="primary" name="login" onClick={logout}>
            LOGOUT
          </Button>
        </div>
      </div>
    );
  }
}

export default Home;
