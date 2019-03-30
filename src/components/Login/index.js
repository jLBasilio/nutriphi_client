import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Col,
  Form,
  Icon,
  Input,
  Row
} from 'antd';
import './login.scss';

import * as pageTitles from '../../constants/pages';

class Login extends Component {
  componentDidMount() {
    const { changePage } = this.props;
    changePage(pageTitles.LOGIN);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { userName, password } = e.target;
    const { login } = this.props;
    login({
      userName: userName.value,
      password: password.value
    });
  }

  render() {
    return (
      <div className="login">
        <div className="login-body">
          <Row gutter={24}>
            <Col xs={2} md={6} lg={8} />
            <Col xs={20} md={12} lg={8} className="middle-col">
              <div className="login-box">
                <Form onSubmit={this.handleSubmit} className="login-form">
                  <Form.Item label="Username">
                    <Input
                      className="form-bar"
                      name="userName"
                      placeholder="Username"
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                  </Form.Item>
                  <Form.Item label="Password">
                    <Input
                      className="form-bar"
                      name="password"
                      placeholder="Password"
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      className="login-button"
                      name="login"
                      htmlType="submit"
                    >
                     Log In
                    </Button>
                  </Form.Item>
                </Form>
                <Button
                  className="login-button"
                  id="signup-button"
                  type="primary"
                  name="signup"
                >
                  <Link to="/signup">
                    Sign Up
                  </Link>
                </Button>
              </div>
            </Col>
            <Col xs={2} md={6} lg={8} />
          </Row>
        </div>
      </div>
    );
  }
}

export default Login;
