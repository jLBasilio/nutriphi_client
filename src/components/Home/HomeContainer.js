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
  setPeriodEditing
} from './duck';

const mapStateToProps = (state) => {
  const { user } = state.login;
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
    isDeleting
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
    isDeleting
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
  }
});

const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home);
export default HomeContainer;
