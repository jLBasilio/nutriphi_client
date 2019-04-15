import { handle } from 'redux-pack';
import { message } from 'antd';
import * as foodApi from '../../api/food';
import * as logApi from '../../api/log';

const actions = {
  SET_PERIOD: 'ENTRY/SET_PERIOD',
  SEARCH_FOOD: 'ENTRY/SEARCH_FOOD',
  ADD_LOG: 'ENTRY/ADD_LOG',
  RESET_SEARCH: 'ENTRY/RESET_SEARCH',
  SHOW_MODAL: 'ENTRY/SHOW_MODAL'
};

export const setPeriod = period => ({
  type: actions.SET_PERIOD,
  payload: period
});

export const searchFood = ({
  skip, take, q, foodClass
}) => ({
  type: actions.SEARCH_FOOD,
  promise: foodApi.searchFood({
    skip, take, q, foodClass
  }),
  meta: {
    onFailure: () => message.error('Server error')
  }
});

export const addToLog = logInfo => ({
  type: actions.ADD_LOG,
  promise: logApi.addToLog(logInfo),
  meta: {
    onSuccess: () => message.success('Successfully added to log'),
    onFailure: () => message.error('Server error')
  }
});

export const resetSearch = () => ({
  type: actions.RESET_SEARCH
});

export const toggleModal = () => ({
  type: actions.SHOW_MODAL
});

const initialState = {
  isFetching: false,
  isAddingLog: false,
  period: null,
  searchedFood: [],
  hasSearched: false,
  searchedFoodCount: null,
  showModal: false
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actions.SET_PERIOD:
      return {
        ...state,
        period: payload
      };

    case actions.SEARCH_FOOD:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isFetching: true
        }),
        success: prevState => ({
          ...prevState,
          searchedFood: payload.data.data,
          searchedFoodCount: payload.data.data.length
            ? parseInt(payload.data.data[0].total, 10)
            : null,
          hasSearched: true
        }),
        finish: prevState => ({
          ...prevState,
          isFetching: false
        })
      });

    case actions.ADD_LOG:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isAddingLog: true
        }),
        success: prevState => ({
          ...prevState
        }),
        finish: prevState => ({
          ...prevState,
          isAddingLog: false,
          showModal: false
        })
      });

    case actions.RESET_SEARCH:
      return {
        ...state,
        searchedFood: [],
        searchedFoodCount: null,
        hasSearched: false
      };

    case actions.SHOW_MODAL:
      return {
        ...state,
        showModal: !state.showModal
      };

    default:
      return state;
  }
};

export default reducer;
