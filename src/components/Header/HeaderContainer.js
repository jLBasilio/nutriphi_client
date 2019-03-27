import { connect } from 'react-redux';
import Header from '.';

import { toggleDrawer, changePage } from './duck';
import { logout } from '../Login/duck';
import { toggleCalendar } from '../Home/duck';

const mapStateToProps = (state) => {
  const { showDrawer, currentPage } = state.header;
  const { user } = state.login;
  const { showCalendar } = state.home;
  return {
    showDrawer,
    user,
    showCalendar,
    currentPage
  };
};


const mapDispatchToProps = dispatch => ({
  toggleDrawer: () => {
    dispatch(toggleDrawer());
  },
  changePage: (newPage) => {
    dispatch(changePage(newPage));
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
