import { handle } from 'redux-pack';
import {
  message
} from 'antd';
import * as auth from '../../api/user';

const actions = {
  LOGIN: 'AUTH/LOGIN',
  LOGOUT: 'AUTH/LOGOUT',
  SESSION: 'AUTH/SESSION'
};

export const login = ({ userName, password }) => ({
  type: actions.LOGIN,
  promise: auth.login({ userName, password }),
  meta: {
    onFailure: (response) => {
      if (response.response) {
        switch (response.response.data.status) {
          case 401:
            message.error('Invalid credentials');
            break;
          default:
            message.error('Server error');
            break;
        }
      } else {
        message.error('Server error');
      }
    }
  }
});

export const logout = () => ({
  type: actions.LOGOUT,
  promise: auth.logout()
});

export const getSession = () => ({
  type: actions.SESSION,
  promise: auth.getSession()
});

const initialState = {
  isLoggingIn: false,
  isLoggingOut: false,
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
          isLoggingOut: true
        }),
        success: prevState => ({
          ...prevState,
          user: null
        }),
        finish: prevState => ({
          ...prevState,
          isLoggingOut: false
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
