import { connect } from 'react-redux';
import Home from '.';

import { logout } from '../Login/duck';
import { setPeriod } from '../Entry/duck';
import { changePage } from '../Header/duck';
import { fetchLogs, setTodayDate } from './duck';

const mapStateToProps = (state) => {
  const { isFetchingLogs, userLogs } = state.home;
  const { user: { id } } = state.login;

  return {
    isFetchingLogs,
    userLogs,
    userId: id
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
