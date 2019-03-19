import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Col,
  Calendar,
  Divider,
  Drawer,
  Icon,
  Menu,
  Row
} from 'antd';
import './header.scss';

import * as pageTitles from '../../constants/pages';

const { SubMenu } = Menu;

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
            user ? (
              <Menu
                className="sidebar-menu"
                defaultSelectedKeys={['1']}
                mode="inline"
              >

                <Menu.Item key="1" onClick={this.clickedLink}>
                  <Link to="/">
                    <Icon type="home" />
                    Home
                  </Link>
                </Menu.Item>

                <Menu.Item key="2" onClick={this.clickedLink}>
                  <Link to="/progress">
                    <Icon type="home" />
                    Progress
                  </Link>
                </Menu.Item>

                <SubMenu
                  key="3"
                  title={(
                    <span>
                      <Icon type="heart" />
                      <span>Food List</span>
                    </span>
                  )}
                >
                  <Menu.Item key="31">Meat</Menu.Item>
                  <Menu.Item key="32">Fish</Menu.Item>
                  <Menu.Item key="33">Vegetable</Menu.Item>
                  <Menu.Item key="34">Fruit</Menu.Item>
                  <Menu.Item key="35">Beverage</Menu.Item>
                </SubMenu>

                <Menu.Item key="5" onClick={this.handleLogout}>
                  <Link to="/">
                    <Icon type="logout" />
                    Log Out
                  </Link>
                </Menu.Item>
              </Menu>


            ) : (


              <Menu
                className="sidebar-menu"
                defaultSelectedKeys={['1']}
                mode="inline"
              >
                <Menu.Item key="1" onClick={this.clickedLink}>
                  <Link to="/">
                    <Icon type="login" />
                    Log In
                  </Link>
                </Menu.Item>

                <Menu.Item key="2" onClick={this.clickedLink}>
                  <Link to="/signup">
                    <Icon type="user-add" />
                    Sign Up
                  </Link>
                </Menu.Item>

              </Menu>
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
