import { handle } from 'redux-pack';
import { message } from 'antd';
import * as userApi from '../../api/user';
import * as logApi from '../../api/log';
import * as profileUtil from '../../utils/profile.util';
import { getUser } from '../Login/duck';

const actions = {
  TOGGLE_HEALTH: 'PROFILE/TOGGLE_HEALTH',
  TOGGLE_GOAL: 'PROFILE/TOGGLE_GOAL',
  TOGGLE_GOALCONFIRM: 'PROFILE/TOGGLE_GOALCONFIRM',
  FETCH_PROGRESS: 'PROFILE/FETCH_PROGRESS',
  FETCH_DIST: 'PROFILE/FETCH_DIST',
  FETCH_WEIGHT: 'PROFILE/FETCH_WEIGHT',
  PROJECT_WEIGHT: 'PROFILE/PROJECT_WEIGHT',
  SET_TIME: 'PROFILE/SET_TIME',
  HEALTH_EDIT: 'PROFILE/HEALTH_EDIT'
};

export const toggleHealthEdit = toggle => ({
  type: actions.TOGGLE_HEALTH,
  payload: toggle
});

export const toggleGoalEdit = toggle => ({
  type: actions.TOGGLE_GOAL,
  payload: toggle
});

export const toggleGoalConfirm = toggle => ({
  type: actions.TOGGLE_GOALCONFIRM,
  payload: toggle
});

export const setTime = time => ({
  type: actions.SET_TIME,
  payload: time
});

export const projectWeight = ({ weightKg, weightLbs }) => ({
  type: actions.PROJECT_WEIGHT,
  payload: { weightKg, weightLbs }
});

export const fetchWeight = uid => ({
  type: actions.FETCH_WEIGHT,
  promise: logApi.fetchWeight(uid),
  meta: {
    onFailure: () => message.error('Error in retrieving information')
  }
});

export const healthEdit = userInfo => (dispatch) => {
  dispatch({
    type: actions.HEALTH_EDIT,
    promise: userApi.editHealth(userInfo),
    meta: {
      onSuccess: async (result, getState) => {
        await dispatch(getUser(userInfo.id));
        await dispatch(fetchWeight(userInfo.id));
        const { user } = getState().login;
        if ((user.target === 'gain' && (user.weightKg >= user.goalKg
          || user.weightLbs >= user.goalLbs))
          || (user.target === 'lose' && (user.weightKg <= user.goalKg
          || user.weightLbs <= user.goalLbs))) {
          message.success('Congratulations on achieving the goal weight!');
        } else {
          message.success('Successfully updated information');
        }

        if (userInfo.endDate) {
          const timeLeft = await profileUtil.calculateDaysLeft(userInfo.endDate);
          const { weeksLeft, daysLeft } = timeLeft;
          dispatch(setTime({ weeksLeft, daysLeft }));
        }
      },
      onFailure: () => message.error('Failed in updating information')
    }
  });
};

export const fetchProgress = uid => (dispatch) => {
  dispatch({
    type: actions.FETCH_PROGRESS,
    promise: logApi.fetchProgress(uid),
    meta: {
      onSuccess: async (response, getState) => {
        const { goalTEA, weightLbs: userLbs } = getState().login.user;
        const kcal = response.data.data[response.data.data.length - 1].totalKcal;
        const {
          weightKg,
          weightLbs
        } = await profileUtil.projectWeight(kcal, parseFloat(goalTEA), parseFloat(userLbs));
        dispatch(projectWeight({ weightLbs, weightKg }));
      },
      onFailure: () => message.error('Error in retrieving information')
    }
  });
};

export const fetchClassDist = uid => ({
  type: actions.FETCH_DIST,
  promise: logApi.fetchClassDist(uid),
  meta: {
    onFailure: () => message.error('Error in retrieving information')
  }
});

const initialState = {
  showHealthEdit: false,
  showGoalEdit: false,
  isSaving: false,
  isEditing: false,
  isFetchingProgress: false,
  dayProgress: null,
  classDist: null,
  weightHist: null,
  healthButtonDisabled: false,
  goalButtonDisabled: false,
  showGoalConfirm: false,
  weeksLeft: null,
  daysLeft: null,
  dayKcal: null,
  projectedKg: null,
  projectedLbs: null
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actions.HEALTH_EDIT:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isEditing: true,
          healthButtonDisabled: true
        }),
        success: prevState => ({
          ...prevState
        }),
        finish: prevState => ({
          ...prevState,
          isEditing: false,
          healthButtonDisabled: false,
          showHealthEdit: false,
          showGoalConfirm: false,
          showGoalEdit: false
        })
      });

    case actions.FETCH_PROGRESS:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isFetchingProgress: true
        }),
        success: prevState => ({
          ...prevState,
          dayProgress: payload.data.data
        }),
        finish: prevState => ({
          ...prevState,
          isFetchingProgress: false
        })
      });

    case actions.FETCH_DIST:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isFetchingProgress: true
        }),
        success: prevState => ({
          ...prevState,
          classDist: payload.data.data
        }),
        finish: prevState => ({
          ...prevState,
          isFetchingProgress: false
        })
      });

    case actions.FETCH_WEIGHT:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isFetchingProgress: true
        }),
        success: prevState => ({
          ...prevState,
          weightHist: payload.data.data
        }),
        finish: prevState => ({
          ...prevState,
          isFetchingProgress: false
        })
      });

    case actions.PROJECT_WEIGHT:
      return {
        ...state,
        projectedKg: payload.weightKg,
        projectedLbs: payload.weightLbs
      };

    case actions.TOGGLE_HEALTH:
      return {
        ...state,
        showHealthEdit: payload
      };

    case actions.TOGGLE_GOAL:
      return {
        ...state,
        showGoalEdit: payload
      };

    case actions.TOGGLE_GOALCONFIRM:
      return {
        ...state,
        showGoalConfirm: payload
      };

    case actions.SET_TIME:
      return {
        ...state,
        weeksLeft: payload.weeksLeft,
        daysLeft: payload.daysLeft
      };

    default:
      return state;
  }
};

export default reducer;
