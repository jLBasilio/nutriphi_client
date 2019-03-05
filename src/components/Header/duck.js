const actions = {
  TOGGLE_DRAWER: 'HEADER/TOGGLE_DRAWER'
};

export const toggleDrawer = () => ({
  type: actions.TOGGLE_DRAWER
});

const initialState = {
  showDrawer: false
};

const reducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case actions.TOGGLE_DRAWER:
      return {
        ...state,
        showDrawer: !state.showDrawer
      };

    default:
      return state;
  }
};

export default reducer;
