import { connect } from 'react-redux';
import Food from '.';

import {
  getFoodClass,
  getFoodCount,
  toggleModal
} from './duck';
import { changePage } from '../Header/duck';

const mapStateToProps = (state) => {
  const { currentPage } = state.header;
  const {
    isFetching,
    food,
    showModal,
    foodCount
  } = state.food;

  return {
    currentPage,
    isFetching,
    food,
    showModal,
    foodCount
  };
};


const mapDispatchToProps = dispatch => ({
  changePage: (newPage) => {
    dispatch(changePage(newPage));
  },
  getFoodClass: ({ skip, take, foodClass }) => {
    dispatch(getFoodClass({ skip, take, foodClass }));
  },
  getFoodCount: (foodClass) => {
    dispatch(getFoodCount(foodClass));
  },
  toggleModal: () => {
    dispatch(toggleModal());
  }
});

const FoodContainer = connect(mapStateToProps, mapDispatchToProps)(Food);
export default FoodContainer;
