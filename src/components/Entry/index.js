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
  Row,
  Tag
} from 'antd';
import './entry.scss';

import * as constants from '../../constants';
import * as pageTitles from '../../constants/pages';
import * as dateUtil from '../../utils/date.util';

const { Search } = Input;

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
      measure: 1,
      gramsml: null
    };
  }

  componentDidMount() {
    const {
      changePage,
      resetSearch
    } = this.props;
    changePage(pageTitles.ENTRY);
    resetSearch();
  }

  handleSearch = (q) => {
    const { previousSearched } = this.state;
    if (!q.length) {
      message.error('Input something', 4);
    } else if (q !== previousSearched && q.length > 2) {
      const { searchFood } = this.props;
      const { skip, take } = this.state;
      searchFood({
        skip, take, q, foodClass: 'all'
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
        confirmedSearch: null
      });
      resetSearch();
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

  render() {
    const {
      searchedFood,
      searchedFoodCount,
      isFetching,
      isAddingLog,
      hasSearched,
      showModal,
      period
    } = this.props;

    const {
      defaultSize,
      currentFood,
      currentSearched,
      confirmedSearch,
      measure,
      gramsml
    } = this.state;

    return (
      <div className="entry">
        <div className="entry-body">
          <div className="search-add">
            {`Add food to logs (${period.toUpperCase()})`}
          </div>

          <Search
            className="search"
            enterButton
            placeholder="Search food to add"
            onSearch={this.handleSearch}
            onChange={this.handleSearchChange}
            value={currentSearched}
          />
          <Row gutter={24}>
            {
              searchedFoodCount && (
                <div className="showing">
                  {`SHOWING ${searchedFoodCount} RESULT/S FOR "${confirmedSearch}"` }
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
                      title={foodElement.food_filipinoName || foodElement.food_englishName}
                      hoverable
                      loading={isFetching}
                      onClick={() => this.showFoodModal(index)}
                    >
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
                            color={constants.tagColors[foodElement.food_secondaryClassification]}
                          >
                            {foodElement.food_secondaryClassification}
                          </Tag>
                        )
                      }
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
            title={currentFood.food_filipinoName || currentFood.food_englishName}
            visible={showModal}
            onCancel={this.handleModalClose}
            footer={[
              <div className="macro-update" key="macro-display">
                <div className="macro-one">
                  {`CHO: ${parseFloat((currentFood.food_choPerExchange * measure).toFixed(2))}g`}
                </div>
                <div className="macro-one">
                  {`CHO: ${parseFloat((currentFood.food_proPerExchange * measure).toFixed(2))}g`}
                </div>
                <div className="macro-one">
                  {`CHO: ${parseFloat((currentFood.food_fatPerExchange * measure).toFixed(2))}g`}
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
                <div className="or-between">
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
                {currentFood.food_englishName || 'N/A'}
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
                {currentFood.food_servingMeasurement ? currentFood.food_servingMeasurement : 'N/A'}
              </div>
            </div>

          </Modal>
        </div>
      </div>
    );
  }
}

export default Entry;
