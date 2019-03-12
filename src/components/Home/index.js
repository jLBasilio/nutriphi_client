import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Popover
} from 'antd';
import './home.scss';

import Header from '../Header/HeaderContainer';
import * as pageTitles from '../../constants/pages';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPopups: false
    };
  }

  handleAddClick = () => {
    const { showPopups } = this.state;
    this.setState({
      showPopups: !showPopups
    });
  }


  /* Stopped here, add entry functionality, send bfast, lunch or dinner to /entry component */
  handleAddEntry = (periodLabel) => {
    const { setLabel } = this.props;
    console.log(periodLabel);
    setLabel(periodLabel);
  }

  render() {
    const {
      showPopups
    } = this.state;
    return (
      <div className="home">
        <Header title={pageTitles.HOME_TITLE} />
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
                  <Link to="/entry" onClick={() => this.handleAddEntry('Breakfast')}>Breakfast</Link>
                </h5>
                <h5>
                  <Link to="/entry" onClick={() => this.handleAddEntry('Lunch')}>Lunch</Link>
                </h5>
                <h5>
                  <Link to="/entry" onClick={() => this.handleAddEntry('Dinner')}>Dinner</Link>
                </h5>
              </div>
            )}
            placement="topLeft"
            title="Select Period"
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
