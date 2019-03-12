import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Col,
  Calendar,
  Divider,
  Drawer,
  Icon,
  Row
} from 'antd';
import './header.scss';

import * as pageTitles from '../../constants/pages';

const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16
};

const divstyle = {
  fontSize: 14,
  lineHeight: '22px',
  marginBottom: 7,
  color: 'rgba(0,0,0,0.65)'
};

class Header extends Component {
  clickedLink = () => {
    const { toggleDrawer } = this.props;
    toggleDrawer();
  }

  handleLogout = () => {
    const { toggleDrawer, logout } = this.props;
    toggleDrawer();
    logout();
  }

  handleDateChange = () => {
    console.log('Changed date!');
  }

  render() {
    const {
      showDrawer,
      toggleDrawer,
      showCalendar,
      toggleCalendar,
      user,
      title
    } = this.props;
    return (
      <div className="header">

        <Row gutter={24}>

          <Col xs={5} md={8} lg={2}>
            <Button className="menu-button" onClick={toggleDrawer}>
              <img className="menu-icon" src="/header/burger-menu.png" alt="burger-menu" />
            </Button>
          </Col>

          <Col xs={13} md={13} lg={19}>
            <div className="header-title">
              {title}
            </div>
          </Col>

          <Col xs={5} md={2} lg={2}>
            {
              title === pageTitles.HOME_TITLE ? (
                <div className="calendar-placement">
                  <Button
                    type="primary"
                    onClick={toggleCalendar}
                  >
                    <Icon type="calendar" />
                  </Button>
                </div>
              ) : null
            }
          </Col>


        </Row>

        <Drawer
          title="NutriPhi"
          placement="left"
          closable
          onClose={toggleDrawer}
          visible={showDrawer}
        >
          {
            user
              ? (
                <div style={divstyle}>
                  <p style={pStyle}>
                    <Link to="/">Home</Link>
                  </p>
                  <Divider />
                  <p style={pStyle}>
                    <Link to="/" onClick={this.handleLogout}>Log Out</Link>
                  </p>
                </div>
              ) : (
                <div style={divstyle}>
                  <p style={pStyle}>
                    <Link to="/" onClick={this.clickedLink}>Log In</Link>
                  </p>
                  <Divider />
                  <p style={pStyle}>
                    <Link to="/signup" onClick={this.clickedLink}>Sign Up</Link>
                  </p>
                </div>
              )
          }
        </Drawer>

        <Drawer
          title="Select Date"
          placement="right"
          closable
          onClose={toggleCalendar}
          visible={showCalendar}
        >
          <Calendar
            fullscreen={false}
            onChange={this.handleDateChange}
          />
        </Drawer>
      </div>
    );
  }
}

export default Header;
