import { handle } from 'redux-pack';
import { message } from 'antd';
import * as api from '../../api/food';

const actions = {
  FETCH_FOOD: 'FOOD/FETCH_FOOD',
  SEARCH_FOOD: 'FOOD/SEARCH_FOOD',
  RESET_SEARCH: 'FOOD/RESET_SEARCH',
  SHOW_MODAL: 'FOOD/SHOW_MODAL'
};

export const getFoodClass = ({ skip, take, foodClass }) => ({
  type: actions.FETCH_FOOD,
  promise: api.getFoodClass({ skip, take, foodClass }),
  meta: {
    onFailure: () => message.error('Server error', 4)
  }
});

export const searchFood = ({
  skip, take, q, foodClass
}) => ({
  type: actions.SEARCH_FOOD,
  promise: api.searchFood({
    skip, take, q, foodClass
  }),
  meta: {
    onFailure: () => message.error('Server error', 4)
  }
});

export const resetSearch = () => ({
  type: actions.RESET_SEARCH
});

export const toggleModal = () => ({
  type: actions.SHOW_MODAL
});

const initialState = {
  food: [],
  foodCount: null,
  searchedFood: [],
  searchedFoodCount: null,
  hasSearched: false,
  isFetching: false,
  showModal: false
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actions.FETCH_FOOD:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isFetching: true
        }),
        success: prevState => ({
          ...prevState,
          food: payload.data.data,
          foodCount: parseInt(payload.data.data[0].total, 10)
        }),
        finish: prevState => ({
          ...prevState,
          isFetching: false
        })
      });

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
