import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Divider,
  Empty,
  Icon,
  InputNumber,
  message,
  Modal,
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
      // skip: 0,
      // take: 10,
      currentFoodConsumed: 'default',
      gramsml: null,
      measure: null,
      deleting: false
    };
  }

  componentDidMount() {
    const {
      changePage,
      setTodayDate,
      changeDate,
      dateToday,
      dateSelected,
      user,
      fetchLogs
    } = this.props;
    changePage(pageTitles.HOME);

    if (!dateToday) {
      const date = new Date(Date.now());
      const dateFormatted = `${date.getFullYear()}-${(date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1)}-${(date.getDate() < 10 ? '0' : '') + date.getDate()}`;

      setTodayDate(dateFormatted);
      changeDate(dateFormatted);

      fetchLogs({
        userId: user.id,
        date: dateFormatted
      });
    } else {
      fetchLogs({
        userId: user.id,
        date: dateSelected
      });
    }
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

  handleModalOpen = (index, period, deleting) => {
    const { toggleEditModal, setPeriodEditing } = this.props;
    let logs;
    if (period === 'breakfast') {
      const { breakfast } = this.props;
      logs = breakfast;
    } else if (period === 'lunch') {
      const { lunch } = this.props;
      logs = lunch;
    } else if (period === 'dinner') {
      const { dinner } = this.props;
      logs = dinner;
    }
    const gramsml = logs[index].consumed_mlConsumed || logs[index].consumed_gramsConsumed;
    this.setState({
      deleting,
      currentFoodConsumed: logs[index],
      gramsml,
      measure: logs[index].foodInfo
        ? logs[index].consumed_mlConsumed
          ? parseFloat((logs[index].consumed_mlConsumed
            / parseFloat(logs[index].foodInfo.mlEPPerExchange)
            / parseFloat(logs[index].foodInfo.exchangePerMeasure)).toFixed(2))
          : parseFloat((logs[index].consumed_gramsConsumed
            / parseFloat(logs[index].foodInfo.gramsEPPerExchange)
            / parseFloat(logs[index].foodInfo.exchangePerMeasure)).toFixed(2))
        : null
    });
    setPeriodEditing(period);
    toggleEditModal();
  }

  handleMeasure = (measure) => {
    const { currentFoodConsumed } = this.state;
    const gramsmlEPPerExchange = parseFloat(currentFoodConsumed.foodInfo.gramsEPPerExchange
      || currentFoodConsumed.foodInfo.mlEPPerExchange);
    const gramsml = currentFoodConsumed.foodInfo.exchangePerMeasure * gramsmlEPPerExchange;
    this.setState({
      measure,
      gramsml: parseFloat((gramsml * measure).toFixed(2))
    });
  }

  handleGramsML = (gramsml) => {
    const { currentFoodConsumed } = this.state;
    const gramsmlEPPerExchange = parseFloat(currentFoodConsumed.foodInfo.gramsEPPerExchange
      || currentFoodConsumed.foodInfo.mlEPPerExchange);
    const measure = gramsml / gramsmlEPPerExchange;
    this.setState({
      gramsml,
      measure: parseFloat((measure / currentFoodConsumed.foodInfo.exchangePerMeasure).toFixed(2))
    });
  }

  handleEditLog = () => {
    const {
      currentFoodConsumed,
      gramsml: gramsmlConsumed,
      measure
    } = this.state;
    const {
      consumed_dateConsumed: dateConsumed,
      consumed_foodId: foodId,
      consumed_id: id,
      consumed_period: period,
      consumed_userId: userId
    } = currentFoodConsumed;
    const { editLog, toggleEditModal } = this.props;
    const currentFoodGramsML = currentFoodConsumed.consumed_gramsConsumed
      || currentFoodConsumed.consumed_mlConsumed;
    if (measure <= 0 || gramsmlConsumed <= 0) {
      message.error('Input something!');
    } else if (gramsmlConsumed === currentFoodGramsML) {
      toggleEditModal();
    } else {
      editLog({
        dateConsumed,
        foodId,
        id,
        period,
        userId,
        gramsmlConsumed
      });
    }
  }

  handleModalClose = () => {
    const { toggleEditModal, setPeriodEditing } = this.props;
    toggleEditModal();
    setPeriodEditing(null);
  }

  handleDeleteLog = () => {
    const { deleteLog } = this.props;
    const {
      currentFoodConsumed: { consumed_id: consumedId },
      currentFoodConsumed: { consumed_userId: userId },
      currentFoodConsumed: { consumed_dateConsumed: dateConsumed },
      currentFoodConsumed: { consumed_period: period }
    } = this.state;
    deleteLog({
      userId,
      period,
      dateConsumed,
      consumedId
    });
  }

  render() {
    const {
      showPopups,
      currentFoodConsumed,
      gramsml,
      measure,
      deleting
    } = this.state;
    const {
      dateToday,
      dateSelected,
      isFetchingLogs,
      userLogs,
      breakfast,
      lunch,
      dinner,
      user,
      showEditModal,
      isEditing,
      isDeleting
    } = this.props;
    const totalCho = userLogs.reduce((accCho, log) => accCho + log.consumed_choGrams, 0);
    const totalPro = userLogs.reduce((accPro, log) => accPro + log.consumed_proGrams, 0);
    const totalFat = userLogs.reduce((accFat, log) => accFat + log.consumed_fatGrams, 0);
    const percentCho = parseFloat(((totalCho / user.choPerDay) * 100).toFixed(2));
    const percentPro = parseFloat(((totalPro / user.proPerDay) * 100).toFixed(2));
    const percentFat = parseFloat(((totalFat / user.fatPerDay) * 100).toFixed(2));
    const totalKcal = (totalCho + totalPro) * constants.KCAL_PER_PRO_MUL
      + totalFat * constants.KCAL_PER_FAT_MUL;
    const userKcal = user.goalTEA;

    let dateSelectedSplit = [];
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
                ${(user.choPerDay - totalCho) >= 0
                ? (user.choPerDay - totalCho)
                : 0
                }g left
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
                ${(user.proPerDay - totalPro) >= 0
                ? (user.proPerDay - totalPro)
                : 0
                }g left
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
                ${(user.fatPerDay - totalFat) >= 0
                ? (user.fatPerDay - totalFat)
                : 0
                }g left
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
                ${breakfast.reduce((kcalTotal, log) => kcalTotal + log.consumed_totalKcalConsumed, 0)}kcal`
              }
            </div>
            {

              isFetchingLogs ? (
                <div className="log-loader">
                  <Spin />
                </div>
              ) : breakfast.length ? (
                breakfast.map((log, index) => (
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
                          onClick={() => this.handleModalOpen(index, 'breakfast', false)}
                          theme="filled"
                          type="edit"
                        />
                      </div>
                      <div className="icon-container">
                        <Icon
                          className="action-icon"
                          onClick={() => this.handleModalOpen(index, 'breakfast', true)}
                          theme="filled"
                          type="delete"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )
            }
          </div>

          <div className="space" />

          <div className="today-progress ">
            <div className="today-title">
              {
                `Lunch - 
                ${lunch.reduce((kcalTotal, log) => kcalTotal + log.consumed_totalKcalConsumed, 0)}kcal`
              }
            </div>
            {
              isFetchingLogs ? (
                <div className="log-loader">
                  <Spin />
                </div>
              ) : lunch.length ? (
                lunch.map((log, index) => (
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
                          onClick={() => this.handleModalOpen(index, 'lunch', false)}
                          theme="filled"
                          type="edit"
                        />
                      </div>
                      <div className="icon-container">
                        <Icon
                          className="action-icon"
                          onClick={() => this.handleModalOpen(index, 'lunch', true)}
                          theme="filled"
                          type="delete"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )
            }
          </div>

          <div className="space" />

          <div className="today-progress ">
            <div className="today-title">
              {
                `Dinner - 
                ${dinner.reduce((kcalTotal, log) => kcalTotal + log.consumed_totalKcalConsumed, 0)}kcal`
              }
            </div>
            {
              isFetchingLogs ? (
                <div className="log-loader">
                  <Spin />
                </div>
              ) : dinner.length ? (
                dinner.map((log, index) => (
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
                          onClick={() => this.handleModalOpen(index, 'dinner', false)}
                          theme="filled"
                          type="edit"
                        />
                      </div>
                      <div className="icon-container">
                        <Icon
                          className="action-icon"
                          onClick={() => this.handleModalOpen(index, 'dinner', true)}
                          theme="filled"
                          type="delete"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )
            }
          </div>

          <div className="space" />

        </div>

        <Popover
          content={[
            <Link to="/entry" key="breakfast" onClick={() => this.handleAddEntry(constants.BREAKFAST)}>
              <div className="link">Breakfast</div>
            </Link>,
            <Link to="/entry" key="lunch" onClick={() => this.handleAddEntry(constants.LUNCH)}>
              <div className="link">Lunch</div>
            </Link>,
            <Link to="/entry" key="dinner" onClick={() => this.handleAddEntry(constants.DINNER)}>
              <div className="link">Dinner</div>
            </Link>,
            <Link to="/exercise" key="exercise" onClick={this.handleExercise}>
              <div className="link">Exercise</div>
            </Link>
          ]}
          placement="topLeft"
          title="Add Log"
          trigger="click"
          visible={showPopups}
          onVisibleChange={this.handleAddClick}
        >
          <div className="add-container">
            <Icon
              type="plus-circle"
              className="add-img"
              theme="filled"
              onClick={this.handleAddClick}
            />
          </div>
        </Popover>

        <Modal
          title={
            currentFoodConsumed.foodInfo ? currentFoodConsumed.foodInfo.filipinoName
            || currentFoodConsumed.foodInfo.englishName
              : null}
          visible={showEditModal}
          onCancel={this.handleModalClose}
          footer={[
            <div className="macro-update" key="macro-display">
              <div className="macro-one">
                {`CHO: ${currentFoodConsumed.foodInfo
                  ? parseFloat(
                    (currentFoodConsumed.foodInfo.choPerExchange
                      * measure
                      * parseFloat(currentFoodConsumed.foodInfo.exchangePerMeasure))
                      .toFixed(2)
                  )
                  : null}g`
                }
              </div>
              <div className="macro-one">
                {`PRO: ${currentFoodConsumed.foodInfo
                  ? parseFloat(
                    (currentFoodConsumed.foodInfo.proPerExchange
                      * measure
                      * parseFloat(currentFoodConsumed.foodInfo.exchangePerMeasure))
                      .toFixed(2)
                  )
                  : null}g`
                }
              </div>
              <div className="macro-one">
                {`FAT: ${currentFoodConsumed.foodInfo
                  ? parseFloat(
                    (currentFoodConsumed.foodInfo.proPerExchange
                      * measure
                      * parseFloat(currentFoodConsumed.foodInfo.exchangePerMeasure))
                      .toFixed(2)
                  )
                  : null}g`
                }
              </div>
            </div>,

            <div className="input-container" key="input-log">
              <div className="input-label">
                Measure
                <InputNumber
                  className="input-measure"
                  onChange={this.handleMeasure}
                  disabled={deleting}
                  min={0}
                  type="number"
                  value={measure}
                />
              </div>
              <div className="or-between">
                OR
              </div>
              <div className="input-label">
                {`${
                  parseFloat(currentFoodConsumed.foodInfo
                    ? currentFoodConsumed.foodInfo.gramsEPPerExchange
                    : 0)
                    ? 'Grams'
                    : 'ml'
                }`}
                <InputNumber
                  className="input-measure"
                  min={0}
                  onChange={this.handleGramsML}
                  disabled={deleting}
                  type="number"
                  value={gramsml}
                />
              </div>
              <div className="input-label submit-button">
                {
                  !deleting ? (
                    <Button
                      type="primary"
                      onClick={this.handleEditLog}
                    >
                      {
                        !isEditing
                          ? <Icon type="check" />
                          : <Icon type="loading" />
                      }
                    </Button>
                  ) : (
                    <Button
                      type="danger"
                      onClick={this.handleDeleteLog}
                    >
                      {
                        !isDeleting
                          ? <Icon type="delete" />
                          : <Icon type="loading" />
                      }
                    </Button>
                  )
                }
              </div>
            </div>
          ]}
        >

          <div className="label-container">
            <div className="label">
              {currentFoodConsumed.foodInfo
                ? (currentFoodConsumed.foodInfo.englishName || 'N/A')
                : null}
            </div>
          </div>

          <Divider />

          <div className="nut-info">
            Nutritional Info
            <div className="nut-subinfo">
              (Per exchange)
            </div>
          </div>

          <Divider />

          <div className="info-row">
            <div className="macros">
              Carbohydrate (CHO)
            </div>
            <div className="macros-value">
              {`${currentFoodConsumed.foodInfo
                ? currentFoodConsumed.foodInfo.choPerExchange
                : null}g`
              }
            </div>
          </div>

          <Divider />

          <div className="info-row">
            <div className="macros">
              Protein (PRO)
            </div>
            <div className="macros-value">
              {`${currentFoodConsumed.foodInfo
                ? currentFoodConsumed.foodInfo.proPerExchange
                : null}g`
              }
            </div>
          </div>

          <Divider />

          <div className="info-row">
            <div className="macros">
              Fat (FAT)
            </div>
            <div className="macros-value">
              {`${currentFoodConsumed.foodInfo
                ? currentFoodConsumed.foodInfo.fatPerExchange
                : null}g`
              }
            </div>
          </div>

          <Divider />

          <div className="info-row">
            <div className="macros">
              {`${
                parseFloat(currentFoodConsumed.consumed_gramsConsumed)
                  ? 'EP Weight'
                  : 'EP ML'
              }`}
            </div>
            <div className="macros-value">
              {`${
                currentFoodConsumed.foodInfo
                  ? parseFloat(currentFoodConsumed.consumed_gramsConsumed)
                    ? currentFoodConsumed.foodInfo.gramsEPPerExchange
                    : currentFoodConsumed.foodInfo.mlEPPerExchange
                  : null
              }${
                parseFloat(currentFoodConsumed.consumed_gramsConsumed)
                  ? 'g'
                  : 'ml'
              }`}
            </div>
          </div>

          <Divider />

          <div className="info-row">
            <div className="macros">
              Measurement
            </div>
            <div className="macros-value">
              {currentFoodConsumed.foodInfo
                ? currentFoodConsumed.foodInfo.servingMeasurement
                  ? currentFoodConsumed.foodInfo.servingMeasurement
                  : 'N/A'
                : null
              }
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Home;
