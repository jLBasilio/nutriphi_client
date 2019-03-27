import { connect } from 'react-redux';
import Login from '.';

import { login } from './duck';
import { changePage } from '../Header/duck';

const mapStateToProps = (state) => {
  const { isLoggingIn, user } = state.login;
  return {
    isLoggingIn,
    user
  };
};


const mapDispatchToProps = dispatch => ({
  login: (credentials) => {
    dispatch(login(credentials));
  },
  changePage: (newPage) => {
    dispatch(changePage(newPage));
  }
});

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);
export default LoginContainer;
