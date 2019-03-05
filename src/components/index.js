import { combineReducers } from 'redux';

import header from './Header/duck';
import home from './Home/duck';
import login from './Login/duck';
import signup from './Signup/duck';

const reducers = combineReducers({
  header,
  home,
  login,
  signup
});

export default reducers;
