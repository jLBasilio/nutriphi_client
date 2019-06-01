import { handle } from 'redux-pack';
import { message } from 'antd';
import * as mealApi from '../../api/meal';

const actions = {
  FETCH_MEAL: 'MEAL/FETCH_MEAL',
  SEARCH_MEAL: 'MEAL/SEARCH_MEAL',
  EDIT_MEAL: 'MEAL/EDIT_MEAL',
  RESET_SEARCH: 'MEAL/RESET_SEARCH',
  TOGGLE_MEALCARD: 'MEAL/TOGGLE_MEALCARD',
  TOGGLE_EDITFOOD: 'MEAL/TOGGLE_EDITFOOD',
  TOGGLE_NAME: 'MEAL/TOGGLE_NAME',
  DELETE_MEAL: 'MEAL/DELETE_MEAL',
  DELETE_CLEANUP: 'MEAL/DELETE_CLEANUP'
};

export const resetSearch = () => ({
  type: actions.RESET_SEARCH
});

export const toggleMealModal = () => ({
  type: actions.TOGGLE_MEALCARD
});

export const toggleEditFoodModal = () => ({
  type: actions.TOGGLE_EDITFOOD
});

export const toggleNameModal = () => ({
  type: actions.TOGGLE_NAME
});

export const fetchMeal = ({ uid, skip, take }) => ({
  type: actions.FETCH_MEAL,
  promise: mealApi.fetchMeal({ uid, skip, take }),
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

export const searchMeal = searchInfo => ({
  type: actions.SEARCH_MEAL,
  promise: mealApi.searchMeal(searchInfo),
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

export const editMeal = (mealInfo, meta) => (dispatch) => {
  dispatch({
    type: actions.EDIT_MEAL,
    promise: mealApi.editMeal(mealInfo),
    meta: {
      onSuccess: () => {
        message.success('Successfully updated meal', 4);
        dispatch(toggleNameModal());
        dispatch(fetchMeal(meta));
      },
      onFailure: () => {
        message.error('Server error', 4);
        dispatch(toggleNameModal());
      }
    }
  });
};

export const deleteMealCleanup = mealId => ({
  type: actions.DELETE_CLEANUP,
  payload: mealId
});

export const deleteMeal = ({ uid, mealId }) => (dispatch) => {
  dispatch({
    type: actions.DELETE_MEAL,
    promise: mealApi.deleteMeal({ uid, mealId }),
    meta: {
      onSuccess: () => {
        message.success('Successfully deleted meal', 4);
        dispatch(deleteMealCleanup(mealId));
      },
      onFailure: () => message.error('Server error', 4)
    }
  });
};


const initialState = {
  meal: [],
  mealCount: null,
  searchedMeal: [],
  searchedMealCount: null,
  searchedFood: [],
  isFetching: false,
  isDeleting: false,
  hasSearched: false,

  showMealModal: false,
  showEditFoodModal: false,
  showNameModal: false
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actions.FETCH_MEAL:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isFetching: true
        }),
        success: prevState => ({
          ...prevState,
          meal: payload.data.data,
          mealCount: parseInt(payload.data.data[0].total, 10)
        }),
        finish: prevState => ({
          ...prevState,
          isFetching: false
        })
      });

    case actions.SEARCH_MEAL:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isFetching: true
        }),
        success: prevState => ({
          ...prevState,
          searchedMeal: payload.data.data,
          searchedMealCount: payload.data.data.length
            ? parseInt(payload.data.data[0].total, 10)
            : null,
          hasSearched: true
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
          searchedMeal: payload.data.data,
          searchedMealCount: payload.data.data.length
            ? parseInt(payload.data.data[0].total, 10)
            : null,
          hasSearched: true
        }),
        finish: prevState => ({
          ...prevState,
          isFetching: false
        })
      });

    case actions.DELETE_MEAL:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isDeleting: true
        }),
        success: prevState => ({
          ...prevState,
          showMealModal: false
        }),
        finish: prevState => ({
          ...prevState,
          isDeleting: false
        })
      });

    case actions.EDIT_MEAL:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isDeleting: true
        }),
        success: prevState => ({
          ...prevState,
          showMealModal: false
        }),
        finish: prevState => ({
          ...prevState,
          isDeleting: false
        })
      });

    case actions.DELETE_CLEANUP:
      return {
        ...state,
        searchedMeal: state.searchedMeal.filter(meal => meal.id !== payload),
        searchedMealCount: state.searchedMeal.filter(meal => meal.id !== payload).length,
        meal: state.meal.filter(meal => meal.id !== payload),
        mealCount: state.meal.filter(meal => meal.id !== payload).length
      };

    case actions.RESET_SEARCH:
      return {
        ...state,
        searchedMeal: [],
        searchedMealCount: null,
        hasSearched: false
      };

    case actions.TOGGLE_MEALCARD:
      return {
        ...state,
        showMealModal: !state.showMealModal
      };

    case actions.TOGGLE_EDITFOOD:
      return {
        ...state,
        showEditFoodModal: !state.showEditFoodModal
      };

    case actions.TOGGLE_NAME:
      return {
        ...state,
        showNameModal: !state.showNameModal
      };

    default:
      return state;
  }
};

export default reducer;
