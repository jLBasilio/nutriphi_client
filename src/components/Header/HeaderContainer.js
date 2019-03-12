import { connect } from 'react-redux';
import Header from '.';

import { toggleDrawer } from './duck';
import { logout } from '../Login/duck';
import { toggleCalendar } from '../Home/duck';

const mapStateToProps = (state) => {
  const { showDrawer } = state.header;
  const { user } = state.login;
  const { showCalendar } = state.home;
  return {
    showDrawer,
    user,
    showCalendar
  };
};


const mapDispatchToProps = dispatch => ({
  toggleDrawer: () => {
    dispatch(toggleDrawer());
  },
  logout: () => {
    dispatch(logout());
  },
  toggleCalendar: () => {
    dispatch(toggleCalendar());
  }
});

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
export default HeaderContainer;
