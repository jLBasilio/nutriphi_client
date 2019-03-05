import { handle } from 'redux-pack';
import * as auth from '../../api/user';

const actions = {
  LOGIN: 'AUTH/LOGIN',
  LOGOUT: 'AUTH/LOGOUT',
  SESSION: 'AUTH/SESSION'
};

export const login = ({ userName, password }) => ({
  type: actions.LOGIN,
  promise: auth.login({ userName, password })
});

export const logout = () => ({
  type: actions.LOGIN,
  promise: auth.logout()
});

export const getSession = () => ({
  type: actions.SESSION,
  promise: auth.getSession()
});


const initialState = {
  isLoggingIn: false,
  isGettingSession: false,
  user: null
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actions.LOGIN:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isLoggingIn: true
        }),
        success: prevState => ({
          ...prevState,
          user: payload.data.data
        }),
        finish: prevState => ({
          ...prevState,
          isLoggingIn: false
        })
      });

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

    case actions.SESSION:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isGettingSession: true
        }),
        success: prevState => ({
          ...prevState,
          user: payload.data.data
        }),
        finish: prevState => ({
          ...prevState,
          isGettingSession: false
        })
      });

    default:
      return state;
  }
};

export default reducer;
