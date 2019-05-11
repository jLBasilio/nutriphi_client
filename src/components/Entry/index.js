import React, { Component } from 'react';
import {
  Button,
  Card,
  Col,
  Divider,
  message,
  Icon,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Radio,
  Row,
  Tag
} from 'antd';
import './entry.scss';

import * as constants from '../../constants';
import * as pageTitles from '../../constants/pages';
import * as dateUtil from '../../utils/date.util';

const { Search } = Input;
const { Group: RadioGroup } = Radio;
class Entry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skip: 0,
      take: 16,
      defaultSize: 16,
      previousSearched: null,
      currentSearched: null,
      confirmedSearch: null,
      currentFood: 'default',
      currentMeal: { ingredient: [] },
      measure: 1,
      gramsml: null,
      searchType: 'food'
    };
  }

  componentDidMount() {
    const {
      changePage,
      resetSearch,
      resetMealSearch
    } = this.props;
    changePage(pageTitles.ENTRY);
    resetSearch();
    resetMealSearch();
  }

  handleSearch = (q) => {
    const { previousSearched } = this.state;
    if (!q.length) {
      message.error('Input something', 4);
    } else if (q !== previousSearched && q.length > 2) {
      const {
        searchFood,
        searchMeal,
        searchFavorites,
        user
      } = this.props;
      const { skip, take, searchType } = this.state;

      if (searchType === 'food') {
        searchFood({
          skip, take, q, foodClass: 'all'
        });
      } else if (searchType === 'meal') {
        searchMeal({
          skip, take, q, uid: user
        });
      } else if (searchType === 'favorites') {
        searchFavorites({
          skip, take, q, uid: user
        });
      }

      this.setState({ previousSearched: q, confirmedSearch: q });
    }
  }

  handleSearchChange = (e) => {
    if (!e.target.value.length) {
      const { resetSearch, resetMealSearch } = this.props;
      this.setState({
        previousSearched: null,
        currentSearched: null,
        confirmedSearch: null
      });
      resetSearch();
      resetMealSearch();
    } else {
      this.setState({ currentSearched: e.target.value });
    }
  }

  handlePageChangeFromSearch = (page) => {
    const { searchFood } = this.props;
    const { defaultSize, take, currentSearched } = this.state;
    const skip = (page - 1) * defaultSize;

    searchFood({
      skip, take, q: currentSearched, foodClass: 'all'
    });
  }

  showFoodModal = (foodIndex) => {
    const { toggleModal, searchedFood } = this.props;
    const currentFood = searchedFood[foodIndex];
    const gramsEPPerExchange = parseFloat(currentFood.food_gramsEPPerExchange);
    this.setState({
      currentFood,
      measure: 1,
      gramsml: gramsEPPerExchange ? (
        currentFood.food_exchangePerMeasure * currentFood.food_gramsEPPerExchange
      ) : currentFood.food_exchangePerMeasure * parseFloat(currentFood.food_mlEPPerExchange)
    }, () => console.log(this.state));
    toggleModal();
  }

  handleModalClose = () => {
    const { toggleModal } = this.props;
    toggleModal();
  }

  handleMeasure = (measure) => {
    const { currentFood } = this.state;
    const gramsmlEPPerExchange = parseFloat(currentFood.food_gramsEPPerExchange
      || currentFood.food_mlEPPerExchange);
    const gramsml = currentFood.food_exchangePerMeasure * gramsmlEPPerExchange;
    this.setState({
      measure,
      gramsml: gramsml * measure
    });
  }

  handleGramsML = (gramsml) => {
    const { currentFood } = this.state;
    const gramsmlEPPerExchange = parseFloat(currentFood.food_gramsEPPerExchange
      || currentFood.food_mlEPPerExchange);
    const measure = gramsml / gramsmlEPPerExchange;
    this.setState({
      gramsml,
      measure: parseFloat((measure / currentFood.food_exchangePerMeasure).toFixed(2))
    });
  }

  handleAddToLog = async () => {
    const {
      period,
      user,
      addToLog
    } = this.props;
    const {
      currentFood: { food_id: foodId },
      gramsml: gramsmlConsumed,
      measure
    } = this.state;

    if (measure <= 0 || gramsmlConsumed <= 0) {
      message.error('Input something!', 4);
    } else {
      let { dateSelected: dateConsumed } = this.props;
      let presentTime = await dateUtil.generatePresent();
      [, presentTime] = presentTime.split('T');
      dateConsumed = `${dateConsumed}T${presentTime}`;

      addToLog({
        user,
        period,
        foodId,
        gramsmlConsumed,
        dateConsumed
      });
    }
  }

  handleFavorite = (foodId) => {
    const { favFoodIds } = this.props;
    if (favFoodIds.includes(foodId)) {
      const { deleteFromFavorites, user: uid } = this.props;
      deleteFromFavorites({ uid, foodId });
    } else {
      const { addToFavorites, user: uid } = this.props;
      addToFavorites({ uid, foodId });
    }
  }

  handleClickedMeal = (meal) => {
    const { toggleMealModal } = this.props;
    this.setState({
      currentMeal: meal
    }, () => toggleMealModal());
  }

  closeMealModal = async () => {
    const { toggleMealModal } = this.props;
    this.setState({
      currentMeal: { ingredient: [] }
    }, () => toggleMealModal());
  }

  handleRadioChange = (e) => {
    const { name, value } = e.target;
    const { resetSearch, resetMealSearch } = this.props;
    this.setState({
      [name]: value,
      previousSearched: null,
      currentSearched: null,
      confirmedSearch: null
    }, () => {
      resetSearch();
      resetMealSearch();
    });
  }

  handleAddMealToLog = async () => {
    const { currentMeal } = this.state;
    const { user, period, addMeal } = this.props;
    let { dateSelected: dateConsumed } = this.props;
    let presentTime = await dateUtil.generatePresent();
    [, presentTime] = presentTime.split('T');
    dateConsumed = `${dateConsumed}T${presentTime}`;

    const logs = [];
    currentMeal.ingredient.forEach(ingred => (
      logs.push({
        user,
        period,
        foodId: ingred.food.id,
        gramsmlConsumed: parseFloat(ingred.gramsConsumed || ingred.mlConsumed),
        dateConsumed
      })
    ));

    const toSend = { logs };
    console.log(toSend);
    addMeal(toSend);
  }

  render() {
    const {
      searchedFood,
      searchedFoodCount,
      isFetching,
      isAddingLog,
      hasSearched,
      showModal,
      period,
      favFoodIds,
      isAddingToFavorites,
      isFetchingMeal,
      searchedMeal,
      searchedMealCount,
      showMealModal
    } = this.props;

    const {
      defaultSize,
      currentFood,
      currentSearched,
      confirmedSearch,
      measure,
      gramsml,
      searchType,
      currentMeal
    } = this.state;

    return (
      <div className="entry">
        <div className="entry-body">

          <Modal
            className="meal-modal"
            title={currentMeal.mealName}
            visible={showMealModal}
            onCancel={this.closeMealModal}
            footer={(
              <div className="meal-footer">
                <div className="button-container">
                  <Button
                    className="save-button"
                    onClick={this.closeMealEdit}
                  >
                    Cancel
                  </Button>
                </div>
                <div className="button-container">
                  <Button
                    type="primary"
                    className="save-button"
                    onClick={this.handleAddMealToLog}
                  >
                    <Icon type="check" />
                  </Button>
                </div>
              </div>

            )}
          >
            <div className="meal-body">
              <div className="meal-cart">
                <div className="cart-title">
                  {`${currentMeal.mealTotalKcal}kcal`}
                </div>
                <div className="cart-body">
                  {
                    currentMeal && currentMeal.ingredient.map(ingredient => (
                      <div key={ingredient.id} className="cart-row">
                        <div className="cart-row-left">
                          {`${ingredient.food.filipinoName || ingredient.food.englishName} `}
                          <Tag
                            className="log-tag"
                            color={
                              constants.tagColors[ingredient.food.primaryClassification.split('-')[0]]
                            }
                          >
                            {ingredient.food.primaryClassification.split('-')[0]}
                          </Tag>
                          {
                            ingredient.food.secondaryClassification && (
                              <Tag
                                className="log-tag"
                                color={
                                  constants.tagColors[ingredient.food.secondaryClassification]
                                }
                              >
                                {ingredient.food.secondaryClassification}
                              </Tag>
                            )
                          }
                          <div className="kcal">
                            {`${ingredient.mlConsumed || ingredient.gramsConsumed}${ingredient.mlConsumed
                              ? 'ml'
                              : 'g'} 
                              - ${ingredient.totalKcalConsumed}kcal`}
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </Modal>
          <div className="search-add">
            <div className="search-row">
              {`Add ${searchType} to logs (${period.toUpperCase()})`}
            </div>
            <div className="search-row">
              <Search
                className="search"
                enterButton
                placeholder={`Search ${searchType} to add`}
                onSearch={this.handleSearch}
                onChange={this.handleSearchChange}
                value={currentSearched}
              />
            </div>
            <div className="search-row">
              <RadioGroup
                className="radio-group"
                name="searchType"
                onChange={this.handleRadioChange}
                value={searchType}
              >
                <Radio value="food">Foods</Radio>
                <Radio value="favorites">Favorites</Radio>
                <Radio value="meal">Meals</Radio>
              </RadioGroup>
            </div>
          </div>
          <Row gutter={24}>
            {
              searchType === 'food' ? (
                searchedFoodCount && (
                  <div className="showing">
                    {`SHOWING ${searchedFoodCount} RESULT/S FOR "${confirmedSearch}"` }
                  </div>
                )
              ) : (
                searchedMealCount && (
                  <div className="showing">
                    {`SHOWING ${searchedMealCount} RESULT/S FOR "${confirmedSearch}"` }
                  </div>
                )
              )
            }
            {
              (isFetching || isFetchingMeal) && (
                constants.emptyCards.map(element => (
                  <Col
                    key={element}
                    className="food-col"
                    xs={24}
                    md={8}
                    lg={6}
                  >
                    <Card className="food-card" loading />
                  </Col>
                ))
              )
            }
            {
              searchedFood.length && !isFetching ? (
                searchedFood.map((foodElement, index) => (
                  <Col
                    key={foodElement.food_id}
                    className="food-col"
                    xs={24}
                    md={8}
                    lg={6}
                  >
                    <Card
                      className="food-card"
                      hoverable
                      loading={isFetching}
                      onClick={() => this.showFoodModal(index)}
                      title={(
                        <div className="title-container">
                          <div className="food-title">
                            {foodElement.food_filipinoName || foodElement.food_englishName}
                          </div>

                          <div className="food-tag">
                            <div className="icon-section">
                              <Tag
                                color={
                                  constants.tagColors[foodElement.food_primaryClassification.split('-')[0]]
                                }
                              >
                                {foodElement.food_primaryClassification.split('-')[0]}
                              </Tag>
                              {
                                foodElement.food_secondaryClassification && (
                                  <Tag
                                    color={
                                      constants.tagColors[foodElement.food_secondaryClassification]
                                    }
                                  >
                                    {foodElement.food_secondaryClassification}
                                  </Tag>
                                )
                              }
                            </div>
                            <div className="icon-section">
                              <Icon
                                className="fav-icon"
                                type="heart"
                                theme={favFoodIds.includes(foodElement.food_id) ? 'filled' : null}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    >
                      <div className="card-body">
                        <div className="card-row">
                          <div className="macro">
                            CHO
                            <div className="macro-value">
                              {`${foodElement.food_choPerExchange
                                * foodElement.food_exchangePerMeasure
                              }g`}
                            </div>
                          </div>
                          <div className="macro">
                            PRO
                            <div className="macro-value">
                              {`${foodElement.food_proPerExchange
                                * foodElement.food_exchangePerMeasure
                              }g`}
                            </div>
                          </div>
                          <div className="macro">
                            FAT
                            <div className="macro-value">
                              {`${foodElement.food_fatPerExchange
                                * foodElement.food_exchangePerMeasure
                              }g`}
                            </div>
                          </div>
                        </div>

                        <div className="card-row">
                          <div className="total-label">
                            Total:
                          </div>
                          <div className="total-label">
                            {`${foodElement.food_directKcalPerMeasure
                              * foodElement.food_exchangePerMeasure
                            }kcal`}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))
              ) : searchedMeal.length && !isFetching ? (
                searchedMeal.map((mealElement, index) => (
                  <Col
                    key={mealElement.id}
                    className="meal-col"
                    xs={24}
                    md={8}
                    lg={6}
                  >
                    <Card
                      className="meal-card"
                      hoverable
                      loading={isFetching}
                      onClick={() => this.handleClickedMeal(mealElement)}
                      title={(
                        <div className="title-container">
                          <div className="food-title">
                            {mealElement.mealName}
                          </div>
                        </div>
                      )}
                    >
                      <div className="card-body">
                        <div className="ingredients-row">
                          {
                            mealElement.ingredient.map(ingredient => (
                              <div key={ingredient.id} className="one-ingredient">
                                <div className="ingredient-name">
                                  {`${ingredient.food.filipinoName || ingredient.food.englishName} `}
                                  <Tag
                                    className="log-tag"
                                    color={
                                      constants.tagColors[ingredient.food.primaryClassification.split('-')[0]]
                                    }
                                  >
                                    {ingredient.food.primaryClassification.split('-')[0]}
                                  </Tag>
                                  {
                                    ingredient.food.secondaryClassification && (
                                      <Tag
                                        className="log-tag"
                                        color={
                                          constants
                                            .tagColors[ingredient.food.secondaryClassification]
                                        }
                                      >
                                        {ingredient.food.secondaryClassification}
                                      </Tag>
                                    )
                                  }
                                  <div className="kcal">
                                    {`${ingredient.mlConsumed || ingredient.gramsConsumed}${ingredient.mlConsumed
                                      ? 'ml'
                                      : 'g'} 
                                      - ${ingredient.totalKcalConsumed}kcal`}
                                  </div>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                        <div className="card-row">
                          <div className="macro">
                            CHO
                            <div className="macro-value">
                              {`${mealElement.mealChoGrams}g`}
                            </div>
                          </div>
                          <div className="macro">
                            PRO
                            <div className="macro-value">
                              {`${mealElement.mealProGrams}g`}
                            </div>
                          </div>
                          <div className="macro">
                            FAT
                            <div className="macro-value">
                              {`${mealElement.mealFatGrams}g`}
                            </div>
                          </div>
                        </div>

                        <div className="card-row">
                          <div className="total-label">
                            Total:
                          </div>
                          <div className="total-label">
                            {`${mealElement.mealTotalKcal}kcal`}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))
              ) : null
            }
          </Row>
          {
            hasSearched && searchedFoodCount ? (
              <div className="pagination-div">
                <Pagination
                  className="pagination"
                  pageSize={defaultSize}
                  total={searchedFoodCount}
                  hideOnSinglePage
                  size="small"
                  onChange={this.handlePageChangeFromSearch}
                />
              </div>
            ) : hasSearched && !searchedFoodCount && (
              <div className="pagination-div">
                {`NO RESULTS FOR "${confirmedSearch}"`}
              </div>
            )
          }

          <Modal
            className="entry-modal"
            title={currentFood.food_filipinoName || currentFood.food_englishName}
            visible={showModal}
            onCancel={this.handleModalClose}
            footer={[
              <div className="macro-update" key="macro-display">
                <div className="macro-one">
                  {`CHO: ${parseFloat((currentFood.food_choPerExchange * measure).toFixed(2))}g`}
                </div>
                <div className="macro-one">
                  {`PRO: ${parseFloat((currentFood.food_proPerExchange * measure).toFixed(2))}g`}
                </div>
                <div className="macro-one">
                  {`FAT: ${parseFloat((currentFood.food_fatPerExchange * measure).toFixed(2))}g`}
                </div>
              </div>,
              <div className="macro-update" key="macro-kcal">
                <div className="total-kcal">
                  Total
                </div>
                <div className="total-kcal">
                  {`${(currentFood.food_exchangePerMeasure
                    * currentFood.food_directKcalPerMeasure
                    * measure).toFixed(2)}kcal`}
                </div>
              </div>,

              <div className="input-container" key="input-log">
                <div className="input-label">
                  Measure
                  <InputNumber
                    className="input-measure"
                    onChange={this.handleMeasure}
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
                    parseFloat(currentFood.food_gramsEPPerExchange)
                      ? 'Grams'
                      : 'ml'
                  }`}
                  <InputNumber
                    className="input-measure"
                    min={0}
                    onChange={this.handleGramsML}
                    type="number"
                    value={gramsml}
                  />
                </div>
                <div className="input-label submit-button">
                  <Button
                    key="submit"
                    type="primary"
                    onClick={this.handleAddToLog}
                  >
                    {
                      !isAddingLog
                        ? <Icon type="check" />
                        : <Icon type="loading" />
                    }
                  </Button>
                </div>
              </div>
            ]}
          >
            <div className="label-container">
              <div className="label">
                {currentFood.food_englishName}
              </div>
              <div className="label">
                {
                  isAddingToFavorites ? (
                    <Icon type="loading" />
                  ) : (
                    <Icon
                      className="fav-icon"
                      type="heart"
                      theme={favFoodIds.includes(currentFood.food_id) ? 'filled' : null}
                      onClick={() => this.handleFavorite(currentFood.food_id)}
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
                {`${currentFood.food_choPerExchange}g`}
              </div>
            </div>

            <Divider />

            <div className="info-row">
              <div className="macros">
                Protein (PRO)
              </div>
              <div className="macros-value">
                {`${currentFood.food_proPerExchange}g`}
              </div>
            </div>

            <Divider />

            <div className="info-row">
              <div className="macros">
                Fat (FAT)
              </div>
              <div className="macros-value">
                {`${currentFood.food_fatPerExchange}g`}
              </div>
            </div>

            <Divider />

            <div className="info-row">
              <div className="macros">
                {`${
                  parseFloat(currentFood.food_gramsEPPerExchange)
                    ? 'EP Weight'
                    : 'EP ML'
                }`}
              </div>
              <div className="macros-value">
                {`${
                  parseFloat(currentFood.food_gramsEPPerExchange)
                    ? currentFood.food_gramsEPPerExchange
                    : currentFood.food_mlEPPerExchange
                }${
                  parseFloat(currentFood.food_gramsEPPerExchange)
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
                {currentFood.food_servingMeasurement || 'N/A'}
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Entry;
