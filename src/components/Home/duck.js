import { handle } from 'redux-pack';
import * as auth from '../../api/user';

const actions = {
  LOGOUT: 'AUTH/LOGOUT',
  TOGGLE_CALENDAR: 'HOME_TOGGLE_CALENDAR'
};

export const logout = () => ({
  type: actions.LOGOUT,
  promise: auth.logout()
});

export const toggleCalendar = () => ({
  type: actions.TOGGLE_CALENDAR
});

const initialState = {
  showCalendar: false
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

    case actions.TOGGLE_CALENDAR:
      return {
        ...state,
        showCalendar: !state.showCalendar
      };

    default:
      return state;
  }
};

export default reducer;
