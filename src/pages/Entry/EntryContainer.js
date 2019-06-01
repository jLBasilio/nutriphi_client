import { connect } from 'react-redux';
import Entry from '.';

import {
  resetSearch,
  searchFood,
  setPeriod,
  toggleModal,
  addToLog,
  toggleMealModal,
  addMeal,
  searchFavorites
} from './duck';
import { changePage } from '../Header/duck';
import {
  searchMeal,
  resetSearch as resetMealSearch,
  fetchMeal
} from '../Meal/duck';
import {
  addToFavorites,
  deleteFromFavorites,
  fetchFavorites
} from '../Food/duck';

const mapStateToProps = (state) => {
  const {
    period,
    searchedFood,
    searchedFoodCount,
    isFetching,
    hasSearched,
    showModal,
    isAddingLog,
    showMealModal
  } = state.entry;
  const {
    meal,
    searchedMeal,
    isFetching: isFetchingMeal,
    searchedMealCount
  } = state.meal;
  const { user: { id: user } } = state.login;
  const { dateSelected } = state.home;
  const {
    favFoodIds,
    isAddingToFavorites,
    food,
    isFetching: isFetchingFood
  } = state.food;

  return {
    period,
    searchedFood,
    searchedFoodCount,
    isFetching,
    isFetchingMeal,
    hasSearched,
    showModal,
    isAddingLog,
    user,
    dateSelected,
    favFoodIds,
    isAddingToFavorites,
    searchedMeal,
    searchedMealCount,
    showMealModal,
    food,
    meal,
    isFetchingFood
  };
};

const mapDispatchToProps = dispatch => ({
  setPeriod: (period) => {
    dispatch(setPeriod(period));
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
  searchMeal: (qInfo) => {
    dispatch(searchMeal(qInfo));
  },
  resetMealSearch: () => {
    dispatch(resetMealSearch());
  },
  addToLog: (foodInfo) => {
    dispatch(addToLog(foodInfo));
  },
  addMeal: (logs) => {
    dispatch(addMeal(logs));
  },
  addToFavorites: ({ uid, foodId }) => {
    dispatch(addToFavorites({ uid, foodId }));
  },
  deleteFromFavorites: ({ uid, foodId }) => {
    dispatch(deleteFromFavorites({ uid, foodId }));
  },
  changePage: (newPage) => {
    dispatch(changePage(newPage));
  },
  fetchMeal: ({ skip, take, uid }) => {
    dispatch(fetchMeal({ skip, take, uid }));
  },
  fetchFavorites: ({ skip, take, uid }) => {
    dispatch(fetchFavorites({ skip, take, uid }));
  },
  resetSearch: () => {
    dispatch(resetSearch());
  },
  toggleModal: () => {
    dispatch(toggleModal());
  },
  toggleMealModal: () => {
    dispatch(toggleMealModal());
  }
});

const EntryContainer = connect(mapStateToProps, mapDispatchToProps)(Entry);
export default EntryContainer;
