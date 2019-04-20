import { handle } from 'redux-pack';
import { message } from 'antd';
import * as authApi from '../../api/user';
import * as logApi from '../../api/log';

const actions = {
  LOGOUT: 'AUTH/LOGOUT',
  TOGGLE_CALENDAR: 'HOME_TOGGLE_CALENDAR',
  FETCH_LOGS: 'HOME/FETCH_LOGS',
  FETCH_PERIOD: 'HOME/FETCH_PERIOD',
  SET_TODAY: 'HOME/SET_TODAY',
  SET_PERIOD: 'HOME/SET_PERIOD',
  CHANGE_DATE: 'HOME/CHANGE_DATE',
  TOGGLE_EDIT: 'HOME/TOGGLE_EDIT',
  LOG_CLEANUP: 'HOME/LOG_CLEANUP',
  TOGGLE_DELETE: 'HOME/TOGGLE_DELETE',
  EDIT_LOG: 'HOME/EDIT_LOG',
  DELETE_LOG: 'HOME/DELETE_LOG'
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

export const setPeriodEditing = period => ({
  type: actions.SET_PERIOD,
  payload: period
});

export const userLogCleanup = () => ({
  type: actions.LOG_CLEANUP
});

export const fetchLogs = ({ userId, date }) => ({
  type: actions.FETCH_LOGS,
  promise: logApi.fetchLogs({ userId, date })
});

export const fetchPeriod = ({ userId, date, period }) => (dispatch) => {
  dispatch({
    type: actions.FETCH_PERIOD,
    promise: logApi.fetchPeriod({ userId, date, period }),
    meta: {
      onSuccess: () => {
        dispatch(userLogCleanup());
        dispatch(setPeriodEditing(null));
      }
    }
  });
};

export const toggleEditModal = () => ({
  type: actions.TOGGLE_EDIT
});

export const toggleDeleteModal = () => ({
  type: actions.TOGGLE_DELETE
});

export const editLog = logInfo => (dispatch) => {
  dispatch({
    type: actions.EDIT_LOG,
    promise: logApi.editLog(logInfo),
    meta: {
      onSuccess: () => {
        message.success('Success in editing log');
        dispatch(fetchPeriod({
          userId: logInfo.userId,
          date: logInfo.dateConsumed.split('T')[0],
          period: logInfo.period
        }));
        dispatch(toggleEditModal());
      },
      onFailure: () => message.error('Edit log failed')
    }
  });
};

export const deleteLog = logInfo => (dispatch) => {
  dispatch({
    type: actions.DELETE_LOG,
    promise: logApi.deleteLog(logInfo.consumedId),
    meta: {
      onSuccess: () => {
        message.success('Success in deleting log');
        dispatch(fetchPeriod({
          userId: logInfo.userId,
          date: logInfo.dateConsumed.split('T')[0],
          period: logInfo.period
        }));
        dispatch(toggleEditModal());
      },
      onFailure: () => message.error('Delete log failed')
    }
  });
};

const initialState = {
  showCalendar: false,
  isFetchingLogs: false,
  userLogs: [],
  breakfast: [],
  lunch: [],
  dinner: [],
  periodEditing: null,
  dateToday: null,
  dateSelected: null,
  showEditModal: false,
  isEditing: false,
  showDeleteModal: false,
  isDeleting: false
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
          userLogs: payload.data.data,
          breakfast: payload.data.data.filter(log => log.consumed_period === 'breakfast'),
          lunch: payload.data.data.filter(log => log.consumed_period === 'lunch'),
          dinner: payload.data.data.filter(log => log.consumed_period === 'dinner')
        }),
        finish: prevState => ({
          ...prevState,
          isFetchingLogs: false
        })
      });

    case actions.FETCH_PERIOD:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isFetchingLogs: true
        }),
        success: prevState => ({
          ...prevState,
          [state.periodEditing]: payload.data.data
        }),
        finish: prevState => ({
          ...prevState,
          isFetchingLogs: false
        })
      });

    case actions.EDIT_LOG:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isEditing: true
        }),
        success: prevState => ({
          ...prevState
        }),
        finish: prevState => ({
          ...prevState,
          isEditing: false
        })
      });

    case actions.DELETE_LOG:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isDeleting: true
        }),
        success: prevState => ({
          ...prevState
        }),
        finish: prevState => ({
          ...prevState,
          isDeleting: false
        })
      });

    case actions.LOG_CLEANUP:
      return {
        ...state,
        userLogs: [
          ...state.breakfast,
          ...state.lunch,
          ...state.dinner
        ]
      };

    case actions.TOGGLE_CALENDAR:
      return {
        ...state,
        showCalendar: !state.showCalendar
      };

    case actions.TOGGLE_EDIT:
      return {
        ...state,
        showEditModal: !state.showEditModal
      };

    case actions.TOGGLE_DELETE:
      return {
        ...state,
        showDeleteModal: !state.showDeleteModal
      };

    case actions.SET_TODAY:
      return {
        ...state,
        dateToday: payload
      };

    case actions.SET_PERIOD:
      return {
        ...state,
        periodEditing: payload
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
