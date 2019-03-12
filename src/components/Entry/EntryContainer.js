import { connect } from 'react-redux';
import Entry from '.';

import { setLabel } from './duck';

const mapStateToProps = (state) => {
  const { periodLabel } = state.entry;

  return {
    periodLabel
  };
};


const mapDispatchToProps = dispatch => ({

  setLabel: (periodLabel) => {
    dispatch(setLabel(periodLabel));
  }

});

const EntryContainer = connect(mapStateToProps, mapDispatchToProps)(Entry);
export default EntryContainer;
