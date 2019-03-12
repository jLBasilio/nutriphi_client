import React, { Component } from 'react';
import {
  Button,
  Popover
} from 'antd';
import './entry.scss';

import Header from '../Header/HeaderContainer';
import * as pageTitles from '../../constants/pages';

class Entry extends Component {
  render() {
    const { periodLabel } = this.props;
    return (
      <div className="home">
        <Header title={pageTitles.ENTRY_TITLE} />
        <div className="home-body">
          <br />
          <br />
          <h1> ENTRY PAGE </h1>
          <h1> ENTRY PAGE </h1>
          <h1> ENTRY PAGE </h1>
          <h1> ENTRY PAGE </h1>
          <h1>{periodLabel}</h1>
        </div>
      </div>
    );
  }
}

export default Entry;
