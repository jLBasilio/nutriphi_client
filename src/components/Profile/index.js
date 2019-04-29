import React, { Component } from 'react';
import {
  Button,
  DatePicker,
  Divider,
  Icon,
  Input,
  message,
  Modal,
  Select
} from 'antd';
import './profile.scss';

import * as constants from '../../constants';
import * as pageTitles from '../../constants/pages';
import * as profileUtil from '../../utils/profile.util';
import * as signupUtil from '../../utils/signup.util';

const { Option } = Select;
class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bmiClass: null,
      weightKg: null,
      weightLbs: null,
      goalKg: null,
      goalLbs: null,
      heightCm: null,
      heightFt: 0.00,
      heightInch: 0.00,
      target: null,
      poundDiff: null,
      lifestyleMultiplier: null,
      endDate: null,
      weeksToComplete: null,
      weeksLeft: null,
      daysLeft: null,
      choPerDay: null,
      proPerDay: null,
      fatPerDay: null,
      kcalAddSubToGoal: null,
      baseTEA: null,
      goalTEA: null,

      healthButtonDisabled: true,
      goalButtonDisabled: true
    };
  }

  componentDidMount() {
    const { changePage } = this.props;
    changePage(pageTitles.PROFILE);
    this.resetFromUser();
  }

  resetFromUser = async () => {
    const { user } = this.props;
    try {
      this.setState({
        bmiClass: user.bmiClass,
        heightCm: parseFloat(user.heightCm),
        heightFt: parseFloat(user.heightFt),
        heightInch: parseFloat(user.heightInch),
        weightKg: parseFloat(user.weightKg),
        weightLbs: parseFloat(user.weightLbs),
        target: user.target,
        lifestyleMultiplier: parseFloat(user.lifestyleMultiplier),
        goalKg: parseFloat(user.goalKg),
        goalLbs: parseFloat(user.goalLbs),
        poundDiff: Math.abs(parseFloat(
          (parseFloat(user.weightLbs) - parseFloat(user.goalLbs)).toFixed(2)
        )),
        endDate: user.endDate,
        weeksToComplete: user.weeksToComplete,
        goalTEA: user.goalTEA,
        baseTEA: user.baseTEA
      });

      if (user.target !== 'maintain') {
        const timeLeft = await profileUtil.calculateDaysLeft(user.endDate);
        const { weeksLeft, daysLeft } = timeLeft;
        this.setState({ weeksLeft, daysLeft });
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  handleHealthEdit = () => {
    const { toggleHealthEdit } = this.props;
    this.resetFromUser();
    this.setState({ healthButtonDisabled: true });
    toggleHealthEdit();
  }

  handleGoalEdit = () => {
    const { toggleGoalEdit } = this.props;
    this.resetFromUser();
    this.setState({ goalButtonDisabled: true });
    toggleGoalEdit();
  }

  handleHeightEdit = (e) => {
    const height = e.target.value;
    const { heightFt, heightInch } = this.state;
    let otherValue = 0;

    if (e.target.name === 'heightFt') {
      otherValue = height * 30.48 + heightInch * 2.54;
      this.setState({
        heightFt: height,
        heightCm: parseFloat(otherValue.toFixed(2))
      }, () => this.checkHealthChange());
    } else if (e.target.name === 'heightInch') {
      otherValue = height * 2.54 + heightFt * 30.48;
      this.setState({
        heightInch: height,
        heightCm: parseFloat(otherValue.toFixed(2))
      }, () => this.checkHealthChange());
    } else if (e.target.name === 'heightCm') {
      let inchez = (height / 2.54).toFixed(0);
      const feetz = Math.floor(inchez / 12);
      inchez %= 12;
      this.setState({
        heightCm: height,
        heightFt: feetz,
        heightInch: inchez
      }, () => this.checkHealthChange());
    }
  }

  handleWeightEdit = async (e) => {
    const weight = parseFloat(e.target.value);
    const {
      weightKg,
      weightLbs,
      heightCm,
      goalLbs
    } = this.state;

    if (e.target.name === 'weightKg') {
      const bmi = await signupUtil.getBMIFromGoal({ goalKg: weight, heightCm });
      const newLbs = parseFloat((weight * 2.2).toFixed(2));
      if (bmi !== 'normal' && weight.toString().length >= 2) {
        message.warning(`Your BMI will be ${bmi}.`, 4);
      }
      const holder = Math.abs(parseFloat((newLbs - goalLbs).toFixed(2)));
      this.setState({
        weightKg: parseFloat(weight),
        weightLbs: newLbs,
        poundDiff: holder < 1 ? 1 : holder
      }, () => this.checkHealthChange());
    } else if (e.target.name === 'weightLbs') {
      const kgWeight = parseFloat((weight / 2.2).toFixed(2));
      const bmi = await signupUtil.getBMIFromGoal({ goalKg: kgWeight, heightCm });
      if (bmi !== 'normal' && weight.toString().length >= 2) {
        message.warning(`Your BMI will be ${bmi}.`, 4);
      }
      const holder = Math.abs(parseFloat((weight - goalLbs).toFixed(2)));
      this.setState({
        weightKg: kgWeight,
        weightLbs: weight,
        poundDiff: holder < 1 ? 1 : holder
      }, () => this.checkHealthChange());
    } else if (e.target.name === 'goalKg') {
      const bmi = await signupUtil.getBMIFromGoal({ goalKg: weight, heightCm });
      const newGoalLbs = parseFloat((weight * 2.2).toFixed(2));
      if (bmi !== 'normal' && weight.toString().length >= 2) {
        message.warning(`Your BMI will be ${bmi}.`, 4);
      }
      const holder = Math.abs(parseFloat((weightLbs - newGoalLbs).toFixed(2)));
      this.setState({
        goalKg: parseFloat(weight),
        goalLbs: newGoalLbs,
        target: weightKg > weight ? 'lose' : weightKg < weight ? 'gain' : 'maintain',
        poundDiff: holder < 1 ? 1 : holder
      }, () => this.checkGoalChange());
    } else if (e.target.name === 'goalLbs') {
      const goalKg = parseFloat((weight / 2.2).toFixed(2));
      const bmi = await signupUtil.getBMIFromGoal({ goalKg, heightCm });
      if (bmi !== 'normal' && goalKg.toString().length >= 2) {
        message.warning(`Your BMI will be ${bmi}.`, 4);
      }
      const holder = Math.abs(parseFloat((weightLbs - weight).toFixed(2)));
      this.setState({
        goalKg,
        goalLbs: parseFloat(weight),
        target: weightLbs > weight ? 'lose' : weightLbs < weight ? 'gain' : 'maintain',
        poundDiff: holder < 1 ? 1 : holder
      }, () => this.checkGoalChange());
    }
  }

  handlelifestyleMultiplier = (lifestyleMultiplier) => {
    this.setState({
      lifestyleMultiplier, goalButtonDisabled: false
    }, () => this.checkGoalChange());
  }

  handleEndDate = async (date, dateString) => {
    this.setState({
      endDate: dateString,
      weeksToComplete: await signupUtil.getDiffWeeks(dateString),
      goalButtonDisabled: false
    });
  }

  checkHealthChange = () => {
    const { user } = this.props;
    const { weightKg, heightCm } = this.state;


    if (parseFloat(user.weightKg) === weightKg
      && parseFloat(user.heightCm) === heightCm) {
      this.resetFromUser();
      this.setState({ healthButtonDisabled: true });
    } else {
      this.setState({ healthButtonDisabled: false });
    }
  }

  checkGoalChange = () => {
    const { user } = this.props;
    const { goalKg, lifestyleMultiplier, endDate } = this.state;

    if (parseFloat(user.goalKg) === goalKg
      && parseFloat(user.lifestyleMultiplier) === lifestyleMultiplier
      && user.endDate === endDate) {
      this.resetFromUser();
      this.setState({ goalButtonDisabled: true });
    } else {
      this.setState({ goalButtonDisabled: false });
    }
  }

  handleHealthConfirm = () => {
    const { healthEdit, user, getUser } = this.props;
    const {
      weightKg,
      weightLbs,
      heightCm,
      heightFt,
      heightInch
    } = this.state;

    const toSend = {
      id: user.id,
      weightKg,
      weightLbs,
      heightCm,
      heightFt,
      heightInch
    };
    const subsetObjVal = Object.values(toSend);
    if (subsetObjVal.includes(null)
      || subsetObjVal.includes('')
      || subsetObjVal.includes(0)
      || subsetObjVal.includes(NaN)) {
      message.error('Please fill out the form correctly.');
    } else {
      healthEdit(toSend);
      getUser(user.id);
    }
  }

  handleGoalConfirm = async () => {
    const { healthEdit, user, getUser } = this.props;

    const {
      goalKg,
      goalLbs,
      lifestyleMultiplier,
      target,
      endDate,
      poundDiff,
      weeksToComplete
    } = this.state;

    const toSend = {
      id: user.id,
      goalKg,
      goalLbs,
      lifestyleMultiplier,
      target
    };

    const subsetObjVal = Object.values(toSend);
    if (subsetObjVal.includes(null)
      || subsetObjVal.includes('')
      || subsetObjVal.includes(0)
      || subsetObjVal.includes(NaN)) {
      message.error('Please fill out the form correctly.');
    } else {

      let kcalAddSubToGoal;

      // If changed goal
      if (parseFloat(user.goalKg) !== goalKg) {
        // If goal date is still the same, prompt change.
        if (user.endDate === endDate) {
          message.error('Please set the time span');
          return;
        }

        // Validate goal date
        kcalAddSubToGoal = await signupUtil.validateTimeSpan(poundDiff, weeksToComplete);
        if (!kcalAddSubToGoal || kcalAddSubToGoal < 0) {
          message.error('Please increase the time');
          return;
        }

      }
    }
  }

  handleHealthCancel = () => {
    const { toggleHealthEdit } = this.props;
    toggleHealthEdit();
    this.resetFromUser();
  }

  handleGoalCancel = () => {
    const { toggleGoalEdit } = this.props;
    toggleGoalEdit();
    this.resetFromUser();
  }

  render() {
    const {
      user,
      showHealthEdit,
      showGoalEdit,
      isEditing
    } = this.props;
    const {
      heightCm,
      heightFt,
      heightInch,
      weightKg,
      weightLbs,
      lifestyleMultiplier,
      target,
      goalKg,
      goalLbs,
      poundDiff,
      weeksLeft,
      daysLeft,
      healthButtonDisabled,
      goalButtonDisabled
    } = this.state;
    return (
      <div className="profile">
        <div className="profile-body">
          <div className="first-row">
            <div className="profile-card">

              <div className="personal-section">
                <div className="card-title">
                  <div className="icon">
                    <Icon className="icon-left" type="info-circle" theme="filled" />
                    Personal Information
                  </div>
                </div>

                <div className="card-content">
                  <div className="desc-side">
                    <div className="one-desc">
                      <div className="desc-key">
                        Name
                      </div>
                      <div className="desc-value">
                        {`\u00A0\u00A0${user.firstName} ${user.lastName}`}
                      </div>
                    </div>

                    <div className="one-desc">
                      <div className="desc-key">
                        Sex
                      </div>
                      <div className="desc-value">
                        {`\u00A0\u00A0${user.sex}`}
                      </div>
                    </div>

                    <div className="one-desc">
                      <div className="desc-key">
                        Birthday
                      </div>
                      <div className="desc-value">
                        {user.birthday}
                      </div>
                    </div>

                    <div className="one-desc">
                      <div className="desc-key">
                        Age
                      </div>
                      <div className="desc-value">
                        {`\u00A0\u00A0${user.age}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="personal-section">
                <div className="card-title">
                  <div className="icon">
                    <Icon className="icon-left" type="heart" theme="filled" />
                    Health Information
                  </div>
                  <div className="action-button">
                    <Icon
                      className="edit-button"
                      type="edit"
                      theme="filled"
                      onClick={this.handleHealthEdit}
                    />
                  </div>
                </div>


                <div className="card-content">
                  <div className="desc-side">
                    <div className="one-desc">
                      <div className="desc-key">
                        Height
                      </div>
                      <div className="desc-value">
                        {`${user.heightCm}cm |
                          ${(user.heightFt).split('.')[0]}ft 
                          ${(user.heightInch).split('.')[0]}in`
                        }
                      </div>
                    </div>

                    <div className="one-desc">
                      <div className="desc-key">
                        Current weight
                      </div>
                      <div className="desc-value">
                        {`\u00A0${user.weightKg}kg | ${user.weightLbs}lbs`}
                      </div>
                    </div>

                    <div className="one-desc">
                      <div className="desc-key">
                        BMI
                      </div>
                      <div className="desc-value">
                        {`\u00A0${user.bmi} (${user.bmiClass})`}
                      </div>
                    </div>

                    <div className="one-desc">
                      <div className="desc-key">
                        Lifestyle
                      </div>
                      <div className="desc-value">
                        {constants.lifestyle[parseFloat(user.lifestyleMultiplier)]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="personal-section">
                <div className="card-title">
                  <div className="icon">
                    <Icon className="icon-left" type="clock-circle" theme="filled" />
                    Goal
                  </div>
                  <div className="action-button">
                    <Icon
                      className="edit-button"
                      type="edit"
                      theme="filled"
                      onClick={this.handleGoalEdit}
                    />
                  </div>
                </div>


                <div className="card-content">
                  <div className="desc-side">
                    <div className="one-desc">
                      <div className="desc-key">
                        Goal
                      </div>
                      <div className="desc-value">
                        {`${(user.target).toUpperCase()} weight`}
                      </div>
                    </div>
                    {
                      user.target !== 'maintain' && (
                        <React.Fragment>
                          <div className="one-desc">
                            <div className="desc-key">
                              Goal weight
                            </div>
                            <div className="desc-value">
                              {`\u00A0${user.goalKg}kg | ${user.goalLbs}lbs`}
                            </div>
                          </div>

                          <div className="one-desc">
                            <div className="desc-key">
                              Time set
                            </div>
                            <div className="desc-value">
                              {`${user.endDate} (${user.weeksToComplete} week/s)`}
                            </div>
                          </div>

                          <div className="one-desc">
                            <div className="desc-key">
                              Time left
                            </div>
                            <div className="desc-value">
                              {`${weeksLeft} week/s, ${daysLeft} days`}
                            </div>
                          </div>
                        </React.Fragment>
                      )
                    }
                    <div className="one-desc">
                      <div className="desc-key">
                        Kcal per day
                      </div>
                      <div className="desc-value">
                        {`${user.goalTEA}kcal`}
                      </div>
                    </div>
                    <div className="one-desc">
                      <div className="desc-key">
                        Carbohydrate per day
                      </div>
                      <div className="desc-value">
                        {`${user.choPerDay}g`}
                      </div>
                    </div>
                    <div className="one-desc">
                      <div className="desc-key">
                        Protein per day
                      </div>
                      <div className="desc-value">
                        {`${user.proPerDay}g`}
                      </div>
                    </div>
                    <div className="one-desc">
                      <div className="desc-key">
                        Fat per day
                      </div>
                      <div className="desc-value">
                        {`${user.fatPerDay}g`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Modal
              className="edit-modal"
              title="Edit Health Information"
              visible={showHealthEdit}
              onCancel={this.handleHealthEdit}
              footer={(
                <div className="one-row">
                  <div className="button-container">
                    <Button
                      className="back-button"
                      type="primary"
                      onClick={this.handleHealthCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="button-container">
                    <Button
                      className="next-button"
                      type="primary"
                      onClick={this.handleHealthConfirm}
                      loading={isEditing}
                      disabled={healthButtonDisabled}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}

            >
              <div className="label-container">
                <div className="label">
                  Update your weight or height.
                </div>
              </div>
              <Divider />

              <div className="edit-row">
                <div className="edit-container">
                  <div className="edit-title">
                    Weight (kg)
                  </div>
                  <Input
                    className="edit-input"
                    name="weightKg"
                    onChange={this.handleWeightEdit}
                    type="number"
                    value={weightKg}
                    min={30}
                  />
                </div>
                <div className="edit-container">
                  <div className="edit-title">
                    Weight (lbs)
                  </div>
                  <Input
                    className="edit-input"
                    onChange={this.handleWeightEdit}
                    name="weightLbs"
                    type="number"
                    value={weightLbs}
                    min={66}
                  />
                </div>
              </div>

              <div className="edit-row">
                <div className="edit-container">
                  <div className="edit-title">
                    Height (cm)
                  </div>
                  <Input
                    className="edit-input"
                    name="heightCm"
                    onChange={this.handleHeightEdit}
                    type="number"
                    value={heightCm}
                    min={129}
                  />
                </div>
                <div className="edit-container">
                  <div className="edit-title">
                    Height (ft)
                  </div>
                  <Input
                    className="edit-input"
                    onChange={this.handleHeightEdit}
                    name="heightFt"
                    type="number"
                    value={heightFt}
                    min={4}
                  />
                </div>
                <div className="edit-container">
                  <div className="edit-title">
                    Height (in)
                  </div>
                  <Input
                    className="edit-input"
                    onChange={this.handleHeightEdit}
                    name="heightInch"
                    type="number"
                    value={heightInch}
                    min={heightFt === 4 ? 3 : 0}
                  />
                </div>
              </div>
            </Modal>

            <Modal
              className="edit-modal"
              title="Edit Health Information"
              visible={showGoalEdit}
              onCancel={this.handleGoalEdit}
              footer={(
                <div className="one-row">
                  <div className="button-container">
                    <Button
                      className="back-button"
                      type="primary"
                      onClick={this.handleGoalCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="button-container">
                    <Button
                      className="next-button"
                      type="primary"
                      onClick={this.handleGoalConfirm}
                      loading={isEditing}
                      disabled={goalButtonDisabled}
                    >
                      Save
                    </Button>
                  </div>
                </div>
            )}
            >

              <div className="label-container">
                <div className="label">
                  Edit or update your weight.
                  Updating your goal weight means a fresh start.
                </div>
              </div>

              <Divider />

              <div className="edit-row">
                <div className="edit-container">
                  <div className="edit-title">
                    Lifestyle
                  </div>
                  <Select
                    placeholder="Select current lifestyle"
                    value={constants.lifestyle[parseFloat(lifestyleMultiplier)]}
                    onChange={this.handlelifestyleMultiplier}
                  >
                    <Option value={constants.BED_REST}>Bed rest</Option>
                    <Option value={constants.SEDENTARY}>Sedentary</Option>
                    <Option value={constants.LIGHT}>Light</Option>
                    <Option value={constants.MODERATE}>Moderate</Option>
                    <Option value={constants.VERY_ACTIVE}>Very Active</Option>
                  </Select>
                </div>
                <div className="edit-container">
                  <div className="edit-title">
                    Goal
                  </div>
                  <Select disabled value={target}>
                    <Option value={constants.LOSE}>Lose</Option>
                    <Option value={constants.GAIN}>Gain</Option>
                    <Option value={constants.MAINTAIN}>Maintain</Option>
                  </Select>
                </div>
              </div>

              <div className="edit-row">
                <div className="edit-container">
                  <div className="edit-title">
                    Goal weight (kg)
                  </div>
                  <Input
                    className="edit-input"
                    onChange={this.handleWeightEdit}
                    name="goalKg"
                    type="number"
                    value={goalKg}
                  />
                </div>
                <div className="edit-container">
                  <div className="edit-title">
                    Goal weight (lbs)
                  </div>
                  <Input
                    className="edit-input"
                    onChange={this.handleWeightEdit}
                    name="goalLbs"
                    type="number"
                    value={goalLbs}
                  />
                </div>
              </div>

              <Divider />
              {
                parseFloat(user.goalKg) !== goalKg && weightKg !== goalKg ? (
                  <div className="edit-row">
                    <div className="edit-container">
                      <div className="edit-title">
                        {`(Recommended week/s from now: ${poundDiff ? poundDiff.toFixed(0) : null})`}
                      </div>
                      <DatePicker className="form-bar" onChange={this.handleEndDate} />
                    </div>
                  </div>
                ) : null
              }
            </Modal>

            <div className="profile-card">
              <div className="card-title">
                Personal Information
              </div>

              <div className="card-content">
                <div className="pic-side">
                  <img src="profile/male.png" alt="male.png" />
                </div>

                <div className="desc-side">
                  <div className="one-desc">
                    <div className="desc-key">
                      Name:
                    </div>
                    <div className="desc-value">
                      {`\u00A0\u00A0${user.firstName} ${user.lastName}`}
                    </div>
                  </div>

                  <div className="one-desc">
                    <div className="desc-key">
                      Sex:
                    </div>
                    <div className="desc-value">
                      {`\u00A0\u00A0${user.sex}`}
                    </div>
                  </div>

                  <div className="one-desc">
                    <div className="desc-key">
                      Birthday:
                    </div>
                    <div className="desc-value">
                      {user.birthday}
                    </div>
                  </div>

                  <div className="one-desc">
                    <div className="desc-key">
                      Age:
                    </div>
                    <div className="desc-value">
                      {`\u00A0\u00A0${user.age}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
