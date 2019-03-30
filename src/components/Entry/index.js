import React, { Component } from 'react';

import './entry.scss';


class Entry extends Component {
  render() {
    const { periodLabel } = this.props;
    return (
      <div className="home">
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
