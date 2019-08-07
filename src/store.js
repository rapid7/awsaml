import {
  createStore,
  applyMiddleware,
  compose
} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import thunk from 'redux-thunk';
import {createBrowserHistory} from 'history';
import rootReducer from './reducers';

export const history = createBrowserHistory();

const initialState = {};
const enhancers = [];
const middleware = [thunk, routerMiddleware(history)];

if (process.env.NODE_ENV === 'development') { // eslint-disable-line no-undef
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__; // eslint-disable-line rapid7/no-trailing-underscore

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(
      ...middleware
    ),
    ...enhancers
  )
);

export default store;
