import { connect } from 'react-redux';
import Profile from '.';

import { changePage } from '../Header/duck';

const mapStateToProps = (state) => {
  const { user } = state.login;
  return {
    user
  };
};


const mapDispatchToProps = dispatch => ({
  changePage: (newPage) => {
    dispatch(changePage(newPage));
  }
});

const ProfileContainer = connect(mapStateToProps, mapDispatchToProps)(Profile);
export default ProfileContainer;
