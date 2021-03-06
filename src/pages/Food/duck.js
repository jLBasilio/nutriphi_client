import { handle } from 'redux-pack';
import { message } from 'antd';
import * as foodApi from '../../api/food';
import * as favoriteApi from '../../api/favorite';

const actions = {
  FETCH_FOOD: 'FOOD/FETCH_FOOD',
  GET_FAVORITES: 'FOOD/GET_FAVORITES',
  ADD_FAVORITES: 'FOOD/ADD_FAVORITES',
  DELETE_FAVORITES: 'FOOD/DELETE_FAVORITES',
  FETCH_FAVORITES: 'FOOD/FETCH_FAVORITES',
  SEARCH_FAVORITES: 'FOOD/SEARCH_FAVORITES',
  SEARCH_FOOD: 'FOOD/SEARCH_FOOD',
  SEARCH_RAW: 'FOOD/SEARCH_RAW',
  RESET_SEARCH: 'FOOD/RESET_SEARCH',
  SHOW_MODAL: 'FOOD/SHOW_MODAL'
};

export const getFoodClass = ({ skip, take, foodClass }) => ({
  type: actions.FETCH_FOOD,
  promise: foodApi.getFoodClass({ skip, take, foodClass }),
  meta: {
    onFailure: () => message.error('Server error', 4)
  }
});

export const getFavoriteIds = uid => ({
  type: actions.GET_FAVORITES,
  promise: favoriteApi.getFavoriteIds(uid),
  meta: {
    onFailure: () => message.error('Server error', 4)
  }
});

export const addToFavorites = ({ uid, foodId }) => ({
  type: actions.ADD_FAVORITES,
  promise: favoriteApi.addToFavorites({ uid, foodId }),
  meta: {
    onFailure: () => message.error('Server error', 4)
  }
});

export const deleteFromFavorites = ({ uid, foodId }) => ({
  type: actions.DELETE_FAVORITES,
  promise: favoriteApi.deleteFromFavorites({ uid, foodId }),
  meta: {
    onFailure: () => message.error('Server error', 4)
  }
});

export const fetchFavorites = ({ skip, take, uid }) => ({
  type: actions.FETCH_FAVORITES,
  promise: favoriteApi.fetchFavorites({ skip, take, uid }),
  meta: {
    onFailure: () => message.error('Server error', 4)
  }
});

export const searchFood = ({
  skip, take, q, foodClass
}) => ({
  type: actions.SEARCH_FOOD,
  promise: foodApi.searchFood({
    skip, take, q, foodClass
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

export const searchRaw = ({ q, foodClass }) => ({
  type: actions.SEARCH_FOOD,
  promise: foodApi.searchRaw({ q, foodClass }),
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

export const searchFavorites = ({
  skip, take, q, uid
}) => ({
  type: actions.SEARCH_FAVORITES,
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

export const resetSearch = () => ({
  type: actions.RESET_SEARCH
});

export const toggleModal = () => ({
  type: actions.SHOW_MODAL
});

const initialState = {
  food: [],
  favFoodIds: [],
  foodCount: null,
  searchedFood: [],
  searchedFoodCount: null,
  hasSearched: false,
  isFetching: false,
  showModal: false,
  isAddingToFavorites: false
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

    case actions.SEARCH_RAW:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isFetching: true
        }),
        success: prevState => ({
          ...prevState,
          searchedFood: payload.data.data
        }),
        finish: prevState => ({
          ...prevState,
          isFetching: false
        })
      });

    case actions.GET_FAVORITES:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isFetching: true
        }),
        success: prevState => ({
          ...prevState,
          favFoodIds: payload.data.data
        }),
        finish: prevState => ({
          ...prevState,
          isFetching: false
        })
      });

    case actions.ADD_FAVORITES:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isAddingToFavorites: true
        }),
        success: prevState => ({
          ...prevState,
          favFoodIds: payload.data.data
        }),
        finish: prevState => ({
          ...prevState,
          isAddingToFavorites: false
        })
      });

    case actions.DELETE_FAVORITES:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isAddingToFavorites: true
        }),
        success: prevState => ({
          ...prevState,
          favFoodIds: payload.data.data
        }),
        finish: prevState => ({
          ...prevState,
          isAddingToFavorites: false
        })
      });

    case actions.FETCH_FAVORITES:
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

    case actions.SEARCH_FAVORITES:
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
