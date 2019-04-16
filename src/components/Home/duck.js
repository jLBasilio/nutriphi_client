import { handle } from 'redux-pack';
import * as authApi from '../../api/user';
import * as logApi from '../../api/log';

const actions = {
  LOGOUT: 'AUTH/LOGOUT',
  TOGGLE_CALENDAR: 'HOME_TOGGLE_CALENDAR',
  FETCH_LOGS: 'HOME/FETCH_LOGS',
  SET_TODAY: 'HOME/SET_TODAY',
  CHANGE_DATE: 'HOME/CHANGE_DATE'
};

export const logout = () => ({
  type: actions.LOGOUT,
  promise: authApi.logout()
});

export const toggleCalendar = () => ({
  type: actions.TOGGLE_CALENDAR
});

export const setTodayDate = date => ({
  type: actions.SET_TODAY,
  payload: date
});

export const changeDate = date => ({
  type: actions.CHANGE_DATE,
  payload: date
});

export const fetchLogs = ({
  userId, date, skip, take
}) => ({
  type: actions.FETCH_LOGS,
  promise: logApi.fetchLogs({
    userId, date, skip, take
  })
});

const initialState = {
  showCalendar: false,
  isFetchingLogs: false,
  userLogs: [],
  dateToday: null,
  dateSelected: null
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

    case actions.FETCH_LOGS:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isFetchingLogs: true
        }),
        success: prevState => ({
          ...prevState,
          userLogs: payload.data.data
        }),
        finish: prevState => ({
          ...prevState,
          isFetchingLogs: false
        })
      });

    case actions.TOGGLE_CALENDAR:
      return {
        ...state,
        showCalendar: !state.showCalendar
      };

    case actions.SET_TODAY:
      return {
        ...state,
        dateToday: payload
      };

    case actions.CHANGE_DATE:
      return {
        ...state,
        dateSelected: payload
      };

    default:
      return state;
  }
};

export default reducer;
