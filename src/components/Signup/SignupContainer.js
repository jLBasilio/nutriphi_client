import { connect } from 'react-redux';
import Signup from '.';

import {
  confirmSignup,
  getDBW,
  signup,
  toggleModal,
  checkExistingUser
} from './duck';

const mapStateToProps = (state) => {
  const {
    dbwKg,
    dbwLbs,
    isCheckingExisting,

    isConfirming,
    isSigningUp,
    choPerDay,
    proPerDay,
    fatPerDay
  } = state.signup;

  return {
    dbwKg,
    dbwLbs,
    isCheckingExisting,

    isConfirming,
    isSigningUp,
    choPerDay,
    proPerDay,
    fatPerDay
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
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
    }
  };
};

const SignupContainer = connect(mapStateToProps, mapDispatchToProps)(Signup);
export default SignupContainer;
