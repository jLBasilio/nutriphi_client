import * as pageTitles from '../../constants/pages';

const actions = {
  TOGGLE_DRAWER: 'HEADER/TOGGLE_DRAWER',
  CHANGE_PAGE: 'HEADER/CHANGE_PAGE'

};

export const toggleDrawer = () => ({
  type: actions.TOGGLE_DRAWER
});

export const changePage = pageName => ({
  type: actions.CHANGE_PAGE,
  payload: pageName
});

const initialState = {
  showDrawer: false,
  currentPage: pageTitles.LOGIN
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actions.TOGGLE_DRAWER:
      return {
        ...state,
        showDrawer: !state.showDrawer
      };

    case actions.CHANGE_PAGE:
      return {
        ...state,
        currentPage: payload
      };

    default:
      return state;
  }
};

export default reducer;
