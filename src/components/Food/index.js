import React, { Component } from 'react';
import {
  Card,
  Col,
  Divider,
  Icon,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Tag,
  Tooltip
} from 'antd';
import './food.scss';

import * as constants from '../../constants';

const { Search } = Input;

class Food extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skip: 0,
      take: 16,
      defaultSize: 16,
      currentFood: 'default',
      previousSearched: null,
      currentSearched: null,
      confirmedSearch: null,
      currentPageNumber: 1
    };
  }

  componentDidMount() {
    const {
      changePage,
      getFoodClass,
      toFetch,
      title,
      resetSearch,
      uid,
      getFavoriteIds,
      fetchFavorites
    } = this.props;
    const { skip, take } = this.state;

    changePage(title);
    resetSearch();
    getFavoriteIds(uid);

    if (toFetch === 'favorites') {
      fetchFavorites({ skip, take, uid });
    } else {
      getFoodClass({ skip, take, foodClass: toFetch });
    }
  }

  componentDidUpdate(previousProps) {
    const { title, resetSearch } = this.props;
    if (title !== previousProps.title) {
      const {
        changePage,
        getFoodClass,
        toFetch,
        uid,
        fetchFavorites
      } = this.props;

      const { skip, take } = this.state;

      changePage(title);
      resetSearch();
      if (toFetch === 'favorites') {
        fetchFavorites({ skip, take, uid });
      } else {
        getFoodClass({ skip, take, foodClass: toFetch });
      }
      this.setState({ currentSearched: null });
    }
  }

  showFoodModal = (foodIndex, fromSearch) => {
    const { toggleModal } = this.props;
    if (fromSearch) {
      const { searchedFood } = this.props;
      this.setState({ currentFood: searchedFood[foodIndex] });
    } else {
      const { food } = this.props;
      this.setState({ currentFood: food[foodIndex] });
    }
    toggleModal();
  }

  handleModalClose = () => {
    const { toggleModal } = this.props;
    toggleModal();
  }

  handlePageChange = (page) => {
    const {
      getFoodClass,
      toFetch,
      fetchFavorites,
      uid
    } = this.props;
    const { defaultSize, take } = this.state;
    const skip = (page - 1) * defaultSize;

    this.setState({ currentPageNumber: page });
    if (toFetch === 'favorites') {
      fetchFavorites({ skip, take, uid });
    } else {
      getFoodClass({ skip, take, foodClass: toFetch });
    }
  }

  handlePageChangeFromSearch = (page) => {
    const {
      searchFood,
      toFetch,
      searchFavorites,
      uid
    } = this.props;
    const { defaultSize, take, currentSearched } = this.state;
    const skip = (page - 1) * defaultSize;

    if (toFetch === 'favorites') {
      searchFavorites({
        skip, take, q: currentSearched, uid
      });
    } else {
      searchFood({
        skip, take, q: currentSearched, foodClass: toFetch
      });
    }
  }

  handleSearch = (q) => {
    const { previousSearched } = this.state;
    if (!q.length) {
      message.error('Input something!', 4);
    } else if (q !== previousSearched && q.length > 2) {
      const {
        searchFood,
        searchFavorites,
        toFetch,
        resetSearch,
        uid
      } = this.props;
      const { skip, take } = this.state;
      resetSearch();

      if (toFetch === 'favorites') {
        searchFavorites({
          skip, take, q, uid
        });
      } else {
        searchFood({
          skip, take, q, foodClass: toFetch
        });
      }

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

  handleFavorite = (foodId) => {
    const { favFoodIds } = this.props;

    if (favFoodIds.includes(foodId)) {
      const { deleteFromFavorites, uid } = this.props;
      deleteFromFavorites({ uid, foodId });
    } else {
      const { addToFavorites, uid } = this.props;
      addToFavorites({ uid, foodId });
    }
  }

  render() {
    const {
      food,
      favFoodIds,
      foodCount,
      searchedFood,
      searchedFoodCount,
      isFetching,
      showModal,
      hasSearched,
      toFetch,
      isAddingToFavorites
    } = this.props;

    const {
      defaultSize,
      currentFood,
      currentSearched,
      confirmedSearch,
      currentPageNumber
    } = this.state;

    return (
      <div className="food">
        <div className="food-body">
          <Search
            className="search"
            enterButton
            placeholder={`Search for foods under ${toFetch}`}
            onSearch={this.handleSearch}
            onChange={this.handleSearchChange}
            value={currentSearched}
          />
          <Row gutter={24}>
            {
              searchedFoodCount && !isFetching ? (
                <div className="showing">
                  {`SHOWING ${searchedFoodCount} RESULT/S FOR "${confirmedSearch}"` }
                </div>
              ) : !(hasSearched || isFetching) && (
                <div className="showing">
                  {`SHOWING ${foodCount} ITEMS UNDER ${toFetch.toUpperCase()}` }
                </div>
              )
            }

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
              ) : hasSearched && !searchedFoodCount ? (
                <div className="pagination-div">
                  {`NO RESULTS FOR "${confirmedSearch}"`}
                </div>
              ) : !isFetching && (
                <div className="pagination-div">
                  <Pagination
                    className="pagination"
                    current={currentPageNumber}
                    pageSize={defaultSize}
                    total={foodCount}
                    hideOnSinglePage
                    size="small"
                    onChange={this.handlePageChange}
                  />
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
                      onClick={() => this.showFoodModal(index, true)}
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
              ) : !(hasSearched || isFetching) && (
                food.map((foodElement, index) => (
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
                      onClick={() => this.showFoodModal(index, false)}
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
              )
            }
          </Row>
          <Modal
            className="food-modal"
            title={currentFood.food_filipinoName || currentFood.food_englishName}
            visible={showModal}
            onCancel={this.handleModalClose}
            footer={null}
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
                    <Tooltip
                      title={
                        favFoodIds.includes(currentFood.food_id)
                          ? 'Unfavorite'
                          : 'Set as favorite'
                      }
                    >
                      <span>
                        <Icon
                          className="fav-icon"
                          type="heart"
                          theme={favFoodIds.includes(currentFood.food_id) ? 'filled' : null}
                          onClick={() => this.handleFavorite(currentFood.food_id)}
                        />
                      </span>
                    </Tooltip>
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
                Carbohydrate
              </div>
              <div className="macros-value">
                {`${currentFood.food_choPerExchange}g`}
              </div>
            </div>

            <Divider />

            <div className="info-row">
              <div className="macros">
                Protein
              </div>
              <div className="macros-value">
                {`${currentFood.food_proPerExchange}g`}
              </div>
            </div>

            <Divider />

            <div className="info-row">
              <div className="macros">
                Fat
              </div>
              <div className="macros-value">
                {`${currentFood.food_fatPerExchange}g`}
              </div>
            </div>

            <Divider />

            <div className="info-row">
              <div className="macros">
                {`${
                  parseInt(currentFood.food_gramsEPPerExchange, 10)
                    ? 'EP Weight'
                    : 'EP ML'
                }`}
              </div>
              <div className="macros-value">
                {`${
                  parseInt(currentFood.food_gramsEPPerExchange, 10)
                    ? currentFood.food_gramsEPPerExchange
                    : currentFood.food_mlEPPerExchange
                }${
                  parseInt(currentFood.food_gramsEPPerExchange, 10)
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
                {currentFood.food_servingMeasurement}
              </div>
            </div>
            <Divider />
          </Modal>
        </div>
      </div>
    );
  }
}

export default Food;
