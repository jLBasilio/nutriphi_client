import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Popover
} from 'antd';
import './home.scss';

import * as constants from '../../constants';
import * as pageTitles from '../../constants/pages';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPopups: false
    };
  }

  componentDidMount() {
    const { changePage } = this.props;
    changePage(pageTitles.HOME);
  }

  handleAddClick = () => {
    const { showPopups } = this.state;
    this.setState({
      showPopups: !showPopups
    });
  }

  /* Stopped here, add entry functionality, send bfast, lunch or dinner to /entry component */
  handleAddEntry = (period) => {
    const { setPeriod } = this.props;
    setPeriod(period);
  }

  render() {
    const {
      showPopups
    } = this.state;
    return (
      <div className="home">
        <div className="home-body">
          <br />
          <br />
          <h1> HOME PAGE </h1>
        </div>
        <div className="absolute-button">
          <Popover
            content={(
              <div>
                <h5>
                  <Link to="/entry" onClick={() => this.handleAddEntry(constants.BREAKFAST)}>Breakfast</Link>
                </h5>
                <h5>
                  <Link to="/entry" onClick={() => this.handleAddEntry(constants.LUNCH)}>Lunch</Link>
                </h5>
                <h5>
                  <Link to="/entry" onClick={() => this.handleAddEntry(constants.DINNER)}>Dinner</Link>
                </h5>
              </div>
            )}
            placement="topLeft"
            title="Add Log"
            trigger="click"
            visible={showPopups}
            onVisibleChange={this.handleAddClick}
          />
          <Button className="add-button" onClick={this.handleAddClick}>
            <img className="add-img" src="/home/addbutton.png" alt="add-entry" />
          </Button>
        </div>
      </div>
    );
  }
}

export default Home;
