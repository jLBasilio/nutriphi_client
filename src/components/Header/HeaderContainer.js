import { connect } from 'react-redux';
import Header from '.';

import { toggleDrawer } from './duck';
import { logout } from '../Login/duck';

const mapStateToProps = (state) => {
  const { showDrawer } = state.header;
  const { user } = state.login;
  return {
    showDrawer,
    user
  };
};


const mapDispatchToProps = dispatch => ({
  toggleDrawer: () => {
    dispatch(toggleDrawer());
  },
  logout: () => {
    dispatch(logout());
  }
});

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
export default HeaderContainer;
