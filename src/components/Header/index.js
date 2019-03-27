import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Col,
  Calendar,
  Drawer,
  Icon,
  Menu,
  Row
} from 'antd';
import './header.scss';

import * as pageTitles from '../../constants/pages';

const { SubMenu } = Menu;

class Header extends Component {
  clickedLink = (pageName) => {
    const { toggleDrawer, changePage } = this.props;
    toggleDrawer();
    if (pageName.length) changePage(pageName);
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
      currentPage
    } = this.props;
    return (
      <div className="header">

        <Row gutter={24}>

          <Col xs={5} md={3} lg={2}>
            <Button className="menu-button" onClick={toggleDrawer}>
              <img className="menu-icon" src="/header/burger-menu.png" alt="burger-menu" />
            </Button>
          </Col>

          <Col xs={13} md={18} lg={19}>
            <div className="header-title">
              {currentPage}
            </div>
          </Col>

          <Col xs={5} md={2} lg={2}>
            {
              currentPage === pageTitles.HOME ? (
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
                <Menu.Item key="home" onClick={() => this.clickedLink('')}>
                  <Link to="/">
                    <Icon type="home" />
                    Home
                  </Link>
                </Menu.Item>

                <Menu.Item key="progress" onClick={() => this.clickedLink('')}>
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
                  <Menu.Item key="all">All</Menu.Item>
                  <Menu.Item key="vegetable" onClick={() => this.clickedLink(pageTitles.VEGETABLE)}>
                    <Link to="/food">
                      Vegetable
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="fruit">Fruit</Menu.Item>
                  <Menu.Item key="milk">Milk</Menu.Item>
                  <Menu.Item key="rice">Rice</Menu.Item>
                  <Menu.Item key="meat">Meat and Fish</Menu.Item>
                  <Menu.Item key="fat">Fats</Menu.Item>
                  <Menu.Item key="sugar">Sugars</Menu.Item>
                  <Menu.Item key="free">Free foods</Menu.Item>
                  <Menu.Item key="beverage">Beverage</Menu.Item>
                </SubMenu>

                <Menu.Item key="logout" onClick={this.handleLogout}>
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
