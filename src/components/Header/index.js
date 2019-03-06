import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Divider, Drawer, Button
} from 'antd';
import './header.scss';

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

  render() {
    const {
      showDrawer,
      toggleDrawer,
      user,
      title
    } = this.props;
    return (
      <div className="header">
        <Button className="menu-button" onClick={toggleDrawer}>
          <img className="menu-icon" src="/header/burger-menu.png" alt="burger-menu" />
        </Button>
        <div className="header-title">
          {title}
        </div>
        <Drawer
          title="NutriPhi"
          placement="left"
          closable={false}
          onClose={toggleDrawer}
          visible={showDrawer}
        >
          {
            user
              ? (
                <div style={divstyle}>
                  <p style={pStyle}> user is logged in </p>
                  <Divider />
                  <p style={pStyle}> user is logged in </p>
                </div>
              ) : (
                <div style={divstyle}>
                  <p style={pStyle}>
                    <Link to="/" onClick={this.clickedLink}>Log In</Link>
                  </p>
                </div>
              )
          }
        </Drawer>
      </div>
    )
  }
};

export default Header;
