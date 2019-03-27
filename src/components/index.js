import { combineReducers } from 'redux';

import entry from './Entry/duck';
import food from './Food/duck';
import header from './Header/duck';
import home from './Home/duck';
import login from './Login/duck';
import signup from './Signup/duck';

const reducers = combineReducers({
  entry,
  header,
  home,
  login,
  signup,
  food
});

export default reducers;
