import { connect } from 'react-redux';
import App from '.';

import { login, getSession } from '../pages/Login/duck';

const mapStateToProps = (state) => {
  const {
    user,
    isLoggingIn,
    isLoggingOut,
    isGettingSession
  } = state.login;
  return {
    user,
    isLoggingIn,
    isLoggingOut,
    isGettingSession
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    },
    getSession: () => {
      dispatch(getSession());
    }
  };
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
export default AppContainer;
