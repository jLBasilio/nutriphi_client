import { connect } from 'react-redux';
import Food from '.';

import {
  getFoodClass,
  searchFood,
  resetSearch,
  toggleModal,
  getFavoriteIds,
  fetchFavorites,
  addToFavorites,
  deleteFromFavorites,
  searchFavorites
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
    hasSearched,
    isAddingToFavorites
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
    hasSearched,
    isAddingToFavorites
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
  addToFavorites: ({ uid, foodId }) => {
    dispatch(addToFavorites({ uid, foodId }));
  },
  deleteFromFavorites: ({ uid, foodId }) => {
    dispatch(deleteFromFavorites({ uid, foodId }));
  },
  searchFood: ({
    skip, take, q, foodClass
  }) => {
    dispatch(searchFood({
      skip, take, q, foodClass
    }));
  },
  searchFavorites: ({
    skip, take, q, uid
  }) => {
    dispatch(searchFavorites({
      skip, take, q, uid
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
