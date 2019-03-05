import { connect } from 'react-redux';
import Login from '.';

import { login } from './duck';

const mapStateToProps = (state) => {
  const { isLoggingIn, user } = state.login;
  return {
    isLoggingIn,
    user
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    }
  };
};

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);
export default LoginContainer;
