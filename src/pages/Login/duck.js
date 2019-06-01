import { handle } from 'redux-pack';
import {
  message
} from 'antd';
import * as userApi from '../../api/user';

const actions = {
  LOGIN: 'AUTH/LOGIN',
  LOGOUT: 'AUTH/LOGOUT',
  SESSION: 'AUTH/SESSION',
  GET_USER: 'AUTH/GET_USER',
  STOP_SESSION: 'AUTH/STOP_SESSION',
};

export const login = ({ userName, password }) => ({
  type: actions.LOGIN,
  promise: userApi.login({ userName, password }),
  meta: {
    onFailure: (response) => {
      if (response.response) {
        switch (response.response.data.status) {
          case 401:
            message.error('Invalid credentials', 4);
            break;
          default:
            message.error('Server error', 4);
            break;
        }
      } else {
        message.error('Server error', 4);
      }
    }
  }
});

export const logout = () => ({
  type: actions.LOGOUT,
  promise: userApi.logout()
});

export const getUser = uid => ({
  type: actions.GET_USER,
  promise: userApi.getUser(uid)
});

export const stopSession = () => ({
  type: actions.STOP_SESSION
});

export const getSession = () => (dispatch) => {
  dispatch({
    type: actions.SESSION,
    promise: userApi.getSession(),
    meta: {
      onSuccess: (response) => {
        if (response.data.data) {
          const { id } = response.data.data;
          dispatch(getUser(id));
        } else {
          dispatch(stopSession(false));
        }
      }
    }
  });
};

const initialState = {
  isLoggingIn: false,
  isLoggingOut: false,
  isGettingSession: false,
  isFetchingUser: false,
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

    case actions.GET_USER:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isFetchingUser: true
        }),
        success: prevState => ({
          ...prevState,
          user: payload.data.data
        }),
        finish: prevState => ({
          ...prevState,
          isFetchingUser: false,
          isGettingSession: false
        })
      });

    case actions.SESSION:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isGettingSession: true
        })
      });

    case actions.STOP_SESSION:
      return {
        ...state,
        isGettingSession: false
      };

    default:
      return state;
  }
};

export default reducer;
