import React, { Component } from 'react';

import './about.scss';

import * as pageTitles from '../../constants/pages';

class About extends Component {
  componentDidMount() {
    const { changePage } = this.props;
    changePage(pageTitles.ABOUT);
  }

  render() {
    return (
      <div className="about">
        <div className="about-body">
          <br />
          <br />
          <br />
          <br />
          <h1> ABOUT PAGE </h1>
          <h1> ABOUT PAGE </h1>
          <h1> ABOUT PAGE </h1>
          <h1> ENTRY PAGE </h1>
        </div>
      </div>
    );
  }
}

export default About;
