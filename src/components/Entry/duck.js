import { handle } from 'redux-pack';
import { message } from 'antd';
import * as foodApi from '../../api/food';
import * as logApi from '../../api/log';
import * as favoriteApi from '../../api/favorite';

import * as homeDuck from '../Home/duck';

const actions = {
  SET_PERIOD: 'ENTRY/SET_PERIOD',
  SEARCH_FOOD: 'ENTRY/SEARCH_FOOD',
  SEARCH_FAVORITE: 'ENTRY/SEARCH_FAVORITE',
  ADD_LOG: 'ENTRY/ADD_LOG',
  RESET_SEARCH: 'ENTRY/RESET_SEARCH',
  SHOW_MODAL: 'ENTRY/SHOW_MODAL',
  TOGGLE_MEAL: 'ENTRY/TOGGLE_MEAL',
  ADD_MEAL: 'ENTRY/ADD_MEAL'
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
    onFailure: () => message.error('Server error', 4)
  }
});

export const searchFavorites = ({
  skip, take, q, uid
}) => ({
  type: actions.SEARCH_FAVORITE,
  promise: favoriteApi.searchFavorites({
    skip, take, q, uid
  }),
  meta: {
    onFailure: (response) => {
      switch (response.response.data.status) {
        case 404:
          message.error('No items', 4);
          break;
        default:
          message.error('Server error', 4);
      }
    }
  }
});

export const addToLog = logInfo => (dispatch) => {
  dispatch({
    type: actions.ADD_LOG,
    promise: logApi.addToLog(logInfo),
    meta: {
      onSuccess: () => {
        message.success('Successfully added to log', 4);
        dispatch(homeDuck.setPeriodEditing(logInfo.period));
        dispatch(homeDuck.fetchPeriod({
          userId: logInfo.user,
          date: logInfo.dateConsumed.split('T')[0],
          period: logInfo.period
        }));
        dispatch(homeDuck.toggleRecommModal(false));
      },
      onFailure: () => message.error('Server error', 4)
    }
  });
};

export const addMeal = ({ logs }) => ({
  type: actions.ADD_MEAL,
  promise: logApi.addMeal({ logs }),
  meta: {
    onSuccess: () => message.success('Successfully added to log', 4),
    onFailure: () => message.error('Server error', 4)
  }
});

export const resetSearch = () => ({
  type: actions.RESET_SEARCH
});

export const toggleModal = () => ({
  type: actions.SHOW_MODAL
});

export const toggleMealModal = () => ({
  type: actions.TOGGLE_MEAL
});

const initialState = {
  isFetching: false,
  isAddingLog: false,
  period: null,
  searchedFood: [],
  hasSearched: false,
  searchedFoodCount: null,
  showModal: false,
  showMealModal: false
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

    case actions.SEARCH_FAVORITE:
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

    case actions.ADD_MEAL:
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
          showMealModal: false
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

    case actions.TOGGLE_MEAL:
      return {
        ...state,
        showMealModal: !state.showMealModal
      };

    default:
      return state;
  }
};

export default reducer;
