import { connect } from 'react-redux';
import Home from '.';

import { logout } from '../Login/duck';
import { setPeriod } from '../Entry/duck';
import { changePage } from '../Header/duck';

const mapStateToProps = (state) => {
  return {

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
  }
});

const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home);
export default HomeContainer;
