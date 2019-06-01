import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import logger from 'redux-logger';
import { middleware as pack } from 'redux-pack';
import reducers from '../pages';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [thunk, pack];
// const middlewares = [thunk, logger, pack];
const store = createStore(reducers, {}, composeEnhancers(
  applyMiddleware(...middlewares),
));

export default store;
