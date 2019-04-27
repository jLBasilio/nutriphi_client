import React, { Component } from 'react';
import {
  Button,
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
      lifestyleMultiplier: null
    };
  }

  async componentDidMount() {
    const { changePage, user } = this.props;
    changePage(pageTitles.PROFILE);
    try {
      const bmiClass = await profileUtil.getBMIClass(user.bmi);
      this.setState({
        bmiClass,
        heightCm: parseFloat(user.heightCm),
        heightFt: parseFloat(user.heightFt),
        heightInch: parseFloat(user.heightInch),
        target: user.target,
        weightKg: user.weightKg,
        weightLbs: user.weightLbs,
        lifestyleMultiplier: user.lifestyleMultiplier
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  handleHealthEdit = () => {
    console.log("Health edit!");
    const { toggleHealthEdit } = this.props;
    toggleHealthEdit();
  }

  handleHeightEdit = (e) => {
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

  handleWeightEdit = async (e) => {
    const weight = e.target.value;
    const { weightKg, weightLbs, heightCm } = this.state;

    if (e.target.name === 'weightKg') {
      const bmi = await signupUtil.getBMIFromGoal({ goalKg: weight, heightCm });
      if (bmi !== 'normal' && weight.toString().length >= 2) {
        message.warning(`Your BMI will be ${bmi}.`, 4);
      }
      this.setState({ weightKg: weight, weightLbs: parseFloat((weight * 2.2).toFixed(2)) });
    } else if (e.target.name === 'weightLbs') {
      const weightKg = parseFloat((weight / 2.2).toFixed(2));
      const bmi = await signupUtil.getBMIFromGoal({ goalKg: weightKg, heightCm });
      if (bmi !== 'normal' && weight.toString().length >= 2) {
        message.warning(`Your BMI will be ${bmi}.`, 4);
      }

      this.setState({ weightKg, weightLbs: weight });
    } else if (e.target.name === 'goalKg') {
      const bmi = await signupUtil.getBMIFromGoal({ goalKg: weight, heightCm });
      const goalLbs = parseFloat((weight * 2.2).toFixed(2));
      if (bmi !== 'normal' && weight.toString().length >= 2) {
        message.warning(`Your BMI will be ${bmi}.`, 4);
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
        poundDiff: Math.abs(parseFloat((weightLbs - weight).toFixed(2))),
      });
    }
  }

  handleHealthConfirm = () => {
    
  }

  handlelifestyleMultiplier = (lifestyleMultiplier) => {
    this.setState({ lifestyleMultiplier });
  }

  handleGoalEdit = () => {
    console.log("Goal edit!");
  }

  handleCancel = () => {
    const { toggleHealthEdit } = this.props;
    toggleHealthEdit();
  }

  render() {
    const {
      user,
      showHealthEdit,
      showGoalEdit,
      isSaving
    } = this.props;
    const {
      bmiClass,
      heightCm,
      heightFt,
      heightInch,
      weightKg,
      weightLbs,
      lifestyleMultiplier
    } = this.state;
    return (
      <div className="profile">
        <div className="profile-body">
          <div className="first-row">
            <div className="profile-card">

              <div className="personal-section">
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

              <div className="personal-section">
                <div className="card-title">
                  <div className="card-text">
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
                  <div className="pic-side">
                    <Icon className="icon-left" type="heart" theme="filled" />
                  </div>

                  <div className="desc-side">
                    <div className="one-desc">
                      <div className="desc-key">
                        Height:
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
                        Current weight:
                      </div>
                      <div className="desc-value">
                        {`\u00A0${user.weightKg}kg | ${user.weightLbs}lbs`}
                      </div>
                    </div>

                    <div className="one-desc">
                      <div className="desc-key">
                        BMI:
                      </div>
                      <div className="desc-value">
                        {`\u00A0${user.bmi} (${bmiClass})`}
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
                  <div className="card-text">
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
                  <div className="pic-side">
                    <Icon className="icon-left" type="clock-circle" theme="filled" />
                  </div>

                  <div className="desc-side">
                    <div className="one-desc">
                      <div className="desc-key">
                        Goal:
                      </div>
                      <div className="desc-value">
                        {`${(user.target).toUpperCase()} weight`}
                      </div>
                    </div>

                    <div className="one-desc">
                      <div className="desc-key">
                        Goal weight:
                      </div>
                      <div className="desc-value">
                        {`\u00A0${user.goalKg}kg | ${user.goalLbs}lbs`}
                      </div>
                    </div>

                    <div className="one-desc">
                      <div className="desc-key">
                        Goal timespan:
                      </div>
                      <div className="desc-value">
                        {`${user.weeksToComplete} weeks`}
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
                      onClick={this.handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="button-container">
                    <Button
                      className="next-button"
                      type="primary"
                      onClick={this.handleHealthConfirm}
                      loading={isSaving}
                    >
                      Save
                    </Button>
                  </div>
                </div>
            )}
            >

              <div className="label-container">
                <div className="label">
                  Edit or update your weight
                </div>
              </div>

              <Divider />

              <div className="edit-row">
                Height
              </div>
              <div className="edit-row">
                <div className="edit-label">
                  cm
                  <div className="edit-container">
                    <Input
                      className="edit-input"
                      name="heightCm"
                      onChange={this.handleHeightEdit}
                      type="number"
                      value={heightCm}
                    />
                  </div>
                </div>
                <div className="edit-label">
                  ft
                  <div className="edit-container">
                    <Input
                      className="edit-input"
                      onChange={this.handleHeightEdit}
                      name="heightFt"
                      type="number"
                      value={heightFt}
                    />
                  </div>
                </div>
                <div className="edit-label">
                  in
                  <div className="edit-container">
                    <Input
                      className="edit-input"
                      onChange={this.handleHeightEdit}
                      name="heightInch"
                      type="number"
                      value={heightInch}
                    />
                  </div>
                </div>
              </div>

              <Divider />

              <div className="edit-row">
                Weight
              </div>
              <div className="edit-row">
                <div className="edit-label">
                  kg
                  <div className="edit-container">
                    <Input
                      className="edit-input"
                      name="weightKg"
                      onChange={this.handleWeightEdit}
                      type="number"
                      value={weightKg}
                    />
                  </div>
                </div>
                <div className="edit-label">
                  lbs
                  <div className="edit-container">
                    <Input
                      className="edit-input"
                      onChange={this.handleWeightEdit}
                      name="weightLbs"
                      type="number"
                      value={weightLbs}
                    />
                  </div>
                </div>
              </div>

              <Divider />

              <div className="edit-row">
                Lifestyle
              </div>
              <div className="edit-row">
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
