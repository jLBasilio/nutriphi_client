import React, { Component } from 'react';
import {
  AutoComplete,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Icon,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Tag
} from 'antd';
import './meal.scss';

import * as constants from '../../constants';
import * as pages from '../../constants/pages';

const { Search } = Input;
class Meal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skip: 0,
      take: 16,
      defaultSize: 16,
      previousSearched: null,
      currentSearched: null,
      confirmedSearch: null,
      currentEditingMeal: 'default',
      currentEditingIngredients: [],
      currentEditingIds: [],
      currentEditingName: null,
      foodSearched: null,
      mealTotalKcal: null,
      currentFoodEditing: { food: {} },
      currentFoodEditingIndex: null,
      gramsml: null,
      measure: null,
      deletedIngreds: []
    };
  }

  componentDidMount() {
    const {
      changePage,
      uid,
      fetchMeal
    } = this.props;
    const { skip, take } = this.state;

    changePage(pages.MEAL);
    fetchMeal({ uid, skip, take });
  }

  handleSearch = (q) => {
    const { previousSearched } = this.state;
    if (!q.length) {
      message.error('Input something!', 4);
    } else if (q !== previousSearched && q.length > 2) {
      const {
        searchMeal,
        resetSearch,
        uid
      } = this.props;
      const { skip, take } = this.state;
      resetSearch();

      searchMeal({
        skip, take, q, uid
      });

      this.setState({ previousSearched: q, confirmedSearch: q });
    }
  }

  handleSearchChange = (e) => {
    if (!e.target.value.length) {
      const { resetSearch } = this.props;
      this.setState({
        previousSearched: null,
        currentSearched: null,
        confirmedSearch: null,
        currentPageNumber: 1
      });
      resetSearch();
    } else {
      this.setState({ currentSearched: e.target.value });
    }
  }

  showMealEdit = (index, fromSearch) => {
    const {
      meal,
      searchedMeal,
      toggleMealModal
    } = this.props;
    const updatedMeal = fromSearch
      ? [...searchedMeal][index]
      : [...meal][index];

    const updatedIds = [];
    const updatedIngredients = [...updatedMeal.ingredient];
    let updatedMealTotalKcal = 0;
    updatedIngredients.forEach((ingredient) => {
      updatedIds.push(ingredient.food.id);
      updatedMealTotalKcal += parseFloat(ingredient.totalKcalConsumed);
    });

    this.setState({
      currentEditingMeal: updatedMeal,
      currentEditingIds: updatedIds,
      mealTotalKcal: updatedMealTotalKcal,
      currentEditingIngredients: updatedIngredients,
      currentEditingName: updatedMeal.mealName
    }, () => toggleMealModal());
  }

  closeMealEdit = () => {
    const { toggleMealModal } = this.props;
    toggleMealModal();
  }

  closeFoodEdit = () => {
    const { toggleEditFoodModal } = this.props;
    toggleEditFoodModal();
  }

  handleMealInput = (value) => {
    this.setState({ foodSearched: value });
  }

  handleFoodSearch = (q) => {
    const { searchRaw, resetFoodSearch } = this.props;
    if (!q.length) {
      resetFoodSearch();
    } else if (q.length > 2) {
      searchRaw({ q, foodClass: 'all' });
    }
  }

  handleFoodSelect = async (foodIndex) => {
    const { searchedFood: preSearch, uid, resetSearch } = this.props;
    const { currentEditingIngredients, currentEditingIds } = this.state;
    const searchedFood = preSearch.filter(food => !currentEditingIds.includes(food.food_id));

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

    const newSearchedFood = JSON.parse(JSON.stringify(
      searchedFood[foodIndex]
    ).replace(/food_/g, ''));

    const updatedEditingIngredients = [{
      food: { ...newSearchedFood },
      gramsConsumed: gramsConsumed ? parseFloat(gramsConsumed.toFixed(2)) : null,
      mlConsumed: mlConsumed ? parseFloat(mlConsumed.toFixed(2)) : null,
      totalKcalConsumed: parseFloat((parseFloat(searchedFood[foodIndex].food_directKcalPerMeasure)
        * exchangePerMeasure).toFixed(2)),
      choGrams: parseFloat((choGrams * exchangePerMeasure).toFixed(2)),
      proGrams: parseFloat((proGrams * exchangePerMeasure).toFixed(2)),
      fatGrams: parseFloat((fatGrams * exchangePerMeasure).toFixed(2)),
      user: uid
    },
    ...currentEditingIngredients
    ];

    const updatedMealTotalKcal = updatedEditingIngredients
      .reduce((kcalAcc, curr) => kcalAcc + parseFloat(curr.totalKcalConsumed), 0);

    const updatedEditingIds = [
      newSearchedFood.id,
      ...currentEditingIds
    ];

    await this.handleMealInput(null);
    this.setState({
      foodSearched: null,
      currentEditingIngredients: updatedEditingIngredients,
      currentEditingIds: updatedEditingIds,
      mealTotalKcal: updatedMealTotalKcal
    }, () => resetSearch());
  }

  handleEditFromCart = (cartIndex) => {
    const { currentEditingIngredients } = this.state;
    const { toggleEditFoodModal } = this.props;

    const foodToEdit = currentEditingIngredients[cartIndex];
    const gramsml = parseFloat(foodToEdit.mlConsumed || foodToEdit.gramsConsumed);
    this.setState({
      currentFoodEditing: foodToEdit,
      currentFoodEditingIndex: cartIndex,
      gramsml,
      measure: foodToEdit.mlConsumed
        ? parseFloat((foodToEdit.mlConsumed
          / parseFloat(foodToEdit.food.mlEPPerExchange)
          / parseFloat(foodToEdit.food.exchangePerMeasure)).toFixed(2))
        : parseFloat((foodToEdit.gramsConsumed
          / parseFloat(foodToEdit.food.gramsEPPerExchange)
          / parseFloat(foodToEdit.food.exchangePerMeasure)).toFixed(2))
    }, () => toggleEditFoodModal());
  }

  handleMeasureCart = (measure) => {
    const { currentFoodEditing } = this.state;
    const gramsmlEPPerExchange = parseFloat(currentFoodEditing.food.gramsEPPerExchange
      || currentFoodEditing.food.mlEPPerExchange);
    const gramsml = currentFoodEditing.food.exchangePerMeasure * gramsmlEPPerExchange;
    this.setState({
      measure,
      gramsml: parseFloat((gramsml * measure).toFixed(2))
    });
  }

  handleGramsMLCart = (gramsml) => {
    const { currentFoodEditing } = this.state;
    const gramsmlEPPerExchange = parseFloat(currentFoodEditing.food.gramsEPPerExchange
      || currentFoodEditing.food.mlEPPerExchange);
    const measure = gramsml / gramsmlEPPerExchange;
    this.setState({
      gramsml,
      measure: parseFloat((measure / currentFoodEditing.food.exchangePerMeasure).toFixed(2))
    });
  }

  handleEditIngredient = () => {
    const {
      currentEditingMeal,
      currentFoodEditing,
      currentFoodEditingIndex,
      currentEditingIngredients,
      measure,
      gramsml
    } = this.state;

    if (measure <= 0 || gramsml <= 0) {
      message.error('Input something!', 4);
    } else {
      const updatedEditingIngredients = [...currentEditingIngredients];
      const updatedFoodEditing = { ...currentFoodEditing };
      const updatedEditingMeal = { ...currentEditingMeal };

      let { gramsConsumed, mlConsumed } = updatedFoodEditing;
      const choGrams = parseFloat(measure
        * updatedFoodEditing.food.choPerExchange)
        * updatedFoodEditing.food.exchangePerMeasure;
      const proGrams = parseFloat(measure
        * updatedFoodEditing.food.proPerExchange)
        * updatedFoodEditing.food.exchangePerMeasure;
      const fatGrams = parseFloat(measure
        * updatedFoodEditing.food.fatPerExchange)
        * updatedFoodEditing.food.exchangePerMeasure;

      const totalKcalConsumed = parseFloat(((choGrams + proGrams) * constants.KCAL_PER_CHO_MUL
        + fatGrams * constants.KCAL_PER_FAT_MUL).toFixed(2));
      if (gramsConsumed) {
        gramsConsumed = gramsml;
      } else {
        mlConsumed = gramsml;
      }

      updatedFoodEditing.choGrams = parseFloat(choGrams.toFixed(2));
      updatedFoodEditing.proGrams = parseFloat(proGrams.toFixed(2));
      updatedFoodEditing.fatGrams = parseFloat(fatGrams.toFixed(2));
      updatedFoodEditing.gramsConsumed = gramsConsumed;
      updatedFoodEditing.mlConsumed = mlConsumed;
      updatedFoodEditing.totalKcalConsumed = totalKcalConsumed;
      updatedEditingIngredients[currentFoodEditingIndex] = updatedFoodEditing;
      updatedEditingMeal.ingredient = [...updatedEditingIngredients];

      const updatedTotalMealKcal = updatedEditingIngredients
        .reduce((kcalAcc, curr) => kcalAcc + parseFloat(curr.totalKcalConsumed), 0);

      this.setState({
        currentEditingMeal: updatedEditingMeal,
        currentFoodEditing: updatedFoodEditing,
        currentEditingIngredients: updatedEditingIngredients,
        mealTotalKcal: updatedTotalMealKcal
      }, this.closeFoodEdit);
    }
  }

  handleDeleteFromCart = (foodIndex) => {
    const {
      currentEditingIngredients,
      currentEditingIds,
      deletedIngreds
    } = this.state;

    const [
      updatedDeleted,
      updatedEditingIngredients,
      updatedEditingIds] = [
      [...deletedIngreds],
      [...currentEditingIngredients],
      [...currentEditingIds]
    ];

    if (currentEditingIngredients[foodIndex].id) {
      updatedDeleted.push(currentEditingIngredients[foodIndex].id);
    }

    updatedEditingIngredients.splice(foodIndex, 1);
    updatedEditingIds.splice(foodIndex, 1);

    const updatedMealTotalKcal = updatedEditingIngredients
      .reduce((kcalAcc, curr) => kcalAcc + parseFloat(curr.totalKcalConsumed), 0);

    this.setState({
      currentEditingIngredients: updatedEditingIngredients,
      currentEditingIds: updatedEditingIds,
      deletedIngreds: updatedDeleted,
      mealTotalKcal: updatedMealTotalKcal
    });
  }

  handleNameMeal = () => {
    const { toggleNameModal } = this.props;
    toggleNameModal();
  }

  handleEditSaveMeal = async () => {
    const {
      currentEditingMeal,
      currentEditingIngredients,
      currentEditingName,
      deletedIngreds,
      skip,
      take
    } = this.state;
    const { editMeal, uid } = this.props;

    const toSend = {};
    toSend.deleted = [...deletedIngreds];
    toSend.mealName = currentEditingName;
    toSend.id = currentEditingMeal.id;
    toSend.ingredient = [];
    toSend.mealTotalKcal = 0;
    toSend.mealChoGrams = 0;
    toSend.mealProGrams = 0;
    toSend.mealFatGrams = 0;
    currentEditingIngredients.forEach((ingredient) => {
      toSend.ingredient.push({
        ...ingredient,
        food: ingredient.food.id
      });
      toSend.mealTotalKcal += parseFloat(ingredient.totalKcalConsumed);
      toSend.mealChoGrams += parseFloat(ingredient.choGrams);
      toSend.mealProGrams += parseFloat(ingredient.proGrams);
      toSend.mealFatGrams += parseFloat(ingredient.fatGrams);
    });

    await editMeal(toSend, { skip, take, uid });
    this.setState({
      currentEditingMeal: 'default',
      currentEditingIngredients: [],
      currentEditingIds: [],
      currentEditingName: null,
      foodSearched: null,
      mealTotalKcal: null,
      currentFoodEditing: { food: {} },
      currentFoodEditingIndex: null,
      gramsml: null,
      measure: null,
      deletedIngreds: []
    });
  }

  handleDeleteMeal = async () => {
    const { currentEditingMeal: { id: mealId } } = this.state;
    const { uid, deleteMeal } = this.props;

    await deleteMeal({ uid, mealId });
    this.setState({
      currentEditingMeal: 'default',
      currentEditingIngredients: [],
      currentEditingIds: [],
      currentEditingName: null,
      foodSearched: null,
      mealTotalKcal: null,
      currentFoodEditing: { food: {} },
      currentFoodEditingIndex: null,
      gramsml: null,
      measure: null,
      deletedIngreds: []
    });
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    const {
      currentSearched,
      currentEditingMeal,
      confirmedSearch,
      currentEditingIngredients,
      currentEditingIds,
      foodSearched,
      mealTotalKcal,
      currentFoodEditing,
      measure,
      gramsml,
      currentEditingName
    } = this.state;

    const {
      meal,
      mealCount,
      searchedMeal,
      searchedMealCount,
      isFetching,
      isFetchingFood,
      hasSearched,
      showMealModal,
      showEditFoodModal,
      showNameModal,
      searchedFood,
      isDeleting
    } = this.props;

    return (
      <div className="meal">
        <div className="meal-body">

          <Modal
            title="Meal Name"
            visible={showNameModal}
            onCancel={this.handleNameMeal}
            footer={(
              <div className="button-container">
                <Button
                  type="primary"
                  onClick={this.handleEditSaveMeal}
                  disabled={isDeleting}
                >
                  {
                    isDeleting
                      ? <Icon type="loading" />
                      : 'Save'
                  }
                </Button>
              </div>
            )}
          >
            <div className="meal-name-input">
              <Input
                name="currentEditingName"
                placeholder="Please input meal name"
                value={currentEditingName}
                onChange={this.handleChange}
              />
            </div>
          </Modal>

          <Modal
            title={currentFoodEditing.food.filipinoName || currentFoodEditing.food.englishName}
            visible={showEditFoodModal}
            onCancel={this.closeFoodEdit}
            footer={[
              <div className="macro-update" key="macro-display">
                <div className="macro-one">
                  CHO
                  <div className="macro-one-value">
                    {`${(currentFoodEditing.food.choPerExchange
                      * currentFoodEditing.food.exchangePerMeasure
                      * measure).toFixed(2)}g`}
                  </div>
                </div>
                <div className="macro-one">
                  PRO
                  <div className="macro-one-value">
                    {`${(currentFoodEditing.food.proPerExchange
                      * currentFoodEditing.food.exchangePerMeasure
                      * measure).toFixed(2)}g`}
                  </div>
                </div>
                <div className="macro-one">
                  FAT
                  <div className="macro-one-value">
                    {`${(currentFoodEditing.food.fatPerExchange
                      * currentFoodEditing.food.exchangePerMeasure
                      * measure).toFixed(2)}g`}
                  </div>
                </div>
              </div>,
              <div className="macro-update" key="macro-kcal">
                <div className="total-kcal">
                  Total
                </div>
                <div className="total-kcal">
                  {`${(currentFoodEditing.food.exchangePerMeasure
                    * currentFoodEditing.food.directKcalPerMeasure
                    * measure).toFixed(2)}kcal`}
                </div>
              </div>,
              <div className="input-container" key="input-log">
                <div className="input-label">
                  Measure
                  <InputNumber
                    className="input-measure"
                    onChange={this.handleMeasureCart}
                    min={0}
                    type="number"
                    value={measure}
                  />
                </div>
                <div className="input-label">
                  OR
                </div>
                <div className="input-label">
                  {`${currentFoodEditing.gramsConsumed ? 'Grams' : 'ml'}`}
                  <InputNumber
                    className="input-measure"
                    min={0}
                    onChange={this.handleGramsMLCart}
                    type="number"
                    value={gramsml}
                  />
                </div>
                <div className="input-label submit-button">
                  <Button
                    type="primary"
                    onClick={this.handleEditIngredient}
                    disabled={parseFloat(currentFoodEditing.gramsConsumed
                     || currentFoodEditing.gramsConsumed) === gramsml}
                  >
                    <Icon type="check" />
                  </Button>
                </div>
              </div>
            ]}
          >
            <div className="label-container">
              <div className="label">
                {currentFoodEditing.food.food_englishName}
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
                {`${currentFoodEditing.food
                  ? currentFoodEditing.food.choPerExchange
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
                {`${currentFoodEditing.food
                  ? currentFoodEditing.food.proPerExchange
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
                {`${currentFoodEditing.food
                  ? currentFoodEditing.food.fatPerExchange
                  : null}g`
                }
              </div>
            </div>

            <Divider />

            <div className="info-row">
              <div className="macros">
                {`${
                  parseFloat(currentFoodEditing.gramsConsumed)
                    ? 'EP Weight'
                    : 'EP ML'
                }`}
              </div>
              <div className="macros-value">
                {`${currentFoodEditing.gramsConsumed
                  ? currentFoodEditing.food.gramsEPPerExchange
                  : currentFoodEditing.food.mlEPPerExchange
                }${
                  parseFloat(currentFoodEditing.gramsConsumed)
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
                {currentFoodEditing.food.servingMeasurement || 'N/A'}
              </div>
            </div>
          </Modal>


          <Modal
            className="meal-modal"
            title="Edit meal"
            visible={showMealModal}
            onCancel={this.closeMealEdit}
            footer={(
              <div className="meal-footer">
                <div className="button-container">
                  <Button
                    type="danger"
                    onClick={this.handleDeleteMeal}
                  >
                    {
                      isDeleting
                        ? <Icon type="loading" />
                        : <Icon type="delete" />
                    }
                  </Button>
                </div>
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
                    disabled={!currentEditingIngredients.length
                      || parseFloat(currentEditingMeal.mealTotalKcal) === mealTotalKcal
                    }
                    onClick={this.handleNameMeal}
                  >
                    Save
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
                    .filter(food => !currentEditingIds.includes(food.food_id))
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
                  isFetchingFood ? (
                    <Input suffix={<Icon type="loading" />} />
                  ) : (
                    <Input suffix={<span />} />
                  )
                }
              </AutoComplete>
              <div className="meal-cart">
                <div className="cart-title">
                  {`Foods - ${mealTotalKcal}kcal`}
                </div>
                <div className="cart-body">
                  {
                    currentEditingIngredients.length ? (
                      currentEditingIngredients.map((ingredient, index) => (
                        <div key={ingredient.food.id} className="cart-row">
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
                          <div className="cart-row-right">
                            <div className="icon-container">
                              <Icon
                                className="action-icon"
                                onClick={() => this.handleEditFromCart(index)}
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
                    ) : (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )
                  }
                </div>

              </div>
            </div>
          </Modal>

          <Search
            className="search"
            enterButton
            placeholder="Search for created meals"
            onSearch={this.handleSearch}
            onChange={this.handleSearchChange}
            value={currentSearched}
          />
          <Row gutter={24}>
            {
              searchedMealCount && !isFetching ? (
                <div className="showing">
                  {`SHOWING ${searchedMealCount} RESULT/S FOR "${confirmedSearch}"` }
                </div>
              ) : !(hasSearched || isFetching) && (
                <div className="showing">
                  {mealCount === null || mealCount === 0
                    ? 'You have not created a meal'
                    : `SHOWING ${mealCount} MEALS`
                  }
                </div>
              )
            }
            {
              isFetching && (
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
              searchedMeal.length && !isFetching ? (
                searchedMeal.map((mealElement, index) => (
                  <Col
                    key={mealElement.id}
                    className="food-col"
                    xs={24}
                    md={8}
                    lg={6}
                  >
                    <Card
                      className="food-card"
                      hoverable
                      loading={isFetching}
                      title={(
                        <div className="title-container">
                          <div className="food-title">
                            {mealElement.mealName}
                          </div>
                          <div className="food-title">
                            <Icon
                              className="action-icon"
                              onClick={() => this.showMealEdit(index, true)}
                              theme="filled"
                              type="edit"
                            />
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
              ) : !(hasSearched || isFetching) && (
                meal.map((mealElement, index) => (
                  <Col
                    key={mealElement.id}
                    className="food-col"
                    xs={24}
                    md={8}
                    lg={6}
                  >
                    <Card
                      className="food-card"
                      hoverable
                      loading={isFetching}
                      title={(
                        <div className="title-container">
                          <div className="food-title">
                            {mealElement.mealName}
                          </div>
                          <div className="food-title">
                            <Icon
                              className="action-icon"
                              onClick={() => this.showMealEdit(index, false)}
                              theme="filled"
                              type="edit"
                            />
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
              )
            }
          </Row>
        </div>
      </div>
    );
  }
}

export default Meal;
