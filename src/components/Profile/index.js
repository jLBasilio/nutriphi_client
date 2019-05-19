import React, { Component } from 'react';
import {
  Button,
  DatePicker,
  Divider,
  Icon,
  Input,
  message,
  Modal,
  Select,
  Spin
} from 'antd';
import './profile.scss';

import * as constants from '../../constants';
import * as pageTitles from '../../constants/pages';
import * as profileUtil from '../../utils/profile.util';
import * as signupUtil from '../../utils/signup.util';
import * as dateUtil from '../../utils/date.util';

import Graph from '../Graph';

const { Option } = Select;
class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
      choPerDay: null,
      proPerDay: null,
      fatPerDay: null,
      baseTEA: null,
      goalTEA: null,
      showSecond: false,
      dbwKg: null,
      dbwLbs: null
    };
  }

  componentDidMount() {
    const {
      changePage,
      fetchProgress,
      fetchClassDist,
      fetchWeight,
      user
    } = this.props;
    changePage(pageTitles.PROFILE);
    fetchProgress(user.id);
    fetchClassDist(user.id);
    fetchWeight(user.id);
    this.resetFromUser();
  }

  async componentDidUpdate() {
    const {
      user,
      weeksLeft: wleft,
      daysLeft: dleft,
      setTime
    } = this.props;
    if (wleft === null && dleft === null) {
      const timeLeft = await profileUtil.calculateDaysLeft(user.endDate);
      const { weeksLeft, daysLeft } = timeLeft;
      setTime({ weeksLeft, daysLeft });
    }
  }

  resetFromUser = async () => {
    const { user } = this.props;
    try {
      this.setState({
        heightCm: parseFloat(user.heightCm),
        heightFt: parseFloat(user.heightFt),
        heightInch: parseFloat(user.heightInch),
        weightKg: parseFloat(user.weightKg),
        weightLbs: parseFloat(user.weightLbs),
        lifestyleMultiplier: parseFloat(user.lifestyleMultiplier),
        endDate: user.endDate,
        weeksToComplete: user.weeksToComplete,
        target: 'maintain',
        poundDiff: 0,
        dbwKg: null,
        dbwLbs: null,
        goalKg: user.weightKg,
        goalLbs: user.weightLbs,
        choPerDay: null,
        proPerDay: null,
        fatPerDay: null
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  handleHealthEdit = () => {
    const { toggleHealthEdit, isEditing } = this.props;
    if (!isEditing) {
      this.resetFromUser();
      toggleHealthEdit(true);
    }
  }

  handleGoalEdit = async () => {
    const { user, toggleGoalEdit, isEditing } = this.props;
    const { sex, heightCm } = user;
    if (!isEditing) {
      this.resetFromUser();
      const { dbwKg, dbwLbs } = await signupUtil.getDBW({ sex, heightCm });
      this.setState({
        dbwKg,
        dbwLbs,
        lifestyleMultiplier: null,
        showSecond: false
      }, () => {
        toggleGoalEdit(true);
      });
    }
  }

  handleHeightEdit = async (e) => {
    const { heightFt, heightInch } = this.state;
    const height = e.target.value;
    if (e.target.name === 'heightFt') {
      const heightCm = height * 30.48 + heightInch * 2.54;
      this.setState({
        heightFt: parseFloat(height),
        heightCm: parseFloat(heightCm.toFixed(2)),
        showSecond: false
      });
    } else if (e.target.name === 'heightInch') {
      const heightCm = height * 2.54 + heightFt * 30.48;
      this.setState({
        heightInch: parseFloat(height),
        heightCm: parseFloat(heightCm.toFixed(2)),
        showSecond: false,
        target: null,
        weeksToComplete: null
      });
    } else if (e.target.name === 'heightCm') {
      let inchez = (height / 2.54).toFixed(0);
      const feetz = Math.floor(inchez / 12);
      inchez %= 12;
      this.setState({
        heightCm: parseFloat(height),
        heightFt: feetz,
        heightInch: inchez,
        showSecond: false
      });
    }
  }

  validateNext = () => {
    const {
      weightKg,
      weightLbs,
      heightCm,
      heightFt
    } = this.state;

    const subsetObj = {
      weightKg,
      weightLbs,
      heightCm,
      heightFt
    };

    const subsetObjVal = Object.values(subsetObj);
    if (
      subsetObjVal.includes(null)
      || subsetObjVal.includes('')
      || subsetObjVal.includes(0)) {
      message.error('Please fill out all the fields.', 4);
      return false;
    }
    if (weightKg < 30) {
      message.error('Please adjust the weight.', 4);
      return false;
    }
    if (heightCm < 129 || heightCm > 182) {
      message.error('Please adjust the height.', 4);
      return false;
    }

    return true;
  }

  handleNext = async () => {
    if (await this.validateNext()) {
      const { user: { sex } } = this.props;
      const {
        heightCm,
        weightKg,
        goalKg,
        weightLbs,
        goalLbs
      } = this.state;

      const { dbwKg, dbwLbs } = await signupUtil.getDBW({ sex, heightCm });
      this.setState({
        dbwKg,
        dbwLbs,
        showSecond: true,
        target: weightKg > goalKg ? 'lose' : weightKg < goalKg ? 'gain' : 'maintain',
        weeksToComplete: Math.abs(Math.ceil(weightLbs - goalLbs)),
        endDate: null
      });
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
        poundDiff: holder < 1 ? 1 : holder,
        showSecond: false
      });
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
        poundDiff: holder < 1 ? 1 : holder,
        showSecond: false
      });
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
        poundDiff: holder < 1 ? 1 : holder,
        endDate: null
      });
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
        poundDiff: holder < 1 ? 1 : holder,
        endDate: null
      });
    }
  }

  handlelifestyleMultiplier = (lifestyleMultiplier) => {
    this.setState({
      lifestyleMultiplier
    });
  }

  handleEndDate = async (date, dateString) => {
    this.setState({
      endDate: dateString,
      weeksToComplete: await signupUtil.getDiffWeeks(dateString)
    });
  }

  validateHealth = () => {
    const {
      weightKg,
      weightLbs,
      heightCm,
      heightFt,
      heightInch
    } = this.state;

    const toSend = {
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
      return false;
    }

    return true;
  }

  handleHealthConfirm = async () => {
    const { healthEdit, user } = this.props;
    if (this.validateHealth()) {
      const {
        weightKg,
        weightLbs,
        heightCm,
        heightFt,
        heightInch
      } = this.state;

      let dateOfChange = await dateUtil.generatePresent();
      [dateOfChange, ,] = dateOfChange.split('T');

      const toSend = {
        id: user.id,
        weightKg,
        weightLbs,
        heightCm,
        heightFt,
        heightInch,
        dateOfChange
      };
      healthEdit(toSend);
    }
  }

  validateGoal = async () => {
    const {
      goalKg,
      goalLbs,
      lifestyleMultiplier,
      target,
      poundDiff,
      weeksToComplete,
      endDate
    } = this.state;

    const subsetObj = {
      goalKg,
      goalLbs,
      lifestyleMultiplier,
      target
    };

    const subsetObjVal = Object.values(subsetObj);
    if (subsetObjVal.includes(null)
      || subsetObjVal.includes('')
      || subsetObjVal.includes(0)
      || subsetObjVal.includes(NaN)) {
      message.error('Please fill out the form correctlyzz.');
      return false;
    }

    const kcalAddSubToGoal = await signupUtil.validateTimeSpan(poundDiff, weeksToComplete);
    if ((!kcalAddSubToGoal || endDate === null || weeksToComplete <= 0) && target !== 'maintain') {
      message.error('Please increase the time span', 4);
      return false;
    }
    // console.table({ baseTEA, goalTEA, endDate, poundDiff, weeksToComplete });
    return true;
  }

  handleGoalSave = async () => {
    if (await this.validateGoal()) {
      const { toggleGoalConfirm } = this.props;
      const {
        poundDiff,
        weeksToComplete,
        weightKg,
        lifestyleMultiplier,
        target
      } = this.state;

      const kcalAddSubToGoal = await signupUtil.validateTimeSpan(poundDiff, weeksToComplete);
      const baseTEA = await signupUtil.getTEA(weightKg, lifestyleMultiplier);
      const goalTEA = target === 'lose'
        ? (baseTEA - kcalAddSubToGoal)
        : target === 'gain'
          ? (baseTEA + kcalAddSubToGoal)
          : baseTEA;
      const { choPerDay, proPerDay, fatPerDay } = await signupUtil.getNutriDist(goalTEA);

      this.setState({
        choPerDay,
        proPerDay,
        fatPerDay,
        goalTEA,
        baseTEA
      }, () => {
        toggleGoalConfirm(true);
      });
    }
  }

  handleGoalConfirm = async () => {
    const { user: { id }, healthEdit } = this.props;
    const {
      weightKg,
      weightLbs,
      heightCm,
      heightFt,
      heightInch,
      dbwKg,
      lifestyleMultiplier,
      target,
      goalKg,
      goalLbs,
      poundDiff,
      weeksToComplete,
      baseTEA,
      goalTEA,
      choPerDay,
      proPerDay,
      fatPerDay,
      endDate
    } = this.state;

    let dateOfChange = await dateUtil.generatePresent();
    [dateOfChange, ,] = dateOfChange.split('T');

    const toSend = {
      id,
      weightKg: parseFloat(weightKg),
      weightLbs: parseFloat(weightLbs),
      heightCm: parseFloat(heightCm),
      heightFt: parseFloat(heightFt),
      heightInch: parseFloat(heightInch),
      dbwKg,
      lifestyleMultiplier: parseFloat(lifestyleMultiplier),
      target,
      goalKg: parseFloat(goalKg),
      goalLbs: parseFloat(goalLbs),
      baseTEA,
      goalTEA,
      poundDiff,
      weeksToComplete,
      choPerDay,
      proPerDay,
      fatPerDay,
      endDate,
      dateOfChange
    };

    healthEdit(toSend);
  }

  handleHealthCancel = () => {
    const { isEditing, toggleHealthEdit } = this.props;
    if (!isEditing) {
      toggleHealthEdit(false);
      this.resetFromUser();
    }
  }

  handleGoalCancel = async () => {
    const { toggleGoalEdit, isEditing } = this.props;
    if (!isEditing) {
      await toggleGoalEdit(false);
      this.resetFromUser();
      this.setState({ showSecond: false });
    }
  }

  handleGoalConfirmCancel = () => {
    const { isEditing, toggleGoalConfirm } = this.props;
    if (!isEditing) {
      toggleGoalConfirm(false);
    }
  }

  render() {
    const {
      user,
      showHealthEdit,
      showGoalEdit,
      isEditing,
      dayProgress,
      dateToday,
      classDist,
      healthButtonDisabled,
      isFetchingUser,
      showGoalConfirm,
      weightHist,
      weeksLeft,
      daysLeft,
      projectedKg,
      projectedLbs
    } = this.props;

    const {
      heightCm,
      heightFt,
      heightInch,
      weightKg,
      weightLbs,
      target,
      goalKg,
      goalLbs,
      poundDiff,
      showSecond,
      dbwKg,
      dbwLbs,
      goalTEA,
      choPerDay,
      proPerDay,
      fatPerDay
    } = this.state;

    const dayProg = {
      labels: [],
      datasets: [
        { values: [] }
      ]
    };

    const classProg = {
      labels: [],
      datasets: [
        { values: [] }
      ]
    };

    const weightProg = {
      labels: [],
      datasets: [
        { values: [] }
      ]
    };

    if (dayProgress) {
      dayProgress.forEach((progress) => {
        const date = progress.date.split('-');
        dayProg.labels.push(`${date[1]}-${date[2]}`);
        dayProg.datasets[0].values.push(progress.totalKcal);
      });
    }

    const tagColors = [];
    if (classDist) {
      const classKeys = classDist && Object.keys(classDist);
      classKeys.forEach((key) => {
        const colKey = key === 'bev' ? 'beverage' : key;
        classProg.labels.push(`${key} %`);
        classProg.datasets[0].values.push(classDist[key]);
        tagColors.push(constants.tagColorsHex[colKey]);
      });
    }

    if (weightHist) {
      weightHist.forEach((hist) => {
        const [, month, day] = hist.dateOfChange.split('-');
        weightProg.labels.push(`${month}-${day}`);
        weightProg.datasets[0].values.push(hist.weightKg);
      });
    }

    return (
      <div className="profile">
        <div className="profile-body">

          {
            (user.target === 'gain' && (user.weightLbs >= user.goalLbs))
            || (user.target === 'lose' && (user.weightLbs <= user.goalLbs)) ? (
              <div className="first-row">
                <div className="profile-card success-card">
                  <div className="card-title">
                    Congratulations on reaching your goal! Please set a new one.
                  </div>
                </div>
              </div>
              ) : user.target !== 'maintain' && weeksLeft <= 0 && daysLeft <= 0 && (
              <div className="first-row">
                <div className="profile-card dead-card">
                  <div className="card-title">
                    You have reached your set time. Please set a new goal.
                  </div>
                </div>
              </div>
              )
          }

          <Modal
            className="confirm-signup"
            title="Confirm Signup"
            visible={showGoalConfirm}
            onCancel={this.handleGoalConfirmCancel}
            footer={(
              <div className="one-row">
                <div className="button-container">
                  <Button
                    className="back-button"
                    type="primary"
                    onClick={this.handleGoalConfirmCancel}
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
                  >
                    OK
                  </Button>
                </div>
              </div>
            )}
          >
            <div className="label-container">
              <div className="label">
                {`${user.firstName} ${user.lastName} - ${user.sex} `}
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
                {`${user.weightKg} kg | ${user.weightLbs} lbs`}
              </div>
            </div>

            <Divider />

            <div className="info-row">
              <div className="macros">
                Goal Weight
              </div>
              <div className="macros-value">
                {`${goalKg} kg | ${goalLbs} lbs`}
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
          <div className="first-row">

            <div className="profile-card">
              <div className="personal-section">
                <div className="card-title">
                  <div className="icon">
                    <Icon className="icon-left" type="line-chart" />
                    Progress Status
                  </div>
                </div>
              </div>
              <div className="graph">
                {
                  dayProg.labels.length && dayProg.datasets.length && (
                    <Graph
                      title="Calorie intake in two weeks"
                      type="bar"
                      stacked
                      data={{
                        labels: [...dayProg.labels],
                        datasets: [...dayProg.datasets],
                        yMarkers: [{
                          label: 'Your daily calorie requirement',
                          value: user.goalTEA,
                          options: { labelPos: 'left' }
                        }]
                      }}
                      colors={['#2ecc71']}
                      barOptions={{
                        spaceRatio: 0.1
                      }}
                      tooltipOptions={{
                        formatTooltipX: a => `${dateToday.split('-')[0]}-${a}`,
                        formatTooltipY: a => `${a} kcal`
                      }}
                    />
                  )
                }
              </div>
              <div className="graph">
                {
                  weightProg.labels.length
                    && weightProg.datasets.length && (
                    <Graph
                      title="Weight changes"
                      type="line"
                      height={150}
                      colors={['#2ecc71']}
                      data={{
                        labels: [...weightProg.labels],
                        datasets: [...weightProg.datasets],
                        yMarkers: [{
                          label: 'Your goal weight',
                          value: user.goalKg,
                          options: { labelPos: 'left' }
                        }]
                      }}
                      tooltipOptions={{
                        formatTooltipX: a => `${dateToday.split('-')[0]}-${a}`,
                        formatTooltipY: a => `${a}kg`
                      }}
                    />
                  )
                }
                <div className="projected">
                  {`Your projected weight in
                    5 weeks is ${projectedKg}kg
                    or ${projectedLbs}lbs based on your
                    calorie consumption today.`
                  }
                </div>
              </div>
              <div className="graph percentage">
                {
                  classProg.labels.length && classProg.datasets.length && (
                    <Graph
                      title="Food class percentage"
                      type="pie"
                      height={300}
                      width={300}
                      data={{
                        labels: [...classProg.labels],
                        datasets: [...classProg.datasets]
                      }}
                      colors={[...tagColors]}
                    />
                  )
                }
              </div>
            </div>
            <div className={user.target === 'maintain'
              ? 'profile-card short'
              : 'profile-card long'}
            >
              <div className="personal-section">
                <div className="card-title">
                  <div className="icon">
                    <Icon className="icon-left" type="info-circle" theme="filled" />
                    Personal
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
                    {/*
                    <div className="one-desc">
                      <div className="desc-key">
                        Age
                      </div>
                      <div className="desc-value">
                        {`\u00A0\u00A0${user.age}`}
                      </div>
                    </div>
                    */}
                  </div>
                </div>
              </div>

              <div className="personal-section">
                <div className="card-title">
                  <div className="icon">
                    <Icon className="icon-left" type="heart" theme="filled" />
                    Health
                  </div>
                  <div className="action-button">
                    {
                      isFetchingUser ? (
                        <Icon type="loading" />
                      ) : (
                        <Button
                          type="edit-button"
                          className="create-meal-button"
                          onClick={this.handleHealthEdit}
                        >
                          Update Weight
                        </Button>
                      )
                    }
                  </div>
                </div>

                <div className="card-content">
                  {
                    isFetchingUser ? (
                      <div className="log-loader">
                        <Spin />
                      </div>
                    ) : (
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
                    )
                  }
                </div>
              </div>

              <div className="personal-section">
                <div className="card-title">
                  <div className="icon">
                    <Icon className="icon-left" type="clock-circle" theme="filled" />
                    Goal
                  </div>
                  <div className="action-button">
                    {
                      isFetchingUser ? (
                        <Icon type="loading" />
                      ) : (
                        <Button
                          type="edit-button"
                          className="create-meal-button"
                          onClick={this.handleGoalEdit}
                        >
                          New Goal
                        </Button>
                      )
                    }
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
                              Goal duration
                            </div>
                            <div className="desc-value">
                              {`${user.weeksToComplete} week/s (${user.endDate})`}
                            </div>
                          </div>

                          <div className="one-desc">
                            <div className="desc-key">
                              Time left
                            </div>
                            <div className="desc-value">
                              {`${weeksLeft >= 0
                                ? weeksLeft : 0} week/s, ${daysLeft >= 0
                                ? daysLeft : 0} days`
                              }
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
              onCancel={this.handleHealthCancel}
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
                      disabled={(weightKg === parseFloat(user.weightKg)
                        && heightCm === parseFloat(user.heightCm))
                        || healthButtonDisabled
                      }
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}
            >
              <div className="subtitle-container">
                <div className="subtitle">
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
                    max={182}
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
                    type="tel"
                    value={heightFt}
                    min={4}
                    max={5}
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
                    max={11}
                  />
                </div>
              </div>
            </Modal>

            <Modal
              className="edit-modal"
              title="Edit Health Information"
              visible={showGoalEdit}
              onCancel={this.handleGoalCancel}
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
                  {
                    showSecond && (
                      <div className="button-container">
                        <Button
                          className="next-button"
                          type="primary"
                          onClick={this.handleGoalSave}
                        >
                          Save
                        </Button>
                      </div>
                    )
                  }
                </div>
              )}
            >
              <div className="subtitle-container">
                <div className="subtitle">
                  Set a new Goal
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
                    max={182}
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
                    max={5}
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
                    max={11}
                  />
                </div>
              </div>
              <div className="edit-row">
                <div className="button-container">
                  <Button
                    className="next-button"
                    type="primary"
                    onClick={this.handleNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
              {
                showSecond && (
                  <React.Fragment>
                    <div className="edit-row">
                      <div className="edit-container">
                        <div className="edit-title">
                          Recommended Weight:
                        </div>
                        <div className="edit-title">
                          {`${dbwKg} kg OR ${dbwLbs} lbs`}
                        </div>
                      </div>
                    </div>
                    <div className="edit-row">
                      <div className="edit-container">
                        <div className="edit-title">
                          Lifestyle
                        </div>
                        <Select
                          placeholder="Select current lifestyle"
                          onChange={this.handlelifestyleMultiplier}
                        >
                          <Option
                            title="Bed rest but mobile (hospital patients)"
                            value={constants.BED_REST}
                          >
                            Bed rest
                          </Option>
                          <Option
                            value={constants.SEDENTARY}
                            title="Mostly sitting"
                          >
                            Sedentary
                          </Option>
                          <Option
                            value={constants.LIGHT}
                            title="Light work (tailor, nurse, physician, jeepney driver)"
                          >
                            Light
                          </Option>
                          <Option
                            value={constants.MODERATE}
                            title="Moderate work (carpenter, painter, heavy housework)"
                          >
                            Moderate
                          </Option>
                          <Option
                            value={constants.VERY_ACTIVE}
                            title="Heavy work (swimming, lumberman)"
                          >
                            Very Active
                          </Option>
                        </Select>
                      </div>
                      <div className="edit-container">
                        <div className="edit-title">
                          Goal
                        </div>
                        <Select disabled value={target || 'Set goal'}>
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
                      target !== 'maintain' ? (
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
                  </React.Fragment>
                )
              }
            </Modal>


          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
