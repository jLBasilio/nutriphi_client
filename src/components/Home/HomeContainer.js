import { connect } from 'react-redux';
import Home from '.';

import { logout } from '../Login/duck';
import { setPeriod } from '../Entry/duck';
import { changePage } from '../Header/duck';
import {
  fetchLogs,
  fetchPeriod,
  setTodayDate,
  changeDate,
  toggleEditModal,
  toggleDeleteModal,
  editLog,
  deleteLog,
  setPeriodEditing,
  toggleMealModal
} from './duck';
import {
  addToFavorites,
  deleteFromFavorites,
  getFavoriteIds,
  searchRaw,
  resetSearch
} from '../Food/duck';


const mapStateToProps = (state) => {
  const { user } = state.login;
  const {
    searchedFood,
    favFoodIds,
    isAddingToFavorites,
    isFetching
  } = state.food;
  const {
    isFetchingLogs,
    userLogs,
    breakfast,
    lunch,
    dinner,
    dateToday,
    dateSelected,
    showEditModal,
    isEditing,
    showDeleteModal,
    isDeleting,
    showCreateMealModal
  } = state.home;

  return {
    isFetchingLogs,
    userLogs,
    breakfast,
    lunch,
    dinner,
    user,
    dateToday,
    dateSelected,
    showEditModal,
    isEditing,
    showDeleteModal,
    isDeleting,
    favFoodIds,
    isAddingToFavorites,
    showCreateMealModal,
    searchedFood,
    isFetching
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => {
    dispatch(logout());
  },
  setPeriod: (period) => {
    dispatch(setPeriod(period));
  },
  changePage: (newPage) => {
    dispatch(changePage(newPage));
  },
  setTodayDate: (date) => {
    dispatch(setTodayDate(date));
  },
  changeDate: (date) => {
    dispatch(changeDate(date));
  },
  toggleEditModal: () => {
    dispatch(toggleEditModal());
  },
  toggleDeleteModal: () => {
    dispatch(toggleDeleteModal());
  },
  toggleMealModal: () => {
    dispatch(toggleMealModal());
  },
  editLog: (logInfo) => {
    dispatch(editLog(logInfo));
  },
  deleteLog: (logInfo) => {
    dispatch(deleteLog(logInfo));
  },
  fetchLogs: ({ userId, date }) => {
    dispatch(fetchLogs({ userId, date }));
  },
  fetchPeriod: ({ userId, date, period }) => {
    dispatch(fetchPeriod({ userId, date, period }));
  },
  setPeriodEditing: (period) => {
    dispatch(setPeriodEditing(period));
  },
  addToFavorites: ({ uid, foodId }) => {
    dispatch(addToFavorites({ uid, foodId }));
  },
  deleteFromFavorites: ({ uid, foodId }) => {
    dispatch(deleteFromFavorites({ uid, foodId }));
  },
  getFavoriteIds: (uid) => {
    dispatch(getFavoriteIds(uid));
  },
  searchRaw: ({ q, foodClass }) => {
    dispatch(searchRaw({ q, foodClass }));
  },
  resetSearch: () => {
    dispatch(resetSearch());
  }
});

const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home);
export default HomeContainer;
