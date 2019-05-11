import { connect } from 'react-redux';
import Profile from '.';

import { changePage } from '../Header/duck';
import { getUser, getSession } from '../Login/duck';
import {
  toggleHealthEdit,
  toggleGoalEdit,
  healthEdit,
  fetchProgress,
  fetchClassDist
} from './duck';

const mapStateToProps = (state) => {
  const { user } = state.login;
  const {
    showHealthEdit,
    showGoalEdit,
    isEditing,
    dayProgress,
    classDist
  } = state.profile;
  const { dateToday } = state.home;
  return {
    user,
    showHealthEdit,
    showGoalEdit,
    isEditing,
    dayProgress,
    dateToday,
    classDist
  };
};

const mapDispatchToProps = dispatch => ({
  changePage: (newPage) => {
    dispatch(changePage(newPage));
  },
  getUser: (uid) => {
    dispatch(getUser(uid));
  },
  fetchProgress: (uid) => {
    dispatch(fetchProgress(uid));
  },
  fetchClassDist: (uid) => {
    dispatch(fetchClassDist(uid));
  },
  getSession: () => {
    dispatch(getSession());
  },
  toggleHealthEdit: () => {
    dispatch(toggleHealthEdit());
  },
  toggleGoalEdit: () => {
    dispatch(toggleGoalEdit());
  },
  healthEdit: (userInfo) => {
    dispatch(healthEdit(userInfo));
  }
});

const ProfileContainer = connect(mapStateToProps, mapDispatchToProps)(Profile);
export default ProfileContainer;
