import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select
} from 'antd';
import './signup.scss';

import Header from '../Header/HeaderContainer';
import * as pageTitles from '../../constants/pages';
import * as signupConst from '../../constants';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: null,
      lastName: null,
      userName: null,
      password: null,
      confirmPassword: null,
      sex: null,

      birthday: null,
      weightKg: null,
      weightLbs: null,
      goalKg: null,
      goalLbs: null,
      heightCm: null,
      heightFt: null,
      heightInch: null,

      lifestyleMultiplier: null,
      target: null,
      endDate: null

    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    }, () => console.log(this.state));
  }

  handleBirthday = (date, dateString) => {
    this.setState({
      birthday: dateString
    });
  }

  handleWeight = (e) => {
    const weight = e.target.value;
    if (e.target.name === 'weightKg') {
      this.setState({ weightKg: weight, weightLbs: parseFloat((weight * 2.2).toFixed(2)) });
    } else if (e.target.name === 'weightLbs') {
      this.setState({ weightKg: parseFloat((weight / 2.2).toFixed(2)), weightLbs: weight });
    } else if (e.target.name === 'goalKg') {
      this.setState({ goalKg: weight, goalLbs: parseFloat((weight * 2.2).toFixed(2)) });
    } else if (e.target.name === 'goalLbs') {
      this.setState({ goalKg: parseFloat((weight / 2.2).toFixed(2)), goalLbs: weight });
    }
  }

  handleHeight = (e) => {
    const height = e.target.value;
    const { heightFt, heightInch } = this.state;
    let otherValue = 0;

    if (e.target.name === 'heightFt') {
      otherValue = height * 30.48 + heightInch * 2.54;
      this.setState({ heightFt: height, heightCm: parseFloat(otherValue.toFixed(2)) });
    } else if (e.target.name === 'heightInch') {
      otherValue = height * 2.54 + heightFt * 30.48;
      this.setState({ heightInch: height, heightCm: parseFloat(otherValue.toFixed(2)) });
    } else if (e.target.name === 'heightCm') {
      let inchez = (height / 2.54).toFixed(0);
      const feetz = Math.floor(inchez / 12);
      inchez %= 12;
      this.setState({ heightCm: height, heightFt: feetz, heightInch: inchez });
    }
  }

  handlelifestyleMultiplier = (lifestyleMultiplier) => {
    this.setState({ lifestyleMultiplier });
  }

  handleTarget = (target) => {
    this.setState({ target });
  }

  handleEndDate = (date, dateString) => {
    this.setState({
      endDate: dateString
    });
  }

  validateNext = () => {
    const {
      firstName,
      lastName,
      userName,
      password,
      confirmPassword,
      sex,
      birthday,
      weightKg,
      weightLbs,
      heightCm,
      heightFt,
      heightInch
    } = this.state;

    if (password !== confirmPassword) {
      message.error('Passwords don\'t match.');
      return false;
    }

    const subsetObj = {
      firstName,
      lastName,
      userName,
      password,
      confirmPassword,
      sex,
      birthday,
      weightKg,
      weightLbs,
      heightCm,
      heightFt,
      heightInch
    };

    const subsetObjVal = Object.values(subsetObj);
    if (
      subsetObjVal.includes(null)
      || subsetObjVal.includes('')
      || subsetObjVal.includes(0)) {
      message.error('Please fill out the fields correctly.');
      return false;
    }

    return true;
  }

  validateSignup = () => {
    const {
      firstName,
      lastName,
      userName,
      password,
      confirmPassword,
      sex,
      birthday,
      weightKg,
      weightLbs,
      goalKg,
      goalLbs,
      heightCm,
      heightFt,
      heightInch,
      lifestyleMultiplier,
      target,
      endDate
    } = this.state;

    if (password !== confirmPassword) {
      message.error('Passwords don\'t match.');
      return false;
    }

    const subsetObj = {
      firstName,
      lastName,
      userName,
      password,
      confirmPassword,
      sex,
      birthday,
      weightKg,
      weightLbs,
      goalKg,
      goalLbs,
      heightCm,
      heightFt,
      heightInch,
      lifestyleMultiplier,
      target,
      endDate
    };

    const subsetObjVal = Object.values(subsetObj);
    if (
      subsetObjVal.includes(null)
      || subsetObjVal.includes('')
      || subsetObjVal.includes(0)) {
      message.error('Please fill out the fields correctly.');
      return false;
    }
    return true;
  }

  handleNext = () => {
    if (this.validateNext()) {
      const { sex, heightCm } = this.state;
      const { checkExistingUser } = this.props;
      const { userName } = this.state;
      checkExistingUser({ userName, sex, heightCm });
    }
  }

  handleSignup = () => {
    if (this.validateSignup()) {
      const { dbwKg, signup } = this.props;
      const { lifestyleMultiplier } = this.state;
      signup({ dbwKg, lifestyleMultiplier });
    }
  }

  handleConfirm = () => {
    const {
      dbwKg,
      confirmSignup,
      choPerDay,
      proPerDay,
      fatPerDay
    } = this.props;

    const {
      firstName,
      lastName,
      userName,
      password,
      sex,
      birthday,
      weightKg,
      weightLbs,
      goalKg,
      goalLbs,
      heightCm,
      heightFt,
      heightInch,
      lifestyleMultiplier,
      target,
      endDate
    } = this.state;

    confirmSignup({
      firstName,
      lastName,
      userName,
      password,
      sex,
      birthday,
      weightKg,
      weightLbs,
      goalKg,
      goalLbs,
      heightCm,
      heightFt,
      heightInch,
      target,
      dbwKg,
      lifestyleMultiplier,
      endDate,
      choPerDay,
      proPerDay,
      fatPerDay
    });
  }

  handleCancel = () => {
    const { toggleModal } = this.props;
    toggleModal();
  }

  render() {
    const {
      firstName,
      lastName,
      sex,
      userName,
      password,
      confirmPassword,
      weightKg,
      weightLbs,
      heightCm,
      heightFt,
      heightInch,
      goalKg,
      goalLbs,
      target
    } = this.state;

    const {
      isCheckingExisting,
      isConfirming,
      dbwKg,
      dbwLbs,
      isSigningUp,
      choPerDay,
      proPerDay,
      fatPerDay,
      showConfirmModal,
      successSigningUp
    } = this.props;

    const recommended = goalLbs - weightLbs;
    if (successSigningUp) {
      return <Redirect to="/" />;
    }

    return (
      <div className="signup">
        <Header title={pageTitles.SIGNUP_TITLE} />
        <div className="signup-body">
          <Row gutter={24}>
            <Col xs={2} md={4} lg={6} />
            <Col xs={20} md={16} lg={12} className="middle-col">
              <Form>
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <FormItem required label="First Name">
                      <Input
                        required
                        className="form-bar"
                        value={firstName}
                        name="firstName"
                        onChange={this.handleChange}
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      />
                    </FormItem>
                  </Col>
                  <Col xs={24} md={12}>
                    <FormItem required label="Last Name">
                      <Input
                        className="form-bar"
                        value={lastName}
                        name="lastName"
                        onChange={this.handleChange}
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      />
                    </FormItem>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xs={24} md={8}>
                    <FormItem required label="Username">
                      <Input
                        required
                        className="form-bar"
                        value={userName}
                        name="userName"
                        onChange={this.handleChange}
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      />
                    </FormItem>
                  </Col>
                  <Col xs={24} md={8}>
                    <FormItem required label="Password">
                      <Input
                        className="form-bar"
                        type="password"
                        value={password}
                        name="password"
                        onChange={this.handleChange}
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      />
                    </FormItem>
                  </Col>
                  <Col xs={24} md={8}>
                    <FormItem required label="Confirm Password">
                      <Input
                        className="form-bar"
                        type="password"
                        value={confirmPassword}
                        name="confirmPassword"
                        onChange={this.handleChange}
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      />
                    </FormItem>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <FormItem required label="Biological Sex">
                      <RadioGroup name="sex" onChange={this.handleChange} value={sex}>
                        <Radio value="M">Male</Radio>
                        <Radio value="F">Female</Radio>
                      </RadioGroup>
                    </FormItem>
                  </Col>
                  <Col xs={24} md={12}>
                    <FormItem required label="Birthday">
                      <DatePicker
                        onChange={this.handleBirthday}
                      />
                    </FormItem>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <FormItem required label="Weight (kg)">
                      <Input
                        className="form-bar"
                        value={weightKg}
                        name="weightKg"
                        onChange={this.handleWeight}
                        prefix={<Icon type="heart" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        suffix="kg"
                      />
                    </FormItem>
                  </Col>
                  <Col xs={24} md={12}>
                    <FormItem required label="Weight (lbs)">
                      <Input
                        className="form-bar"
                        value={weightLbs}
                        name="weightLbs"
                        onChange={this.handleWeight}
                        prefix={<Icon type="heart" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        suffix="lbs"
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xs={24} md={8}>
                    <FormItem required label="Height (cm)">
                      <Input
                        required
                        className="form-bar"
                        value={heightCm}
                        name="heightCm"
                        onChange={this.handleHeight}
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        suffix="cm"
                      />
                    </FormItem>
                  </Col>
                  <Col xs={24} md={8}>
                    <FormItem required label="Height (ft)">
                      <Input
                        className="form-bar"
                        value={heightFt}
                        name="heightFt"
                        onChange={this.handleHeight}
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        suffix="ft"
                      />
                    </FormItem>
                  </Col>
                  <Col xs={24} md={8}>
                    <FormItem required label="Height (in)">
                      <Input
                        className="form-bar"
                        value={heightInch}
                        name="heightInch"
                        onChange={this.handleHeight}
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        suffix="in"
                      />
                    </FormItem>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={24}>
                    <FormItem className="submit-button">
                      <Button
                        className="next-button"
                        type="primary"
                        onClick={this.handleNext}
                        loading={isCheckingExisting}
                      >
                        Next
                      </Button>
                    </FormItem>
                  </Col>
                </Row>

                {
                  dbwKg || dbwLbs ? (
                    <Fragment>
                      <Row>
                        <Divider id="recommended">
                          {`Recommended Weight: ${dbwKg} kg or ${dbwLbs} lbs`}
                        </Divider>
                      </Row>
                      <Row gutter={24}>
                        <Col xs={24} md={8}>
                          <FormItem required label="User Goal">
                            <Select placeholder="Select Goal" onChange={this.handleTarget}>
                              <Option value={1}>Lose weight</Option>
                              <Option value={2}>Gain weight</Option>
                              <Option value={3}>Maintain weight</Option>
                            </Select>
                          </FormItem>
                        </Col>
                        <Col xs={24} md={8}>
                          <FormItem required label="Goal weight (kg)">
                            <Input
                              className="form-bar"
                              value={goalKg}
                              name="goalKg"
                              onChange={this.handleWeight}
                              prefix={<Icon type="heart" style={{ color: 'rgba(0,0,0,.25)' }} />}
                              suffix="kg"
                            />
                          </FormItem>
                        </Col>
                        <Col xs={24} md={8}>
                          <FormItem required label="Goal weight (lbs)">
                            <Input
                              className="form-bar"
                              value={goalLbs}
                              name="goalLbs"
                              onChange={this.handleWeight}
                              prefix={<Icon type="heart" style={{ color: 'rgba(0,0,0,.25)' }} />}
                              suffix="lbs"
                            />
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col xs={24} md={12}>
                          <FormItem required label="Lifestyle">
                            <Select placeholder="Select current lifestyle" onChange={this.handlelifestyleMultiplier}>
                              <Option value={signupConst.BED_REST}>Bed rest</Option>
                              <Option value={signupConst.SEDENTARY}>Sedentary</Option>
                              <Option value={signupConst.LIGHT}>Light</Option>
                              <Option value={signupConst.MODERATE}>Moderate</Option>
                              <Option value={signupConst.VERY_ACTIVE}>Very Active</Option>
                            </Select>
                          </FormItem>
                        </Col>
                        <Col xs={24} md={12}>
                          <FormItem required label={`Goal Timespan (Recommended weeks = ${recommended.toFixed(0)})`}>
                            <DatePicker
                              onChange={this.handleEndDate}
                            />
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={24}>
                          <FormItem className="submit-button">
                            <Button className="back-button" type="primary" href="/">Back</Button>
                            <Button
                              className="next-button"
                              type="primary"
                              onClick={this.handleSignup}
                              loading={isSigningUp}
                            >
                              Sign Up
                            </Button>
                          </FormItem>
                        </Col>
                      </Row>
                    </Fragment>
                  ) : null
                }
              </Form>
              <Modal
                title="Summary"
                visible={showConfirmModal}
                onOk={this.handleConfirm}
                onCancel={this.handleCancel}
                confirmLoading={isConfirming}
              >
                <h2>{`${firstName} ${lastName}`}</h2>
                <h2>{`Initial Weight: ${weightKg}kg | ${weightLbs}lbs`}</h2>
                <h2>{`Goal: ${target === 1 ? 'Lose' : target === 2 ? 'Gain' : 'Maintain'}`}</h2>
                <h2>You will need to consume:</h2>
                <h3>{`${choPerDay} grams of carbohydrates,`}</h3>
                <h3>{`${proPerDay} grams of proteins;`}</h3>
                <h3>{`and ${fatPerDay} grams of fat everyday`}</h3>
                <br />
                <h2>Click OK to sign up</h2>

              </Modal>
            </Col>
            <Col xs={2} md={4} lg={6} />
          </Row>
        </div>
      </div>
    );
  }
}

export default Signup;
