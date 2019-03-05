import { handle } from 'redux-pack';
import * as auth from '../../api/user';

const actions = {
  LOGOUT: 'AUTH/LOGOUT'
};

export const logout = () => ({
  type: actions.LOGOUT,
  promise: auth.logout()
});

const initialState = {

};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actions.LOGOUT:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isGettingSession: true
        }),
        success: prevState => ({
          ...prevState,
          user: null
        }),
        finish: prevState => ({
          ...prevState,
          isGettingSession: false
        })
      });

    case actions.TOGGLE_DRAWER:
      return {
        ...state,
        showDrawer: !state.showDrawer
      };

    default:
      return state;
  }
};

export default reducer;
