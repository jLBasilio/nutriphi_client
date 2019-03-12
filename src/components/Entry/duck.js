const actions = {
  SET_LABEL: 'ENTRY/SET_LABEL'
};

export const setLabel = periodLabel => ({
  type: actions.SET_LABEL,
  payload: periodLabel
});

const initialState = {
  periodLabel: null
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actions.SET_LABEL:
      return {
        ...state,
        periodLabel: payload
      };

    default:
      return state;
  }
};

export default reducer;
