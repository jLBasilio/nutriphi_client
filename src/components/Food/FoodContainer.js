import { connect } from 'react-redux';
import Food from '.';

import {
  getFoodClass,
  searchFood,
  resetSearch,
  toggleModal
} from './duck';
import { changePage } from '../Header/duck';

const mapStateToProps = (state) => {
  const { currentPage } = state.header;
  const {
    isFetching,
    food,
    foodCount,
    showModal,
    searchedFood,
    searchedFoodCount,
    hasSearched
  } = state.food;

  return {
    currentPage,
    isFetching,
    food,
    foodCount,
    showModal,
    searchedFood,
    searchedFoodCount,
    hasSearched
  };
};


const mapDispatchToProps = dispatch => ({
  changePage: (newPage) => {
    dispatch(changePage(newPage));
  },
  getFoodClass: ({ skip, take, foodClass }) => {
    dispatch(getFoodClass({ skip, take, foodClass }));
  },
  searchFood: ({
    skip, take, q, foodClass
  }) => {
    dispatch(searchFood({
      skip, take, q, foodClass
    }));
  },
  resetSearch: () => {
    dispatch(resetSearch());
  },
  toggleModal: () => {
    dispatch(toggleModal());
  }
});

const FoodContainer = connect(mapStateToProps, mapDispatchToProps)(Food);
export default FoodContainer;
