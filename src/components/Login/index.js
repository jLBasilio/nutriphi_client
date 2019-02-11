import React, { Component } from 'react';
import {
  Row,
  Col,
  Form,
  Icon,
  Input,
  Button
} from 'antd';
import Home from '../Home';
import * as auth from '../../api/auth';
import './login.scss';


class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {

      userName: '',
      password: '',
      redirect: false

    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { userName, password } = this.state;
    const { data: { status } } = await auth.login({ userName, password });
    if (status === 200) {
      this.setState({ redirect: true });
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSignup = (e) => {
  }

  render() {
    const { userName, password, redirect } = this.state;

    if (redirect) {
      return (
        <Home />
      );
    }

    return (
      <div className="login">
        <div className="header" />

        <div className="login-body">
          <Row gutter={24}>
            <Col xs={2} md={6} lg={8} />
            <Col xs={20} md={12} lg={8} className="right-col">
              <h2>Login to Nutriphi</h2>
              <div className="login-box">
                <Form
                  onSubmit={this.handleSubmit}
                  className="login-form"
                >
                  <Form.Item label="Username">
                    <Input
                      className="form-bar"
                      value={userName}
                      name="userName"
                      onChange={this.handleChange}
                      placeholder="Username"
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                  </Form.Item>
                  <Form.Item label="Password">
                    <Input
                      className="form-bar"
                      value={password}
                      name="password"
                      onChange={this.handleChange}
                      placeholder="Password"
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                    />
                  </Form.Item>
                </Form>
                <Button
                  className="login-button"
                  type="primary"
                  name="login"
                  onClick={this.handleSubmit}
                >
                 Log In
                </Button>
                <Button
                  className="login-button"
                  id="signup-button"
                  type="primary"
                  name="signup"
                  onClick={this.handleSignup}
                >
                 Sign Up
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
