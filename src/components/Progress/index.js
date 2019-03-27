import React, { Component } from 'react';
import {
  Button
} from 'antd';
import './progress.scss';

import * as pageTitles from '../../constants/pages';

class Progress extends Component {
  clickedLink = () => {
    const { toggleDrawer } = this.props;
    toggleDrawer();
  }

  render() {
    return (
      <div className="progress">
        <br />
        <h1> This is progress page </h1>
      </div>
    );
  }
}

export default Progress;
