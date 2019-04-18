import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Icon,
  Popover,
  Progress,
  Spin,
  Tag
} from 'antd';
import './home.scss';

import * as constants from '../../constants';
import * as pageTitles from '../../constants/pages';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPopups: false,
      skip: 0,
      take: 10
    };
  }

  componentDidMount() {
    const {
      changePage,
      setTodayDate,
      changeDate,
      user,
      fetchLogs
    } = this.props;
    const { skip, take } = this.state;
    const date = new Date(Date.now());
    const dateFormatted = `${date.getFullYear()}-${(date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1)}-${(date.getDate() < 10 ? '0' : '') + date.getDate()}`;

    changePage(pageTitles.HOME);
    setTodayDate(dateFormatted);
    changeDate(dateFormatted);

    fetchLogs({
      userId: user.id,
      date: dateFormatted,
      skip,
      take
    });
  }

  handleAddClick = () => {
    const { showPopups } = this.state;
    this.setState({
      showPopups: !showPopups
    });
  }

  handleAddEntry = (period) => {
    const { setPeriod } = this.props;
    setPeriod(period);
  }

  render() {
    const { showPopups } = this.state;
    const {
      dateToday,
      dateSelected,
      isFetchingLogs,
      userLogs,
      user
    } = this.props;
    let dateSelectedSplit = [];
    const totalCho = userLogs.reduce((accCho, log) => accCho + log.consumed_choGrams, 0);
    const totalPro = userLogs.reduce((accPro, log) => accPro + log.consumed_proGrams, 0);
    const totalFat = userLogs.reduce((accFat, log) => accFat + log.consumed_fatGrams, 0);
    const percentCho = parseFloat(((totalCho / user.choPerDay) * 100).toFixed(2));
    const percentPro = parseFloat(((totalPro / user.proPerDay) * 100).toFixed(2));
    const percentFat = parseFloat(((totalFat / user.fatPerDay) * 100).toFixed(2));
    const totalKcal = (totalCho + totalPro) * constants.KCAL_PER_PRO_MUL
      + totalFat * constants.KCAL_PER_FAT_MUL;
    const userKcal = (user.choPerDay + user.proPerDay) * constants.KCAL_PER_PRO_MUL
      + user.fatPerDay * constants.KCAL_PER_FAT_MUL;

    if (dateSelected) {
      dateSelectedSplit = dateSelected.split('-');
    } else if (dateToday) {
      dateSelectedSplit = dateToday.split('-');
    }


    return (
      <div className="home">
        <div className="home-body">
          <div className="date">
            {
              dateSelectedSplit.length && (
                `${constants.months[dateSelectedSplit[1]]} ${dateSelectedSplit[2]}, ${dateSelectedSplit[0]}`
              )
            }
          </div>
          <div className="today-progress">
            <div className="today-title">
              {`Day's Progress - ${totalKcal}/${userKcal}kcal`}
            </div>
            <div className={`macro-progress ${percentCho > 100 ? 'percentage' : null}`}>
              {`CARBOHYDRATE (CHO) - 
                ${totalCho}/${user.choPerDay} g
              `}
              <Progress
                type="line"
                strokeColor={{
                  from: '#0FD64F',
                  to: '#F8EF42'
                }}
                percent={percentCho}
                showInfo={false}
                status="active"
              />

              <div className={`${percentCho > 100 ? 'percentage' : null}`}>
                {`${percentCho}%`}
              </div>
            </div>
            <div className={`macro-progress ${percentPro > 100 ? 'percentage' : null}`}>
              {`PROTEIN (PRO) - 
                ${totalPro}/${user.proPerDay} g
              `}
              <Progress
                type="line"
                strokeColor={{
                  from: '#F8EF42',
                  to: '#FF748B'
                }}
                percent={percentPro}
                showInfo={false}
                status="active"
              />
              <div className={`${percentPro > 100 ? 'percentage' : null}`}>
                {`${percentPro}%`}
              </div>
            </div>
            <div className={`macro-progress ${percentFat > 100 ? 'percentage' : null}`}>
              {`FAT (FAT) - 
                ${totalFat}/${user.fatPerDay} g
              `}
              <Progress
                type="line"
                strokeColor={{
                  from: '#FF748B',
                  to: '#F53803'
                }}
                percent={percentFat}
                showInfo={false}
                status="active"
              />
              <div className={`${percentFat > 100 ? 'percentage' : null}`}>
                {`${percentFat}%`}
              </div>
            </div>
          </div>

          <div className="space" />

          <div className="today-progress ">
            <div className="today-title">
              {
                `Breakfast - 
                ${userLogs.filter(log => log.consumed_period === 'breakfast')
                  .reduce((kcalTotal, log) => totalKcal + log.consumed_totalKcalConsumed, 0)
                }kcal`
              }
            </div>
            {

              isFetchingLogs ? (
                <div className="log-loader">
                  <Spin />
                </div>
              ) : (
                userLogs
                  .filter(log => log.consumed_period === 'breakfast')
                  .map(log => (
                    <div className="log" key={log.consumed_id}>
                      <div className="log-left">
                        {`${log.foodInfo.filipinoName || log.foodInfo.englishName} `}
                        <Tag
                          className="log-tag"
                          color={
                            constants.tagColors[log.foodInfo.primaryClassification.split('-')[0]]
                          }
                        >
                          {log.foodInfo.primaryClassification.split('-')[0]}
                        </Tag>
                        {
                          log.foodInfo.secondaryClassification && (
                            <Tag
                              className="log-tag"
                              color={
                                constants.tagColors[log.foodInfo.secondaryClassification]
                              }
                            >
                              {log.foodInfo.secondaryClassification}
                            </Tag>
                          )
                        }
                        <div className="kcal">
                          {`${log.consumed_mlConsumed
                            ? log.consumed_mlConsumed
                            : log.consumed_gramsConsumed}${log.consumed_mlConsumed
                            ? 'ml'
                            : 'g'} 
                          - ${log.consumed_totalKcalConsumed}kcal`}
                        </div>
                      </div>

                      <div className="log-right">
                        <div className="icon-container">
                          <Icon
                            className="action-icon"
                            onClick={() => console.log("HI")}
                            theme="filled"
                            type="edit"
                          />
                        </div>
                        <div className="icon-container">
                          <Icon
                            className="action-icon"
                            onClick={() => console.log("HI")}
                            theme="filled"
                            type="delete"
                          />
                        </div>
                      </div>
                    </div>
                  ))
              )
            }
          </div>

          <div className="space" />

          <div className="today-progress ">
            <div className="today-title">
              {
                `Lunch - 
                ${userLogs.filter(log => log.consumed_period === 'lunch')
                  .reduce((kcalTotal, log) => totalKcal + log.consumed_totalKcalConsumed, 0)
                }kcal`
              }
            </div>
            {
              isFetchingLogs ? (
                <div className="log-loader">
                  <Spin />
                </div>
              ) : (
                userLogs
                  .filter(log => log.consumed_period === 'lunch')
                  .map(log => (
                    <div className="log" key={log.consumed_id}>
                      <div className="log-left">
                        {`${log.foodInfo.filipinoName || log.foodInfo.englishName} `}
                        <Tag
                          className="log-tag"
                          color={
                            constants.tagColors[log.foodInfo.primaryClassification.split('-')[0]]
                          }
                        >
                          {log.foodInfo.primaryClassification.split('-')[0]}
                        </Tag>
                        {
                          log.foodInfo.secondaryClassification && (
                            <Tag
                              className="log-tag"
                              color={
                                constants.tagColors[log.foodInfo.secondaryClassification]
                              }
                            >
                              {log.foodInfo.secondaryClassification}
                            </Tag>
                          )
                        }
                        <div className="kcal">
                          {`${log.consumed_mlConsumed
                            ? log.consumed_mlConsumed
                            : log.consumed_gramsConsumed}${log.consumed_mlConsumed
                            ? 'ml'
                            : 'g'} 
                          - ${log.consumed_totalKcalConsumed}kcal`}
                        </div>
                      </div>

                      <div className="log-right">
                        <div className="icon-container">
                          <Icon
                            className="action-icon"
                            onClick={() => console.log("HI")}
                            theme="filled"
                            type="edit"
                          />
                        </div>
                        <div className="icon-container">
                          <Icon
                            className="action-icon"
                            onClick={() => console.log("HI")}
                            theme="filled"
                            type="delete"
                          />
                        </div>
                      </div>
                    </div>
                  ))
              )
            }
          </div>

          <div className="space" />

          <div className="today-progress ">
            <div className="today-title">
              {
                `Dinner - 
                ${userLogs.filter(log => log.consumed_period === 'dinner')
                  .reduce((kcalTotal, log) => kcalTotal + log.consumed_totalKcalConsumed, 0)
                }kcal`
              }
            </div>
            {
              isFetchingLogs ? (
                <div className="log-loader">
                  <Spin />
                </div>
              ) : (
                userLogs
                  .filter(log => log.consumed_period === 'dinner')
                  .map(log => (
                    <div className="log" key={log.consumed_id}>
                      <div className="log-left">
                        {`${log.foodInfo.filipinoName || log.foodInfo.englishName} `}
                        <Tag
                          className="log-tag"
                          color={
                            constants.tagColors[log.foodInfo.primaryClassification.split('-')[0]]
                          }
                        >
                          {log.foodInfo.primaryClassification.split('-')[0]}
                        </Tag>
                        {
                          log.foodInfo.secondaryClassification && (
                            <Tag
                              className="log-tag"
                              color={
                                constants.tagColors[log.foodInfo.secondaryClassification]
                              }
                            >
                              {log.foodInfo.secondaryClassification}
                            </Tag>
                          )
                        }
                        <div className="kcal">
                          {`${log.consumed_mlConsumed
                            ? log.consumed_mlConsumed
                            : log.consumed_gramsConsumed}${log.consumed_mlConsumed
                            ? 'ml'
                            : 'g'} 
                          - ${log.consumed_totalKcalConsumed}kcal`}
                        </div>
                      </div>

                      <div className="log-right">
                        <div className="icon-container">
                          <Icon
                            className="action-icon"
                            onClick={() => console.log("HI")}
                            theme="filled"
                            type="edit"
                          />
                        </div>
                        <div className="icon-container">
                          <Icon
                            className="action-icon"
                            onClick={() => console.log("HI")}
                            theme="filled"
                            type="delete"
                          />
                        </div>
                      </div>
                    </div>
                  ))
              )
            }
          </div>

          <div className="space" />


        </div>
        <div className="absolute-button">
          <div className="popoverzzz">
            <Popover
              content={(
                <div>
                  <h5>
                    <Link to="/entry" onClick={() => this.handleAddEntry(constants.BREAKFAST)}>Breakfast</Link>
                  </h5>
                  <h5>
                    <Link to="/entry" onClick={() => this.handleAddEntry(constants.LUNCH)}>Lunch</Link>
                  </h5>
                  <h5>
                    <Link to="/entry" onClick={() => this.handleAddEntry(constants.DINNER)}>Dinner</Link>
                  </h5>
                  <h5>
                    Exercise
                  </h5>
                </div>
              )}
              placement="topLeft"
              title="Add Log"
              trigger="click"
              visible={showPopups}
              onVisibleChange={this.handleAddClick}
            />
          </div>
          <Button className="add-button" onClick={this.handleAddClick}>
            <img className="add-img" src="/home/addbutton.png" alt="add-entry" />
          </Button>
        </div>
      </div>
    );
  }
}

export default Home;
