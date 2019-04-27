import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button,
  DatePicker,
  Divider,
  Icon,
  Input,
  message,
  Modal,
  Radio,
  Select
} from 'antd';
import './signup.scss';

import * as pageTitles from '../../constants/pages';
import * as constants from '../../constants';
import * as signupUtil from '../../utils/signup.util';

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
      endDate: null,
      weeksToComplete: null,
      poundDiff: null,
      kcalAddSubToGoal: null,

      baseTEA: null,
      goalTEA: null

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
      const goalLbs = parseFloat((weight * 2.2).toFixed(2));
      if (bmi !== 'normal' && weight.toString().length >= 2) {
        message.warning(`Your BMI will be ${bmi}.` ,4);
      }
      this.setState({
        goalKg: weight,
        goalLbs,
        target: weightKg > weight ? 'lose' : weightKg < weight ? 'gain' : 'maintain',
        poundDiff: Math.abs(parseFloat((weightLbs - goalLbs).toFixed(2)))
      });
    } else if (e.target.name === 'goalLbs') {
      const goalKg = parseFloat((weight / 2.2).toFixed(2));
      const bmi = await signupUtil.getBMIFromGoal({ goalKg, heightCm });
      if (bmi !== 'normal' && goalKg.toString().length >= 2) {
        message.warning(`Your BMI will be ${bmi}.`, 4);
      }
      this.setState({
        goalKg,
        goalLbs: weight,
        target: weightLbs > weight ? 'lose' : weightLbs < weight ? 'gain' : 'maintain',
        poundDiff: Math.abs(parseFloat((weightLbs - weight).toFixed(2)))

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

  handleEndDate = async (date, dateString) => {
    this.setState({
      endDate: dateString,
      weeksToComplete: await signupUtil.getDiffWeeks(dateString)
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
      message.error('Please fill out all the fields.', 4);
      return false;
    }

    return true;
  }

  handleNext = async () => {
    if (this.validateNext()) {
      const { firstName, lastName } = this.state;
      this.setState({
        firstName: await signupUtil.capitalize(firstName),
        lastName: await signupUtil.capitalize(lastName)
      });
      const { sex, heightCm } = this.state;
      const { checkExistingUser } = this.props;
      const { userName } = this.state;
      checkExistingUser({ userName, sex, heightCm });
    }
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
      weeksToComplete
    } = this.state;

    if (password !== confirmPassword) {
      message.error('Passwords don\'t match.', 4);
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
      target
    };

    const subsetObjVal = Object.values(subsetObj);
    if (subsetObjVal.includes(null)
      || subsetObjVal.includes('')
      || subsetObjVal.includes(0)) {
      message.error('Please fill out the fields correctly.', 4);
      return false;
    }

    if (target !== 'maintain' && (!weeksToComplete || weeksToComplete <= 0)) {
      message.error('Please fill out the fields correctly.', 4);
      return false;
    }

    return true;
  }

  handleSignup = async () => {
    if (this.validateSignup()) {
      const { weeksToComplete, poundDiff, target } = this.state;
      const kcalAddSubToGoal = await signupUtil.validateTimeSpan(poundDiff, weeksToComplete);
      if (!kcalAddSubToGoal && target !== 'maintain') {
        message.error(`Max healthy ${target} exceeded (2lbs/week)`, 4);
      } else {
        const { signup } = this.props;
        const { lifestyleMultiplier, weightKg } = this.state;
        const baseTEA = await signupUtil.getTEA(weightKg, lifestyleMultiplier);
        const goalTEA = target === 'lose'
          ? (baseTEA - kcalAddSubToGoal)
          : target === 'gain'
            ? (baseTEA + kcalAddSubToGoal)
            : baseTEA;

        this.setState({ kcalAddSubToGoal, baseTEA, goalTEA });
        signup(goalTEA);
      }
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
      endDate,
      weeksToComplete,
      kcalAddSubToGoal,
      baseTEA,
      goalTEA
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
      fatPerDay,
      weeksToComplete,
      kcalAddSubToGoal,
      baseTEA,
      goalTEA
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
      target,
      poundDiff,
      goalTEA
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
                  type="number"
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
                  type="number"
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
                  type="number"
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
                  type="number"
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
                  type="number"
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
                    {`${dbwKg} kg OR ${dbwLbs} lbs`}
                  </div>
                </div>

                <div className="form-group">

                  <div className="one-row">
                    <div className="one-form">
                      <div className="form-title">
                        Goal
                      </div>
                      <Select disabled value={target || 'Input goal weight'}>
                        <Option value={constants.LOSE}>Lose weight</Option>
                        <Option value={constants.GAIN}>Gain weight</Option>
                        <Option value={constants.MAINTAIN}>Maintain weight</Option>
                      </Select>
                    </div>
                    <div className="one-form">
                      <div className="form-title">
                        Goal weight (kg)
                      </div>
                      <Input
                        type="number"
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
                        type="number"
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
                        <Option value={constants.BED_REST}>Bed rest</Option>
                        <Option value={constants.SEDENTARY}>Sedentary</Option>
                        <Option value={constants.LIGHT}>Light</Option>
                        <Option value={constants.MODERATE}>Moderate</Option>
                        <Option value={constants.VERY_ACTIVE}>Very Active</Option>
                      </Select>
                    </div>
                    {
                      target !== 'maintain' && (
                        <div className="one-form">
                          <div className="form-title">
                            Goal Timespan
                          </div>
                          <div className="form-title">
                            {`(Recommended weeks = ${poundDiff ? poundDiff.toFixed(0) : null})`}
                          </div>
                          <DatePicker className="form-bar" onChange={this.handleEndDate} />
                        </div>
                      )
                    }
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

          <Modal
            title="Confirm Signup"
            visible={showConfirmModal}
            onCancel={this.handleCancel}
            footer={(
              <div className="one-row">
                <div className="button-container">
                  <Button
                    className="back-button"
                    type="primary"
                    onClick={this.handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
                <div className="button-container">
                  <Button
                    className="next-button"
                    type="primary"
                    onClick={this.handleConfirm}
                    loading={isConfirming}
                  >
                    OK
                  </Button>
                </div>
              </div>
            )}
          >
            <div className="label-container">
              <div className="label">
                {`${firstName} ${lastName} - ${sex} `}
              </div>
            </div>

            <Divider />

            <div className="nut-info nut-subinfo">
              Weight Information
            </div>

            <Divider />

            <div className="info-row">
              <div className="macros">
                Current Weight
              </div>
              <div className="macros-value">
                {`${weightKg} kg | ${weightLbs} lbs`}
              </div>
            </div>

            <Divider />

            <div className="info-row">
              <div className="macros">
                {`kcal/day to ${target ? target.toUpperCase() : null}`}
              </div>
              <div className="macros-value">
                {`${goalTEA}kcal`}
              </div>
            </div>

            <Divider />

            <div className="nut-info">
              Nutrition Requirement
              <div className="nut-subinfo">
                You need to have these everyday to reach your goal:
              </div>
            </div>

            <Divider />

            <div className="info-row">
              <div className="macros">
                Carbohydrate (CHO)
              </div>
              <div className="macros-value">
                {`${choPerDay}g`}
              </div>
            </div>

            <Divider />

            <div className="info-row">
              <div className="macros">
                Protein (PRO)
              </div>
              <div className="macros-value">
                {`${proPerDay}g`}
              </div>
            </div>

            <Divider />

            <div className="info-row">
              <div className="macros">
                Fat (FAT)
              </div>
              <div className="macros-value">
                {`${fatPerDay}g`}
              </div>
            </div>

            <Divider />

            <div className="nut-info">
              <div className="nut-subinfo">
                Click OK to Sign Up.
              </div>
            </div>

          </Modal>

        </div>
      </div>
    );
  }
}

export default Signup;
