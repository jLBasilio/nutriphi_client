import { connect } from 'react-redux';
import Food from '.';

import {
  getFoodClass,
  searchFood,
  resetSearch,
  toggleModal,
  getFavoriteIds,
  fetchFavorites
} from './duck';
import { changePage } from '../Header/duck';

const mapStateToProps = (state) => {
  const { currentPage } = state.header;
  const { user: { id: uid } } = state.login;
  const {
    isFetching,
    food,
    favFoodIds,
    foodCount,
    showModal,
    searchedFood,
    searchedFoodCount,
    hasSearched
  } = state.food;

  return {
    uid,
    currentPage,
    isFetching,
    food,
    favFoodIds,
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
  getFavoriteIds: (uid) => {
    dispatch(getFavoriteIds(uid));
  },
  fetchFavorites: ({ skip, take, uid }) => {
    dispatch(fetchFavorites({ skip, take, uid }));
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
