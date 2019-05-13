import { connect } from 'react-redux';
import Profile from '.';

import { changePage } from '../Header/duck';
import { getSession } from '../Login/duck';
import {
  toggleHealthEdit,
  toggleGoalEdit,
  healthEdit,
  fetchProgress,
  fetchClassDist,
  fetchWeight,
  setTime,
  toggleGoalConfirm
} from './duck';

const mapStateToProps = (state) => {
  const { user, isFetchingUser } = state.login;
  const {
    showHealthEdit,
    showGoalEdit,
    isEditing,
    dayProgress,
    classDist,
    healthButtonDisabled,
    goalButtonDisabled,
    showGoalConfirm,
    weightHist,
    weeksLeft,
    daysLeft
  } = state.profile;
  const { dateToday } = state.home;
  return {
    user,
    showHealthEdit,
    showGoalEdit,
    isEditing,
    dayProgress,
    dateToday,
    classDist,
    healthButtonDisabled,
    goalButtonDisabled,
    isFetchingUser,
    showGoalConfirm,
    weightHist,
    weeksLeft,
    daysLeft
  };
};

const mapDispatchToProps = dispatch => ({
  changePage: (newPage) => {
    dispatch(changePage(newPage));
  },
  fetchProgress: (uid) => {
    dispatch(fetchProgress(uid));
  },
  fetchClassDist: (uid) => {
    dispatch(fetchClassDist(uid));
  },
  fetchWeight: (uid) => {
    dispatch(fetchWeight(uid));
  },
  getSession: () => {
    dispatch(getSession());
  },
  toggleHealthEdit: (toggle) => {
    dispatch(toggleHealthEdit(toggle));
  },
  toggleGoalEdit: (toggle) => {
    dispatch(toggleGoalEdit(toggle));
  },
  toggleGoalConfirm: (toggle) => {
    dispatch(toggleGoalConfirm(toggle));
  },
  healthEdit: (userInfo) => {
    dispatch(healthEdit(userInfo));
  },
  setTime: (time) => {
    dispatch(setTime(time));
  }
});

const ProfileContainer = connect(mapStateToProps, mapDispatchToProps)(Profile);
export default ProfileContainer;
