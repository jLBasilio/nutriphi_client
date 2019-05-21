import React, { Component } from 'react';
import { Collapse } from 'antd';
import './about.scss';

import * as pageTitles from '../../constants/pages';

const { Panel } = Collapse;
class About extends Component {
  componentDidMount() {
    const { title, changePage } = this.props;
    changePage(title);
  }

  componentDidUpdate(previousProps) {
    const { title } = this.props;
    if (title !== previousProps.title) {
      const { changePage } = this.props;
      changePage(title);
    }
  }

  render() {
    const { title } = this.props;
    return (
      <div className="about">
        <div className="about-body">
          {
            title === pageTitles.ABOUT ? (
              <div className="one-section">
                <div className="section-title">
                  About
                </div>
                <div className="section-content">
                  All materials and information are
                  derived from the Food and Nutrition (FNRI) Food Exchange List.
                  This includes:
                  <ul>
                    <li className="bullet-title">Lifestyle categories</li>
                    <ul>
                      <li>
                        <span className="bullet-title">
                          Bed rest
                        </span>
                        &nbsp;- those who are often
                        lying in bed, but are able to move.
                        (hospital patients)
                      </li>
                      <li>
                        <span className="bullet-title">
                          Sedentary
                        </span>
                        &nbsp;- those who do very minimal
                        work when sitting. (auditors, programmers)
                      </li>
                      <li>
                        <span className="bullet-title">
                          Light
                        </span>
                        &nbsp;- those who are often sitting, but do a moderate
                        amount of work. (tailors, nurses, physicians, jeepney drivers)
                      </li>
                      <li>
                        <span className="bullet-title">
                          Moderate
                        </span>
                        &nbsp;- those who move around and
                          do a lot of work. (carpenters, painters, heavy housework)
                      </li>
                      <li>
                        <span className="bullet-title">
                          Very Active
                        </span>
                        &nbsp;- those who engage the whole
                          body to work. (swimmers, lumberjacks)
                      </li>
                    </ul>
                    <li className="bullet-title">Recommended weight</li>
                      The recommended weight suggestions upon
                      signing up is based on the Appendix G
                      (WEIGHT-FOR-HEIGHT FOR FILIPINOS)
                      of the book.
                    <li className="bullet-title">Goal weight and duration</li>
                    If your target is to lose or gain weight, the weight to lose/gain should
                    not exceed 2 pounds (lbs) per week. This is to ensure the healthiness
                    of the goal.
                    <li className="bullet-title">Food displayed</li>
                    <ul>
                      <li>Name (English and Filipino)</li>
                      <li>Calorie contents</li>
                      <li>Macronutrient distribution</li>
                      <li>Portion Sizes</li>
                      <li>Portion Measurements</li>
                    </ul>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="one-section">
                <Collapse accordion bordered={false}>
                  <Panel header="On Signing Up" key="1">
                    <div className="section-content">
                      <ul>
                        <li className="bullet-title">Weight</li>
                          Your present weight upon signing up.
                          Can be on kilograms (kg) or pounds (lbs).
                        <li className="bullet-title">Height</li>
                          Your present height upon signing up.
                          Can be on kilograms (kg) or pounds (lbs).
                          This will help the app determine your optimal weight range.
                        <li className="bullet-title">Lifestyle</li>
                          Your current lifestyle. This will help determine the calories
                          you need to consume everyday to reach your goal.
                        <li className="bullet-title">Goal weight</li>
                          Your goal weight upon using the app. Can be the same to your
                          current weight. There will also be a warning if the goal weight
                          will set your BMI outside of normal. Can also be changed upon signing
                          up.
                        <li className="bullet-title">Goal duration</li>
                          The timespan of the goal. This only applies if your target is
                          to lose or gain. A maximum of 2lbs per week to lose/gain is allowed
                          to ensure the healthiness of the goal.
                      </ul>
                    </div>
                  </Panel>
                  <Panel header="Home" key="2">
                    <div className="section-content">
                      <ul>
                        <li className="bullet-title">Dashboard</li>
                          Shows the overall progress throughout the day.
                        <li className="bullet-title">Add food</li>
                          To add consumed food, select if it is on breakfast, lunch,
                          or dinner. Then you can search for food, meals, or your
                          favorite foods (marked by an orange heart icon). Upon
                          selecting, the dashboard will update.
                        <li className="bullet-title">Logs</li>
                          Shows the food you have added, separated by breakfast,
                          lunch, and dinner.
                        <li className="bullet-title">Save meal</li>
                          You can save your food log into a meal, so it can be quickly
                          selected later on.
                        <li className="bullet-title">Create meal</li>
                          You can also create a meal from scratch.
                      </ul>
                    </div>
                  </Panel>
                  <Panel header="Profile" key="3">
                    <div className="section-content">
                      <ul>
                        <li className="bullet-title">Progress Status</li>
                          In this section, there are three graphs:
                        <ul>
                          <li className="bullet-title">
                            Two-week calorie intake
                          </li>
                          Shows the amount of calories you have taken from the
                          past two weeks.
                          <li className="bullet-title">
                            Weight changes
                          </li>
                          Shows the graph on your weight changes. It also indicates what
                          your weight will be in 5 weeks, based on your calorie consumption
                          on the current day.
                          <li className="bullet-title">
                            Food distribution
                          </li>
                          Shows the percentage distribution of the different
                          kinds of food you have consumed.
                        </ul>
                        <li className="bullet-title">Peronal Information</li>
                          In this section, you can edit your weight and height to
                          update your progress.
                          You can also reset your goal to reset it immediately.
                      </ul>
                    </div>
                  </Panel>
                  <Panel header="Food List" key="4">
                    <div className="section-content">
                      <ul>
                        <li className="bullet-title">View Food</li>
                        Shows the foods categorically. You can toggle the favorite button upon
                        clicking a food card, which will show up in your favorite list.
                        <li className="bullet-title">View Meals</li>
                        Shows the meals you have created.
                        <li className="bullet-title">View Favorites</li>
                        Shows your favorite foods, indicated by an orange heart icon.
                      </ul>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default About;
