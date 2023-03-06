import { handleActions } from 'redux-actions';
import {
  FETCH_LOGOUT_REQUEST,
  FETCH_LOGOUT_SUCCESS,
  FETCH_LOGOUT_FAILURE,
} from '../actions/logout';

const logoutFetchRequest = (state, action) => ({
  ...state,
  fetchRequest: action,
});

const logoutFetchSuccess = (state, { payload }) => ({
  ...state,
  fetchSuccess: payload,
});

const logoutFetchFailure = (state, { payload }) => ({
  ...state,
  fetchFailure: {
    ...payload,
    errorMessage: payload.error,
  },
});

export const CONFIGURE_INITIAL_STATE = {
  fetchFailure: {},
  fetchRequest: {},
  fetchSuccess: {},
};

export default handleActions({
  [FETCH_LOGOUT_FAILURE]: logoutFetchFailure,
  [FETCH_LOGOUT_REQUEST]: logoutFetchRequest,
  [FETCH_LOGOUT_SUCCESS]: logoutFetchSuccess,
}, CONFIGURE_INITIAL_STATE);
