import { handle } from 'redux-pack';
import { message } from 'antd';
import * as userApi from '../../api/user';
import * as logApi from '../../api/log';

const actions = {
  TOGGLE_HEALTH: 'HOME/TOGGLE_HEALTH',
  TOGGLE_GOAL: 'HOME/TOGGLE_GOAL',
  FETCH_PROGRESS: 'HOME/FETCH_PROGRESS',
  FETCH_DIST: 'HOME/FETCH_DIST',
  HEALTH_EDIT: 'HOME/HEALTH_EDIT'
};

export const toggleHealthEdit = () => ({
  type: actions.TOGGLE_HEALTH
});

export const toggleGoalEdit = () => ({
  type: actions.TOGGLE_GOAL
});

export const healthEdit = userInfo => ({
  type: actions.HEALTH_EDIT,
  promise: userApi.editHealth(userInfo),
  meta: {
    onSuccess: () => message.success('Successfully updated information'),
    onFailure: () => message.error('Failed in updating information')
  }
});

export const fetchProgress = uid => ({
  type: actions.FETCH_PROGRESS,
  promise: logApi.fetchProgress(uid),
  meta: {
    onFailure: () => message.error('Error in retrieving information')
  }
});

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
  dayProgress: [],
  classDist: null
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actions.HEALTH_EDIT:
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
          isEditing: false,
          showHealthEdit: false
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

    case actions.TOGGLE_HEALTH:
      return {
        ...state,
        showHealthEdit: !state.showHealthEdit
      };

    case actions.TOGGLE_GOAL:
      return {
        ...state,
        showGoalEdit: !state.showGoalEdit
      };

    default:
      return state;
  }
};

export default reducer;
