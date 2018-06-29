import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import configureReducer from './configure';
import refreshReducer from './refresh';
import logoutReducer from './logout';
import profileReducer from './profile';

export default combineReducers({
  routing: routerReducer,
  configure: configureReducer,
  refresh: refreshReducer,
  logout: logoutReducer,
  profile: profileReducer
});
