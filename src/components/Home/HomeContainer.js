import { connect } from 'react-redux';
import Home from '.';

import { logout } from '../Login/duck';
import { setPeriod } from '../Entry/duck';
import { changePage } from '../Header/duck';
import { fetchLogs, setTodayDate, changeDate } from './duck';

const mapStateToProps = (state) => {
  const { user } = state.login;
  const {
    isFetchingLogs,
    userLogs,
    dateToday,
    dateSelected
  } = state.home;

  return {
    isFetchingLogs,
    userLogs,
    user,
    dateToday,
    dateSelected
  };
};


const mapDispatchToProps = dispatch => ({
  logout: () => {
    dispatch(logout());
  },
  setPeriod: (period) => {
    dispatch(setPeriod(period));
  },
  changePage: (newPage) => {
    dispatch(changePage(newPage));
  },
  setTodayDate: (date) => {
    dispatch(setTodayDate(date));
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

const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home);
export default HomeContainer;
