import { connect } from 'react-redux';
import Entry from '.';

import {
  resetSearch,
  searchFood,
  setPeriod,
  toggleModal,
  addToLog
} from './duck';
import { changePage } from '../Header/duck';

const mapStateToProps = (state) => {
  const {
    period,
    searchedFood,
    searchedFoodCount,
    isFetching,
    hasSearched,
    showModal,
    isAddingLog
  } = state.entry;
  const { user: { id: user } } = state.login;
  const { dateSelected } = state.home;

  return {
    period,
    searchedFood,
    searchedFoodCount,
    isFetching,
    hasSearched,
    showModal,
    isAddingLog,
    user,
    dateSelected
  };
};

const mapDispatchToProps = dispatch => ({
  setPeriod: (period) => {
    dispatch(setPeriod(period));
  },
  searchFood: ({
    skip, take, q, foodClass
  }) => {
    dispatch(searchFood({
      skip, take, q, foodClass
    }));
  },
  addToLog: (foodInfo) => {
    dispatch(addToLog(foodInfo));
  },
  changePage: (newPage) => {
    dispatch(changePage(newPage));
  },
  resetSearch: () => {
    dispatch(resetSearch());
  },
  toggleModal: () => {
    dispatch(toggleModal());
  }
});

const EntryContainer = connect(mapStateToProps, mapDispatchToProps)(Entry);
export default EntryContainer;
