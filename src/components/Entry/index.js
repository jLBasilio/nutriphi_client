import React, { Component } from 'react';

import './entry.scss';

import * as pageTitles from '../../constants/pages';

class Entry extends Component {
  componentDidMount() {
    const { changePage } = this.props;
    changePage(pageTitles.ENTRY);
  }

  render() {
    const { period } = this.props;
    return (
      <div className="home">
        <div className="home-body">
          <br />
          <br />
          <h1> ENTRY PAGE </h1>
          <h1> ENTRY PAGE </h1>
          <h1> ENTRY PAGE </h1>
          <h1> ENTRY PAGE </h1>
          <h1>{period}</h1>
        </div>
      </div>
    );
  }
}

export default Entry;
