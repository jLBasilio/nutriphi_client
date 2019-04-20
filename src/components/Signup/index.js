import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button,
  Col,
  DatePicker,
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

import * as pageTitles from '../../constants/pages';
import * as signupConst from '../../constants';
import * as signupUtil from '../../utils/signup.util';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: 'jeff',
      lastName: 'basilio',
      userName: null,
      password: null,
      confirmPassword: null,
      sex: 'M',

      birthday: '1999-05-31',
      weightKg: 68,
      weightLbs: 149.6,
      goalKg: 60,
      goalLbs: null,
      heightCm: 175,
      heightFt: 5,
      heightInch: 9,

      lifestyleMultiplier: null,
      target: null,
      endDate: null

    };
  }

  componentDidMount() {
    const { changePage } = this.props;
    changePage(pageTitles.SIGNUP);
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

  handleWeight = async (e) => {
    const weight = e.target.value;
    const { weightKg, weightLbs, heightCm } = this.state;
    if (e.target.name === 'weightKg') {
      this.setState({ weightKg: weight, weightLbs: parseFloat((weight * 2.2).toFixed(2)) });
    } else if (e.target.name === 'weightLbs') {
      this.setState({ weightKg: parseFloat((weight / 2.2).toFixed(2)), weightLbs: weight });
    } else if (e.target.name === 'goalKg') {
      const bmi = await signupUtil.getBMIFromGoal({ goalKg: weight, heightCm });
      if (bmi !== 'normal' && weight.toString().length >= 2) {
        message.warning(`Your BMI will be ${bmi}.`);
      }
      this.setState({
        goalKg: weight,
        goalLbs: parseFloat((weight * 2.2).toFixed(2)),
        target: weightKg > weight ? 'lose' : weightKg < weight ? 'gain' : 'maintain'
      });
    } else if (e.target.name === 'goalLbs') {
      const goalKg = parseFloat((weight / 2.2).toFixed(2))
      const bmi = await signupUtil.getBMIFromGoal({ goalKg, heightCm });
      if (bmi !== 'normal' && goalKg.toString().length >= 2) {
        message.warning(`Your BMI will be ${bmi}.`);
      }
      this.setState({
        goalKg,
        goalLbs: weight,
        target: weightLbs > weight ? 'lose' : weightLbs < weight ? 'gain' : 'maintain'
      });
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
      const { signup } = this.props;
      const { lifestyleMultiplier, goalKg } = this.state;
      signup({ goalKg, lifestyleMultiplier });
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
        <div className="signup-body">
          <div className="page-title">
            Sign up for Nutriphi
          </div>
          <div className="form-group">
            <div className="one-row">
              <div className="one-form">
                <div className="form-title">
                  First name
                </div>
                <Input
                  className="form-bar"
                  required
                  value={firstName}
                  name="firstName"
                  onChange={this.handleChange}
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
              </div>
              <div className="one-form">
                <div className="form-title">
                  Last name
                </div>
                <Input
                  className="form-bar"
                  value={lastName}
                  name="lastName"
                  onChange={this.handleChange}
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
              </div>
            </div>
            <div className="one-row">
              <div className="one-form">
                <div className="form-title">
                  Username
                </div>
                <Input
                  required
                  className="form-bar"
                  value={userName}
                  name="userName"
                  onChange={this.handleChange}
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
              </div>

              <div className="one-form">
                <div className="form-title">
                  Password
                </div>
                <Input
                  className="form-bar"
                  type="password"
                  value={password}
                  name="password"
                  onChange={this.handleChange}
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
              </div>

              <div className="one-form">
                <div className="form-title">
                  Confirm password
                </div>
                <Input
                  className="form-bar"
                  type="password"
                  value={confirmPassword}
                  name="confirmPassword"
                  onChange={this.handleChange}
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
              </div>
            </div>
            <div className="one-row">
              <div className="one-form">
                <div className="form-title">
                  Biological Sex
                </div>
                <RadioGroup
                  className="form-bar"
                  name="sex"
                  onChange={this.handleChange}
                  value={sex}
                >
                  <Radio value="M">Male</Radio>
                  <Radio value="F">Female</Radio>
                </RadioGroup>
              </div>
              <div className="one-form">
                <div className="form-title">
                  Birthday
                </div>
                <DatePicker className="form-bar" onChange={this.handleBirthday} />
              </div>
            </div>
            <div className="one-row">
              <div className="one-form">
                <div className="form-title">
                  Weight (kg)
                </div>
                <Input
                  className="form-bar"
                  value={weightKg}
                  name="weightKg"
                  onChange={this.handleWeight}
                  prefix={<Icon type="heart" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix="kg"
                />
              </div>
              <div className="one-form">
                <div className="form-title">
                  Weight (lbs)
                </div>
                <Input
                  className="form-bar"
                  value={weightLbs}
                  name="weightLbs"
                  onChange={this.handleWeight}
                  prefix={<Icon type="heart" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix="lbs"
                />
              </div>
            </div>
            <div className="one-row">
              <div className="one-form">
                <div className="form-title">
                  Height (cm)
                </div>
                <Input
                  required
                  className="form-bar"
                  value={heightCm}
                  name="heightCm"
                  onChange={this.handleHeight}
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix="cm"
                />
              </div>

              <div className="one-form">
                <div className="form-title">
                  Height (ft)
                </div>
                <Input
                  className="form-bar"
                  value={heightFt}
                  name="heightFt"
                  onChange={this.handleHeight}
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix="ft"
                />
              </div>

              <div className="one-form">
                <div className="form-title">
                  Height (in)
                </div>
                <Input
                  className="form-bar"
                  value={heightInch}
                  name="heightInch"
                  onChange={this.handleHeight}
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix="in"
                />
              </div>
            </div>
          </div>
          <div className="one-row">
            <div className="button-container">
              <Button
                className="next-button"
                type="primary"
                onClick={this.handleNext}
                loading={isCheckingExisting}
              >
                Next
              </Button>
            </div>
          </div>

          {
            dbwKg || dbwLbs ? (
              <Fragment>

                <div className="recommended-container">
                  <div className="recommended-val">
                    Recommended Weight:
                  </div>
                  <div className="recommended-val">
                    {`${dbwKg} kg or ${dbwLbs} lbs`}
                  </div>
                </div>

                <div className="form-group">

                  <div className="one-row">
                    <div className="one-form">
                      <div className="form-title">
                        Goal
                      </div>
                      <Select disabled value={target || 'Select Goal'}>
                        <Option value="lose">Lose weight</Option>
                        <Option value="gain">Gain weight</Option>
                        <Option value="maintain">Maintain weight</Option>
                      </Select>
                    </div>
                    <div className="one-form">
                      <div className="form-title">
                        Goal weight (kg)
                      </div>
                      <Input
                        className="form-bar"
                        value={goalKg}
                        name="goalKg"
                        onChange={this.handleWeight}
                        prefix={<Icon type="heart" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        suffix="kg"
                      />
                    </div>
                    <div className="one-form">
                      <div className="form-title">
                        Goal weight (lbs)
                      </div>
                      <Input
                        className="form-bar"
                        value={goalLbs}
                        name="goalLbs"
                        onChange={this.handleWeight}
                        prefix={<Icon type="heart" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        suffix="lbs"
                      />
                    </div>
                  </div>

                  <div className="one-row">
                    <div className="one-form">
                      <div className="form-title empty">
                        Lifestyle
                      </div>
                      <Select placeholder="Select current lifestyle" onChange={this.handlelifestyleMultiplier}>
                        <Option value={signupConst.BED_REST}>Bed rest</Option>
                        <Option value={signupConst.SEDENTARY}>Sedentary</Option>
                        <Option value={signupConst.LIGHT}>Light</Option>
                        <Option value={signupConst.MODERATE}>Moderate</Option>
                        <Option value={signupConst.VERY_ACTIVE}>Very Active</Option>
                      </Select>
                    </div>
                    <div className="one-form">
                      <div className="form-title">
                        Goal Timespan
                      </div>
                      <div className="form-title">
                        {`(Recommended weeks = ${Math.abs(recommended.toFixed(0))})`}
                      </div>
                      <DatePicker className="form-bar" onChange={this.handleEndDate} />
                    </div>
                  </div>
                </div>
                <div className="one-row">
                  <div className="button-container">
                    <Button
                      className="next-button back-button"
                      type="primary"
                      href="/"
                    >
                      Back
                    </Button>
                  </div>
                  <div className="button-container">
                    <Button
                      className="next-button"
                      type="primary"
                      onClick={this.handleSignup}
                      loading={isSigningUp}
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
              </Fragment>
            ) : null
          }

          <Row gutter={24}>
            <Col xs={2} md={4} lg={6} />
            <Col xs={20} md={16} lg={12} className="middle-col">

              <Modal
                title="Summary"
                visible={showConfirmModal}
                onOk={this.handleConfirm}
                onCancel={this.handleCancel}
                confirmLoading={isConfirming}
              >
                <h2>{`${firstName} ${lastName}`}</h2>
                <h2>{`Initial Weight: ${weightKg}kg | ${weightLbs}lbs`}</h2>
                <h2>{`Goal: ${target === 'lose' ? 'Lose' : target === 'gain' ? 'Gain' : 'Maintain'}`}</h2>
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
