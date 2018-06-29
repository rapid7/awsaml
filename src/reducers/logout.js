import {handleActions} from 'redux-actions';
import {
  FETCH_LOGOUT_REQUEST,
  FETCH_LOGOUT_SUCCESS,
  FETCH_LOGOUT_FAILURE
} from '../actions/logout';

const logoutFetchRequest = (state, action) => {
  return {
    ...state,
    fetchRequest: action
  };
};

const logoutFetchSuccess = (state, {payload}) => {
  return {
    ...state,
    fetchSuccess: payload
  };
};

const logoutFetchFailure = (state, {payload}) => {
  return {
    ...state,
    fetchFailure: Object.assign(payload, {
      ...payload,
      errorMessage: payload.error
    })
  };
};

export const CONFIGURE_INITIAL_STATE = {
  fetchRequest: {},
  fetchSuccess: {},
  fetchFailure: {},
};

export default handleActions({
  [FETCH_LOGOUT_REQUEST]: logoutFetchRequest,
  [FETCH_LOGOUT_SUCCESS]: logoutFetchSuccess,
  [FETCH_LOGOUT_FAILURE]: logoutFetchFailure
}, CONFIGURE_INITIAL_STATE);
