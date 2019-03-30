import React, { Component } from 'react';
import {
  Card,
  Col,
  Modal,
  Pagination,
  Row
} from 'antd';
import './food.scss';

class Food extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skip: 0,
      take: 16,
      defaultSize: 16,
      currentFood: 'sad',
    };
  }

  componentDidMount() {
    const {
      changePage,
      getFoodClass,
      toFetch,
      getFoodCount,
      title
    } = this.props;
    const { skip, take } = this.state;
    changePage(title);

    // Fetch food
    if (toFetch === 'all') {
      getFoodClass({ skip, take });
      getFoodCount('');
    } else {
      getFoodClass({ skip, take, foodClass: toFetch });
      getFoodCount(toFetch);
    }
  }

  componentDidUpdate(previousProps) {
    const { title } = this.props;
    if (title !== previousProps.title) {
      const {
        changePage,
        getFoodClass,
        toFetch,
        getFoodCount
      } = this.props;

      const { skip, take } = this.state;
      changePage(title);

      // Fetch food
      if (toFetch === 'all') {
        getFoodClass({ skip, take });
        getFoodCount('');
      } else {
        getFoodClass({ skip, take, foodClass: toFetch });
        getFoodCount(toFetch);
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
      showModal,
      foodCount
    } = this.props;

    const { defaultSize, currentFood } = this.state;
    const emptyCards = [...'abcdefghijkl'];
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
                      extra={foodElement.primaryClassification.split('-')[0]}
                      loading={isFetching}
                      onClick={() => this.showFoodModal(index)}
                    >
                      Card content
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

            <div className="label">
              {
                currentFood.filipinoName ? (
                  currentFood.englishName ? (
                    currentFood.englishName
                  ) : 'N/A'
                ) : null
              }
            </div>

            <div className="macronuts">
              
            </div>

          </Modal>
        </div>
      </div>
    );
  }
}

export default Food;
