import { connect } from 'react-redux';
import Entry from '.';

import { setPeriod } from './duck';
import { changePage } from '../Header/duck';

const mapStateToProps = (state) => {
  const { period } = state.entry;

  return {
    period
  };
};


const mapDispatchToProps = dispatch => ({
  setPeriod: (period) => {
    dispatch(setPeriod(period));
  },
  changePage: (newPage) => {
    dispatch(changePage(newPage));
  }
});

const EntryContainer = connect(mapStateToProps, mapDispatchToProps)(Entry);
export default EntryContainer;
