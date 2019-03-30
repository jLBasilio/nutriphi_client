const actions = {
  SET_PERIOD: 'ENTRY/SET_PERIOD'
};

export const setPeriod = period => ({
  type: actions.SET_PERIOD,
  payload: period
});

const initialState = {
  period: null
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actions.SET_PERIOD:
      return {
        ...state,
        period: payload
      };

    default:
      return state;
  }
};

export default reducer;
