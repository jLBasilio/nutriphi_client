import { connect } from 'react-redux';
import Profile from '.';

import { changePage } from '../Header/duck';
import {
  toggleHealthEdit,
  toggleGoalEdit,
  healthEdit
} from './duck';

const mapStateToProps = (state) => {
  const { user } = state.login;
  const {
    showHealthEdit,
    showGoalEdit,
    isSaving
  } = state.profile;
  return {
    user,
    showHealthEdit,
    showGoalEdit,
    isSaving
  };
};

const mapDispatchToProps = dispatch => ({
  changePage: (newPage) => {
    dispatch(changePage(newPage));
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
