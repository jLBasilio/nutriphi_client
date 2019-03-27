import { connect } from 'react-redux';
import Food from '.';

import { getFoodClass, getFoodAll } from './duck';
import { changePage } from '../Header/duck';

const mapStateToProps = (state) => {
  const { currentPage } = state.header;
  const { isFetching, food } = state.food;
  return {
    currentPage,
    isFetching,
    food
  };
};


const mapDispatchToProps = dispatch => ({
  changePage: (newPage) => {
    dispatch(changePage(newPage));
  },
  getFoodClass: ({ skip, take, foodClass }) => {
    dispatch(getFoodClass({ skip, take, foodClass }));
  },
  getFoodAll: ({ skip, take }) => {
    dispatch(getFoodAll({ skip, take }));
  }
});

const FoodContainer = connect(mapStateToProps, mapDispatchToProps)(Food);
export default FoodContainer;
