import { handle } from 'redux-pack';
import * as userApi from '../../api/user';

const actions = {
  TOGGLE_HEALTH: 'HOME/TOGGLE_HEALTH',
  TOGGLE_GOAL: 'HOME/TOGGLE_GOAL',
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
  promise: userApi.editHealth(userInfo)
});


const initialState = {
  showHealthEdit: true,
  showGoalEdit: false,
  isSaving: false
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
          isEditing: false
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
