import React, { Component } from 'react';
import {
  Card,
  Col,
  Divider,
  Modal,
  Pagination,
  Row,
  Tag
} from 'antd';
import './food.scss';

const emptyCards = [...'abcdefghijkl'];
const tagColors = {
  all: '#fff',
  vegetable: 'green',
  fruit: 'purple',
  rice: 'orange',
  milk: 'cyan',
  meat: 'red',
  sugar: 'magenta',
  fat: 'volcano',
  free: 'blue',
  beverage: 'lime'
};


class Food extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skip: 0,
      take: 16,
      defaultSize: 16,
      currentFood: 'default',
      foodCount: 16
    };
  }

  componentDidMount() {
    const {
      changePage,
      getFoodClass,
      toFetch,
      foodCount,
      title
    } = this.props;
    const { skip, take } = this.state;
    changePage(title);

    // Fetch food
    if (toFetch === 'all') {
      getFoodClass({ skip, take });
      this.setState({ foodCount });
    } else {
      getFoodClass({ skip, take, foodClass: toFetch });
      this.setState({ foodCount });
    }
  }

  componentDidUpdate(previousProps) {
    const { title } = this.props;
    if (title !== previousProps.title) {
      const {
        changePage,
        getFoodClass,
        toFetch,
        foodCount
      } = this.props;

      const { skip, take } = this.state;
      changePage(title);

      // Fetch food
      if (toFetch === 'all') {
        getFoodClass({ skip, take });
        this.setState({ foodCount });
      } else {
        getFoodClass({ skip, take, foodClass: toFetch });
        this.setState({ foodCount });
      }
    }
  }

  showFoodModal = (foodIndex) => {
    const { food, toggleModal } = this.props;
    toggleModal();
    this.setState({ currentFood: food[foodIndex] });
  }

  handleModalClose = () => {
    const { toggleModal } = this.props;
    toggleModal();
  }

  handlePageChange = (page) => {
    const { getFoodClass, toFetch } = this.props;
    const { defaultSize, take } = this.state;
    const skip = (page - 1) * defaultSize;

    if (toFetch === 'all') {
      getFoodClass({ skip, take });
    } else {
      getFoodClass({ skip, take, foodClass: toFetch });
    }
  }


  render() {
    const {
      food,
      isFetching,
      showModal
    } = this.props;

    const { defaultSize, currentFood, foodCount } = this.state;
    return (
      <div className="food">
        <div className="food-body">
          <Row gutter={24}>
            {
              isFetching ? (
                emptyCards.map(element => (
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
              ) : (
                food.map((foodElement, index) => (
                  <Col
                    key={foodElement.id}
                    className="food-col"
                    xs={24}
                    md={8}
                    lg={6}
                  >
                    <Card
                      className="food-card"
                      title={
                        foodElement.filipinoName
                          ? foodElement.filipinoName
                          : foodElement.englishName
                      }
                      hoverable
                      loading={isFetching}
                      onClick={() => this.showFoodModal(index)}
                    >
                      <Tag
                        color={
                          tagColors[foodElement.primaryClassification.split('-')[0]]
                        }
                      >
                        {foodElement.primaryClassification.split('-')[0]}
                      </Tag>
                      {
                        foodElement.secondaryClassification ? (
                          <Tag
                            color={tagColors[foodElement.secondaryClassification]}
                          >
                            {foodElement.secondaryClassification}
                          </Tag>
                        ) : null
                      }
                    </Card>
                  </Col>
                ))
              )
            }
          </Row>

          <div className="pagination-div">
            <Pagination
              className="pagination"
              pageSize={defaultSize}
              total={foodCount}
              hideOnSinglePage
              size="small"
              onChange={this.handlePageChange}
            />
          </div>
          <Modal
            title={
              currentFood.filipinoName
                ? currentFood.filipinoName
                : currentFood.englishName
            }
            visible={showModal}
            onCancel={this.handleModalClose}
            onOk={this.handleModalClose}
          >

            <div className="label-container">
              <div className="label-title">
                Other Term
              </div>
              <div className="label">
                {
                  currentFood.filipinoName ? (
                    currentFood.englishName ? (
                      currentFood.englishName
                    ) : 'N/A'
                  ) : 'N/A'
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
                {`${currentFood.choPerExchange}g`}
              </div>
            </div>

            <Divider />
            <div className="info-row">
              <div className="macros">
                Protein
              </div>
              <div className="macros-value">
                {`${currentFood.proPerExchange}g`}
              </div>
            </div>

            <Divider />
            <div className="info-row">
              <div className="macros">
                Fat
              </div>
              <div className="macros-value">
                {`${currentFood.fatPerExchange}g`}
              </div>
            </div>

            <Divider />
            <div className="info-row">
              <div className="macros">
                EP Weight
              </div>
              <div className="macros-value">
                {`${currentFood.gramsEPPerExchange}g`}
              </div>
            </div>

            <Divider />
            <div className="info-row">
              <div className="macros">
                Measurement
              </div>
              <div className="macros-value">
                {currentFood.servingMeasurement}
              </div>
            </div>

          </Modal>
        </div>
      </div>
    );
  }
}

export default Food;
