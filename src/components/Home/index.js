import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  AutoComplete,
  Button,
  Divider,
  Empty,
  Icon,
  Input,
  InputNumber,
  message,
  Modal,
  Popover,
  Progress,
  Select,
  Spin,
  Tag
} from 'antd';
import './home.scss';

import * as constants from '../../constants';
import * as pageTitles from '../../constants/pages';

const { Option } = Select;
class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPopups: false,
      skip: 0,
      take: 16,
      currentFoodConsumed: 'default',
      gramsml: null,
      measure: null,
      deleting: false,
      mealCart: [],
      mealCartIds: [],
      foodSearched: null,
      currentFoodMeal: 'default'
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
      fetchLogs,
      getFavoriteIds
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
    getFavoriteIds(user.id);
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
      measure: logs[index].consumed_mlConsumed
        ? parseFloat((logs[index].consumed_mlConsumed
          / parseFloat(logs[index].food_mlEPPerExchange)
          / parseFloat(logs[index].food_exchangePerMeasure)).toFixed(2))
        : parseFloat((logs[index].consumed_gramsConsumed
          / parseFloat(logs[index].food_gramsEPPerExchange)
          / parseFloat(logs[index].food_exchangePerMeasure)).toFixed(2))
    });
    setPeriodEditing(period);
    toggleEditModal();
  }

  handleMeasure = (measure) => {
    const { currentFoodConsumed } = this.state;
    const gramsmlEPPerExchange = parseFloat(currentFoodConsumed.food_gramsEPPerExchange
      || currentFoodConsumed.food_mlEPPerExchange);
    const gramsml = currentFoodConsumed.food_exchangePerMeasure * gramsmlEPPerExchange;
    this.setState({
      measure,
      gramsml: parseFloat((gramsml * measure).toFixed(2))
    });
  }

  handleGramsML = (gramsml) => {
    const { currentFoodConsumed } = this.state;
    const gramsmlEPPerExchange = parseFloat(currentFoodConsumed.food_gramsEPPerExchange
      || currentFoodConsumed.food_mlEPPerExchange);
    const measure = gramsml / gramsmlEPPerExchange;
    this.setState({
      gramsml,
      measure: parseFloat((measure / currentFoodConsumed.food_exchangePerMeasure).toFixed(2))
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
      message.error('Input something!', 4);
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

  handleFavorite = (foodId) => {
    const { favFoodIds } = this.props;
    if (favFoodIds.includes(foodId)) {
      const { deleteFromFavorites, user: { id: uid } } = this.props;
      deleteFromFavorites({ uid, foodId });
    } else {
      const { addToFavorites, user: { id: uid } } = this.props;
      addToFavorites({ uid, foodId });
    }
  }

  handleMealInput = (value) => {
    this.setState({ foodSearched: value });
  }

  handleFoodSearch = (q) => {
    const { searchRaw } = this.props;
    if (q.length > 2) {
      searchRaw({ q, foodClass: 'all' });
    }
  }

  handleFoodSelect = async (foodIndex) => {
    const { searchedFood, user, resetSearch } = this.props;
    const { mealCart, mealCartIds } = this.state;

    const gramsEPPerExchange = parseFloat(searchedFood[foodIndex].food_gramsEPPerExchange);
    const mlEPPerExchange = parseFloat(searchedFood[foodIndex].food_mlEPPerExchange);
    const gramsConsumed = gramsEPPerExchange
      * parseFloat(searchedFood[foodIndex].food_exchangePerMeasure);
    const mlConsumed = mlEPPerExchange
      * parseFloat(searchedFood[foodIndex].food_exchangePerMeasure);
    const exchangePerMeasure = parseFloat(searchedFood[foodIndex].food_exchangePerMeasure);
    const choGrams = parseFloat(searchedFood[foodIndex].food_choPerExchange);
    const proGrams = parseFloat(searchedFood[foodIndex].food_proPerExchange);
    const fatGrams = parseFloat(searchedFood[foodIndex].food_fatPerExchange);

    const updatedMealCart = [{
      ...searchedFood[foodIndex],
      gramsConsumed: gramsConsumed ? parseFloat(gramsConsumed.toFixed(2)) : null,
      mlConsumed: mlConsumed ? parseFloat(mlConsumed.toFixed(2)) : null,
      totalKcalConsumed: parseFloat((parseFloat(searchedFood[foodIndex].food_directKcalPerMeasure)
        * exchangePerMeasure).toFixed(2)),
      choGrams: parseFloat((choGrams * exchangePerMeasure).toFixed(2)),
      proGrams: parseFloat((proGrams * exchangePerMeasure).toFixed(2)),
      fatGrams: parseFloat((fatGrams * exchangePerMeasure).toFixed(2)),
      user: user.id,
      food: searchedFood[foodIndex].food_id
    },
    ...mealCart
    ];

    const updatedMealCardIds = [
      searchedFood[foodIndex].food_id,
      ...mealCartIds
    ];

    await this.handleMealInput(null);
    this.setState({
      foodSearched: null,
      mealCart: updatedMealCart,
      mealCartIds: updatedMealCardIds
    }, () => resetSearch());
  }

  handleDeleteFromCart = (foodIndex) => {
    const { mealCart, mealCartIds } = this.state;
    const [updatedMealCart, updatedMealCartIds] = [[...mealCart], [...mealCartIds]];
    updatedMealCart.splice(foodIndex, 1);
    updatedMealCartIds.splice(foodIndex, 1);
    this.setState({ mealCart: updatedMealCart, mealCartIds: updatedMealCartIds });
  }

  handleFoodMealModal = (cartIndex) => {
    const { mealCart } = this.state;
    const { toggleMealEdit } = this.props;
    const foodToEdit = mealCart[cartIndex];
    this.setState({
      currentFoodMeal: foodToEdit
    }, () => toggleMealEdit());
  }

  handleMealModal = () => {
    const { toggleMealModal } = this.props;
    this.setState({ showPopups: false });
    toggleMealModal();
  }

  render() {
    const {
      showPopups,
      currentFoodConsumed,
      gramsml,
      measure,
      deleting,
      mealCart,
      mealCartIds,
      foodSearched
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
      isDeleting,
      isAddingToFavorites,
      favFoodIds,
      showCreateMealModal,
      searchedFood,
      isFetching
    } = this.props;
    const totalCho = userLogs.reduce((accCho, log) => accCho + log.consumed_choGrams, 0);
    const totalPro = userLogs.reduce((accPro, log) => accPro + log.consumed_proGrams, 0);
    const totalFat = userLogs.reduce((accFat, log) => accFat + log.consumed_fatGrams, 0);
    const totalKcal = userLogs.reduce((kcal, log) => kcal + log.consumed_totalKcalConsumed, 0); 
    const percentCho = parseFloat(((totalCho / user.choPerDay) * 100).toFixed(2));
    const percentPro = parseFloat(((totalPro / user.proPerDay) * 100).toFixed(2));
    const percentFat = parseFloat(((totalFat / user.fatPerDay) * 100).toFixed(2));
    const userKcal = user.goalTEA;

    let dateSelectedSplit = [];
    if (dateSelected) {
      dateSelectedSplit = dateSelected.split('-');
    } else if (dateToday) {
      dateSelectedSplit = dateToday.split('-');
    }

    return (
      <div className="home">

        <Modal
          className="meal-modal"
          title="Create meal"
          visible={showCreateMealModal}
          onCancel={this.handleMealModal}
          footer={(
            <div className="meal-footer">
              <div className="button-container">
                <Button
                  className="save-button"
                  onClick={this.handleMealModal}
                >
                  Cancel
                </Button>
              </div>
              <div className="button-container">
                <Button
                  type="primary"
                  className="save-button"
                  disabled={!mealCart.length}
                  onClick={this.handleSaveMeal}
                >
                  {
                    isAddingToFavorites
                      ? <Icon type="loading" />
                      : 'Save'
                  }
                </Button>
              </div>
            </div>

          )}
        >
          <div className="meal-body">
            <AutoComplete
              className="meal-search"
              placeholder="Search for food"
              onSearch={this.handleFoodSearch}
              onSelect={this.handleFoodSelect}
              dataSource={
                searchedFood
                  .filter(food => !mealCartIds.includes(food.food_id))
                  .map((food, index) => ({
                    value: index,
                    text: food.food_filipinoName || food.food_englishName,
                    label: food.food_filipinoName || food.food_englishName,
                    payload: food
                  }))
              }
              value={foodSearched}
              onChange={this.handleMealInput}
            >
              {
                isFetching ? (
                  <Input suffix={ <Icon type="loading" /> } />
                ) : (
                  <Input suffix={ <span /> } />
                )
              }
            </AutoComplete>
            <div className="meal-cart">
              <div className="cart-title">
                Foods
              </div>
              <div className="cart-body">
                {
                  mealCart.map((cartFood, index) => (

                    <div key={cartFood.food_id} className="cart-row">
                      <div className="cart-row-left">
                        {`${cartFood.food_filipinoName || cartFood.food_englishName} `}
                        <Tag
                          className="log-tag"
                          color={
                            constants.tagColors[cartFood.food_primaryClassification.split('-')[0]]
                          }
                        >
                          {cartFood.food_primaryClassification.split('-')[0]}
                        </Tag>
                        {
                          cartFood.food_secondaryClassification && (
                            <Tag
                              className="log-tag"
                              color={
                                constants.tagColors[cartFood.food_secondaryClassification]
                              }
                            >
                              {cartFood.food_secondaryClassification}
                            </Tag>
                          )
                        }
                        <div className="kcal">
                          {`${cartFood.mlConsumed
                            ? cartFood.mlConsumed
                            : cartFood.gramsConsumed}${cartFood.mlConsumed
                            ? 'ml'
                            : 'g'} 
                          - ${cartFood.totalKcalConsumed}kcal`}
                        </div>
                      </div>
                      <div className="cart-row-right">
                        <div className="icon-container">
                          <Icon
                            className="action-icon"
                            onClick={() => this.handleFoodMealModal(index)}
                            theme="filled"
                            type="edit"
                          />
                        </div>
                        <div className="icon-container">
                          <Icon
                            className="action-icon"
                            onClick={() => this.handleDeleteFromCart(index)}
                            type="close"
                          />
                        </div>
                      </div>
                    </div>


                  ))
                }
              </div>

            </div>
          </div>
        </Modal>

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
                ? (user.choPerDay - totalCho).toFixed(2)
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
                ? (user.proPerDay - totalPro).toFixed(2)
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
                ? (user.fatPerDay - totalFat).toFixed(2)
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
                      {`${log.food_filipinoName || log.food_englishName} `}
                      <Tag
                        className="log-tag"
                        color={
                          constants.tagColors[log.food_primaryClassification.split('-')[0]]
                        }
                      >
                        {log.food_primaryClassification.split('-')[0]}
                      </Tag>
                      {
                        log.food_secondaryClassification && (
                          <Tag
                            className="log-tag"
                            color={
                              constants.tagColors[log.food_secondaryClassification]
                            }
                          >
                            {log.food_secondaryClassification}
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
                      {`${log.food_filipinoName || log.food_englishName} `}
                      <Tag
                        className="log-tag"
                        color={
                          constants.tagColors[log.food_primaryClassification.split('-')[0]]
                        }
                      >
                        {log.food_primaryClassification.split('-')[0]}
                      </Tag>
                      {
                        log.food_secondaryClassification && (
                          <Tag
                            className="log-tag"
                            color={
                              constants.tagColors[log.food_secondaryClassification]
                            }
                          >
                            {log.food_secondaryClassification}
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
                      {`${log.food_filipinoName || log.food_englishName} `}
                      <Tag
                        className="log-tag"
                        color={
                          constants.tagColors[log.food_primaryClassification.split('-')[0]]
                        }
                      >
                        {log.food_primaryClassification.split('-')[0]}
                      </Tag>
                      {
                        log.food_secondaryClassification && (
                          <Tag
                            className="log-tag"
                            color={
                              constants.tagColors[log.food_secondaryClassification]
                            }
                          >
                            {log.food_secondaryClassification}
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
            <div
              key="meal"
              className="link"
              onClick={this.handleMealModal}
              role="none"
            >
              Meal
            </div>
          ]}
          placement="topLeft"
          title="Add"
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
          title={currentFoodConsumed.food_filipinoName || currentFoodConsumed.food_englishName}
          visible={showEditModal}
          onCancel={this.handleModalClose}
          footer={[
            <div className="macro-update" key="macro-display">
              <div className="macro-one">
                {`CHO: ${currentFoodConsumed
                  ? parseFloat(
                    (currentFoodConsumed.food_choPerExchange
                      * measure
                      * parseFloat(currentFoodConsumed.food_exchangePerMeasure))
                      .toFixed(2)
                  )
                  : null}g`
                }
              </div>
              <div className="macro-one">
                {`PRO: ${currentFoodConsumed
                  ? parseFloat(
                    (currentFoodConsumed.food_proPerExchange
                      * measure
                      * parseFloat(currentFoodConsumed.food_exchangePerMeasure))
                      .toFixed(2)
                  )
                  : null}g`
                }
              </div>
              <div className="macro-one">
                {`FAT: ${currentFoodConsumed
                  ? parseFloat(
                    (currentFoodConsumed.food_proPerExchange
                      * measure
                      * parseFloat(currentFoodConsumed.food_exchangePerMeasure))
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
              <div className="input-label">
                OR
              </div>
              <div className="input-label">
                {`${
                  parseFloat(currentFoodConsumed
                    ? currentFoodConsumed.food_gramsEPPerExchange
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
              {currentFoodConsumed.food_englishName}
            </div>
            <div className="label">
              {
                isAddingToFavorites ? (
                  <Icon type="loading" />
                ) : (
                  <Icon
                    className="fav-icon"
                    type="heart"
                    theme={favFoodIds.includes(currentFoodConsumed.food_id) ? 'filled' : null}
                    onClick={() => this.handleFavorite(currentFoodConsumed.food_id)}
                  />
                )
              }
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
              {`${currentFoodConsumed
                ? currentFoodConsumed.food_choPerExchange
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
              {`${currentFoodConsumed
                ? currentFoodConsumed.food_proPerExchange
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
              {`${currentFoodConsumed
                ? currentFoodConsumed.food_fatPerExchange
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
                currentFoodConsumed
                  ? parseFloat(currentFoodConsumed.consumed_gramsConsumed)
                    ? currentFoodConsumed.food_gramsEPPerExchange
                    : currentFoodConsumed.food_mlEPPerExchange
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
              {currentFoodConsumed
                ? currentFoodConsumed.food_servingMeasurement
                  ? currentFoodConsumed.food_servingMeasurement
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
