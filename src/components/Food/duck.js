import { handle } from 'redux-pack';
import { message } from 'antd';
import * as api from '../../api/food';

const actions = {
  FETCH_FOOD: 'FOOD/FETCH_FOOD',
  FETCH_FOODCOUNT: 'FOOD/FETCH_FOODCOUNT',
  SHOW_MODAL: 'FOOD/SHOW_MODAL'
};

export const getFoodClass = ({ skip, take, foodClass }) => ({
  type: actions.FETCH_FOOD,
  promise: api.getFoodClass({ skip, take, foodClass }),
  meta: {
    onFailure: () => message.error('Server error')
  }
});

export const getFoodCount = foodClass => ({
  type: actions.FETCH_FOODCOUNT,
  promise: api.getFoodCount(foodClass),
  meta: {
    onFailure: () => message.error('Server error')
  }
});

export const toggleModal = () => ({
  type: actions.SHOW_MODAL
});

const initialState = {
  food: [],
  isFetching: false,
  showModal: false,
  foodCount: null
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
          food: payload.data.data
        }),
        finish: prevState => ({
          ...prevState,
          isFetching: false
        })
      });

    case actions.FETCH_FOODCOUNT:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isFetching: true
        }),
        success: prevState => ({
          ...prevState,
          foodCount: payload.data.data.count
        }),
        finish: prevState => ({
          ...prevState,
          isFetching: false
        })
      });

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
