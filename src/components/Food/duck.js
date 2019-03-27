import { handle } from 'redux-pack';

import * as api from '../../api/food';

const actions = {
  FETCH_FOOD: 'FOOD/FETCH_FOOD'

};

export const getFoodClass = ({ skip, take, foodClass }) => ({
  type: actions.FETCH_FOOD,
  promise: api.getFoodClass({ skip, take, foodClass })
});

export const getFoodAll = ({ skip, take }) => ({
  type: actions.FETCH_FOOD,
  promise: api.getFoodAll({ skip, take })
});


const initialState = {
  isFetching: false,
  food: []
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

    default:
      return state;
  }
};

export default reducer;
