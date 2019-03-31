import { connect } from 'react-redux';
import Food from '.';

import {
  getFoodClass,
  toggleModal
} from './duck';
import { changePage } from '../Header/duck';

const mapStateToProps = (state) => {
  const { currentPage } = state.header;
  const {
    isFetching,
    food,
    showModal
  } = state.food;

  return {
    currentPage,
    isFetching,
    food,
    showModal
  };
};


const mapDispatchToProps = dispatch => ({
  changePage: (newPage) => {
    dispatch(changePage(newPage));
  },
  getFoodClass: ({ skip, take, foodClass }) => {
    dispatch(getFoodClass({ skip, take, foodClass }));
  },
  toggleModal: () => {
    dispatch(toggleModal());
  }
});

const FoodContainer = connect(mapStateToProps, mapDispatchToProps)(Food);
export default FoodContainer;
