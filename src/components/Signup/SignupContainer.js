import { connect } from 'react-redux';
import Signup from '.';

import {
  confirmSignup,
  getDBW,
  signup,
  toggleModal,
  checkExistingUser
} from './duck';

import { changePage } from '../Header/duck';

const mapStateToProps = (state) => {
  const {
    dbwKg,
    dbwLbs,
    isCheckingExisting,

    isConfirming,
    isSigningUp,
    choPerDay,
    proPerDay,
    fatPerDay,

    showConfirmModal,
    successSigningUp

  } = state.signup;

  return {
    dbwKg,
    dbwLbs,
    isCheckingExisting,

    isConfirming,
    isSigningUp,
    choPerDay,
    proPerDay,
    fatPerDay,

    showConfirmModal,
    successSigningUp
  };
};


const mapDispatchToProps = dispatch => ({
  getDBW: (userInfo) => {
    dispatch(getDBW(userInfo));
  },
  toggleModal: () => {
    dispatch(toggleModal());
  },
  signup: (userInfo) => {
    dispatch(signup(userInfo));
  },
  confirmSignup: (credentials) => {
    dispatch(confirmSignup(credentials));
  },
  checkExistingUser: (credentials) => {
    dispatch(checkExistingUser(credentials));
  },
  changePage: (newPage) => {
    dispatch(changePage(newPage));
  }
});

const SignupContainer = connect(mapStateToProps, mapDispatchToProps)(Signup);
export default SignupContainer;
