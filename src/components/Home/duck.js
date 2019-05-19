import { handle } from 'redux-pack';
import { message } from 'antd';
import * as authApi from '../../api/user';
import * as logApi from '../../api/log';
import * as mealApi from '../../api/meal';

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
  DELETE_LOG: 'HOME/DELETE_LOG',
  TOGGLE_MEAL: 'HOME/TOGGLE_MEAL',
  TOGGLE_MEALEDIT: 'HOME/TOGGLE_MEALEDIT',
  TOGGLE_NAMEMEAL: 'HOME/TOGGLE_NAMEMEAL',
  ADD_MEAL: 'HOME/ADD_MEAL',
  SET_DAYINFO: 'HOME/SET_DAYINFO'
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

export const setDayInfo = logInfo => ({
  type: actions.SET_DAYINFO,
  payload: logInfo
});

export const fetchLogs = ({ userId, date }) => (dispatch) => {
  dispatch({
    type: actions.FETCH_LOGS,
    promise: logApi.fetchLogs({ userId, date }),
    meta: {
      onSuccess: (response, getState) => {
        const [userLogs, user] = [getState().home.userLogs, getState().login.user];
        const totalCho = userLogs.reduce((accCho, log) => accCho + log.consumed_choGrams, 0);
        const totalPro = userLogs.reduce((accPro, log) => accPro + log.consumed_proGrams, 0);
        const totalFat = userLogs.reduce((accFat, log) => accFat + log.consumed_fatGrams, 0);
        const percentCho = parseFloat(((totalCho / user.choPerDay) * 100).toFixed(2));
        const percentPro = parseFloat(((totalPro / user.proPerDay) * 100).toFixed(2));
        const percentFat = parseFloat(((totalFat / user.fatPerDay) * 100).toFixed(2));
        const userKcal = user.goalTEA;
        const totalKcal = userLogs.reduce((logAcc, curr) => logAcc
          + parseFloat(curr.consumed_totalKcalConsumed), 0);
        if (totalKcal >= user.goalTEA) {
          message.info('You have completed your daily calorie intake');
        }
        dispatch(setDayInfo({
          totalCho,
          totalPro,
          totalFat,
          totalKcal,
          percentCho,
          percentPro,
          percentFat,
          userKcal
        }));
      }
    }
  });
};

export const fetchPeriod = ({ userId, date, period }) => (dispatch) => {
  dispatch({
    type: actions.FETCH_PERIOD,
    promise: logApi.fetchPeriod({ userId, date, period }),
    meta: {
      onSuccess: (res, getState) => {
        dispatch(userLogCleanup());
        dispatch(setPeriodEditing(null));
        const [userLogs, user] = [getState().home.userLogs, getState().login.user];
        const totalCho = userLogs.reduce((accCho, log) => accCho + log.consumed_choGrams, 0);
        const totalPro = userLogs.reduce((accPro, log) => accPro + log.consumed_proGrams, 0);
        const totalFat = userLogs.reduce((accFat, log) => accFat + log.consumed_fatGrams, 0);
        const percentCho = parseFloat(((totalCho / user.choPerDay) * 100).toFixed(2));
        const percentPro = parseFloat(((totalPro / user.proPerDay) * 100).toFixed(2));
        const percentFat = parseFloat(((totalFat / user.fatPerDay) * 100).toFixed(2));
        const userKcal = user.goalTEA;
        const totalKcal = userLogs.reduce((logAcc, curr) => logAcc
          + parseFloat(curr.consumed_totalKcalConsumed), 0);
        if (totalKcal >= user.goalTEA) {
          message.info('You have completed your daily calorie intake');
        }
        dispatch(setDayInfo({
          totalCho,
          totalPro,
          totalFat,
          totalKcal,
          percentCho,
          percentPro,
          percentFat,
          userKcal
        }));
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

export const toggleMealModal = () => ({
  type: actions.TOGGLE_MEAL
});

export const toggleMealEdit = () => ({
  type: actions.TOGGLE_MEALEDIT
});

export const toggleNameMealModal = () => ({
  type: actions.TOGGLE_NAMEMEAL
});

export const addMeal = mealInfo => (dispatch) => {
  dispatch({
    type: actions.ADD_MEAL,
    promise: mealApi.addMeal(mealInfo),
    meta: {
      onSuccess: () => {
        message.success('Meal created', 4);
        dispatch(toggleNameMealModal());
        dispatch(toggleMealModal());
      },
      onFailure: () => {
        message.error('Server error', 4);
        dispatch(toggleNameMealModal());
        dispatch(toggleMealModal());
      }
    }
  });
};

export const editLog = logInfo => (dispatch) => {
  dispatch({
    type: actions.EDIT_LOG,
    promise: logApi.editLog(logInfo),
    meta: {
      onSuccess: () => {
        message.success('Success in editing log', 4);
        dispatch(fetchPeriod({
          userId: logInfo.userId,
          date: logInfo.dateConsumed.split('T')[0],
          period: logInfo.period
        }));
        dispatch(toggleEditModal());
      },
      onFailure: () => message.error('Edit log failed', 4)
    }
  });
};

export const deleteLog = logInfo => (dispatch) => {
  dispatch({
    type: actions.DELETE_LOG,
    promise: logApi.deleteLog(logInfo.consumedId),
    meta: {
      onSuccess: () => {
        message.success('Success in deleting log', 4);
        dispatch(fetchPeriod({
          userId: logInfo.userId,
          date: logInfo.dateConsumed.split('T')[0],
          period: logInfo.period
        }));
        dispatch(toggleEditModal());
      },
      onFailure: () => message.error('Delete log failed', 4)
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
  isDeleting: false,
  showCreateMealModal: false,
  showEditFoodMeal: false,
  showNameMealModal: false,
  isSavingMeal: false,
  totalCho: null,
  totalPro: null,
  totalFat: null,
  totalKcal: null,
  percentCho: null,
  percentPro: null,
  percentFat: null,
  userKcal: null
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

    case actions.ADD_MEAL:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isSavingMeal: true
        }),
        success: prevState => ({
          ...prevState
        }),
        finish: prevState => ({
          ...prevState,
          isSavingMeal: false
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

    case actions.SET_DAYINFO:
      return {
        ...state,
        totalCho: payload.totalCho,
        totalPro: payload.totalPro,
        totalFat: payload.totalFat,
        totalKcal: payload.totalKcal,
        percentCho: payload.percentCho,
        percentPro: payload.percentPro,
        percentFat: payload.percentFat,
        userKcal: payload.userKcal
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

    case actions.TOGGLE_MEAL:
      return {
        ...state,
        showCreateMealModal: !state.showCreateMealModal
      };

    case actions.TOGGLE_MEALEDIT:
      return {
        ...state,
        showEditFoodMeal: !state.showEditFoodMeal
      };

    case actions.TOGGLE_NAMEMEAL:
      return {
        ...state,
        showNameMealModal: !state.showNameMealModal
      };

    default:
      return state;
  }
};

export default reducer;
