import React, { Component } from 'react';
import {
  Button
} from 'antd';
import './profile.scss';

import * as pageTitles from '../../constants/pages';

class Profile extends Component {
  componentDidMount() {
    const { changePage } = this.props;
    changePage(pageTitles.PROFILE);
  }

  clickedLink = () => {
    const { toggleDrawer } = this.props;
    toggleDrawer();
  }

  render() {
    const { user } = this.props;
    return (
      <div className="profile">
        <div className="profile-body">
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <h1> This is Profile page </h1>
        </div>
      </div>
    );
  }
}

export default Profile;
