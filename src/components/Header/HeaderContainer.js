import { connect } from 'react-redux';
import Header from '.';

import { toggleDrawer, changePage } from './duck';
import { logout } from '../Login/duck';
import {
  toggleCalendar,
  changeDate,
  fetchLogs
} from '../Home/duck';

const mapStateToProps = (state) => {
  const { showDrawer, currentPage } = state.header;
  const { user } = state.login;
  const { showCalendar, dateToday, dateSelected } = state.home;
  return {
    showDrawer,
    user,
    showCalendar,
    currentPage,
    dateToday,
    dateSelected
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
  },
  changeDate: (date) => {
    dispatch(changeDate(date));
  },
  fetchLogs: ({
    userId, date, skip, take
  }) => {
    dispatch(fetchLogs({
      userId, date, skip, take
    }));
  }
});

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
export default HeaderContainer;
