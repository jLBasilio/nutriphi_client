import React, { Component } from 'react';
import {
  Button
} from 'antd';
import './progress.scss';

import * as pageTitles from '../../constants/pages';

class Profile extends Component {
  clickedLink = () => {
    const { toggleDrawer } = this.props;
    toggleDrawer();
  }

  render() {
    return (
      <div className="profile">
        <br />
        <h1> This is Profile page </h1>
      </div>
    );
  }
}

export default Profile;
