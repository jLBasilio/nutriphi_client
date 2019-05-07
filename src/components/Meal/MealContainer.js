import { connect } from 'react-redux';
import Meal from '.';

import { changePage } from '../Header/duck';
import {
  fetchMeal,
  searchMeal,
  resetSearch,
  toggleMealModal,
  toggleEditFoodModal,
  toggleNameModal,
  editMeal,
  deleteMeal
} from './duck';
import {
  searchRaw,
  resetSearch as resetFoodSearch
} from '../Food/duck';

const mapStateToProps = (state) => {
  const { user: { id: uid } } = state.login;
  const { searchedFood, isFetching: isFetchingFood } = state.food;
  const {
    meal,
    mealCount,
    searchedMeal,
    searchedMealCount,
    isFetching,
    isDeleting,
    showMealModal,
    showEditFoodModal,
    hasSearched,
    showNameModal
  } = state.meal;

  return {
    uid,
    searchedFood,
    meal,
    mealCount,
    searchedMeal,
    searchedMealCount,
    isFetching,
    isDeleting,
    showMealModal,
    showEditFoodModal,
    hasSearched,
    isFetchingFood,
    showNameModal
  };
};

const mapDispatchToProps = dispatch => ({
  changePage: (newPage) => {
    dispatch(changePage(newPage));
  },
  fetchMeal: (uid) => {
    dispatch(fetchMeal(uid));
  },
  searchMeal: (qInfo) => {
    dispatch(searchMeal(qInfo));
  },
  editMeal: (mealInfo, meta) => {
    dispatch(editMeal(mealInfo, meta));
  },
  deleteMeal: ({ uid, mealId }) => {
    dispatch(deleteMeal({ uid, mealId }));
  },
  resetSearch: () => {
    dispatch(resetSearch());
  },
  toggleMealModal: () => {
    dispatch(toggleMealModal());
  },
  toggleNameModal: () => {
    dispatch(toggleNameModal());
  },
  toggleEditFoodModal: () => {
    dispatch(toggleEditFoodModal());
  },
  searchRaw: ({ q, foodClass }) => {
    dispatch(searchRaw({ q, foodClass }));
  },
  resetFoodSearch: () => {
    dispatch(resetFoodSearch());
  }
});

const MealContainer = connect(mapStateToProps, mapDispatchToProps)(Meal);
export default MealContainer;
