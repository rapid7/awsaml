import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import configureReducer from './configure';
import refreshReducer from './refresh';
import logoutReducer from './logout';
import profileReducer from './profile';

export default combineReducers({
  configure: configureReducer,
  logout: logoutReducer,
  profile: profileReducer,
  refresh: refreshReducer,
  routing: routerReducer,
});
