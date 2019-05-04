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
const foodSections = [
  'All',
  'Favorites',
  'Vegetable',
  'Fruit',
  'Milk',
  'Rice',
  'Meat',
  'Fat',
  'Sugar',
  'Free',
  'Beverage'
];

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentDateSelected: null
    };
  }

  componentDidUpdate(props) {
    const { dateToday } = this.props;
    if (props.dateToday !== dateToday) {
      this.setState({ currentDateSelected: dateToday });
    }
  }

  clickedLink = () => {
    const { toggleDrawer } = this.props;
    toggleDrawer();
  }

  handleLogout = () => {
    const { toggleDrawer, logout } = this.props;
    toggleDrawer();
    logout();
  }

  handleDateChange = (dateMoment) => {
    const date = `${dateMoment.year()}-${(dateMoment.month() < 10 ? '0' : '') + (dateMoment.month() + 1)}-${(dateMoment.date() < 10 ? '0' : '') + dateMoment.date()}`;
    this.setState({
      currentDateSelected: date
    });
  }

  handleGoToday = () => {
    const {
      user,
      dateToday,
      fetchLogs,
      toggleCalendar,
      changeDate,
      dateSelected
    } = this.props;
    if (dateToday !== dateSelected) {
      fetchLogs({
        userId: user.id,
        date: dateToday,
        skip: 0,
        take: 10
      });
      changeDate(dateToday);
    }
    toggleCalendar();
  }

  handleGoToDate = () => {
    const {
      user,
      fetchLogs,
      toggleCalendar,
      changeDate,
      dateSelected
    } = this.props;
    const { currentDateSelected } = this.state;
    if (dateSelected !== currentDateSelected) {
      fetchLogs({
        userId: user.id,
        date: currentDateSelected,
        skip: 0,
        take: 10
      });
      changeDate(currentDateSelected);
    }
    toggleCalendar();
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
                <Menu.Item key="home" onClick={this.clickedLink}>
                  <Link to="/">
                    <Icon type="home" />
                    Home
                  </Link>
                </Menu.Item>

                <Menu.Item key="profile" onClick={this.clickedLink}>
                  <Link to="/profile">
                    <Icon type="user" />
                    Profile
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
                  {
                    foodSections.map(element => (
                      <Menu.Item key={element.toLowerCase()} onClick={this.clickedLink}>
                        <Link to={`/food/${element.toLowerCase()}`}>
                          {element}
                        </Link>
                      </Menu.Item>
                    ))
                  }
                </SubMenu>

                <Menu.Item key="meal" onClick={this.clickedLink}>
                  <Link to="/meal">
                    <Icon type="heart" />
                    Meal
                  </Link>
                </Menu.Item>

                <Menu.Item key="about" onClick={this.clickedLink}>
                  <Link to="/about">
                    <Icon type="question-circle" />
                    About
                  </Link>
                </Menu.Item>

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
          className="calendar-drawer"
          title="Select Date"
          placement="right"
          closable
          onClose={toggleCalendar}
          visible={showCalendar}
        >
          <Calendar
            className="calendar"
            fullscreen={false}
            onChange={this.handleDateChange}
            onSelect={this.handleDateSelect}
          />

          <div className="button-section">
            <Button
              className="select-button"
              onClick={toggleCalendar}
            >
              Cancel
            </Button>
            <Button
              className="select-button"
              onClick={this.handleGoToday}
              type="primary"
            >
              Today
              <Icon type="clock-circle" />
            </Button>
            <Button
              className="select-button"
              onClick={this.handleGoToDate}
              type="primary"
            >
              Selected
              <Icon type="right" />
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default Header;
