import React, { Component } from 'react';
import './about.scss';

import * as pageTitles from '../../constants/pages';
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
                <div className="section-title">
                  Help
                </div>
                <div className="section-content">
                  <ul>
                    <li className="bullet-title">Sign up</li>
                      asdasd
                  </ul>
                </div>
              </div>
            )
          }


        </div>
      </div>
    );
  }
}

export default About;
