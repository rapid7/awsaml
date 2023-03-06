import { handleActions } from 'redux-actions';
import {
  FETCH_REFRESH_FAILURE,
  FETCH_REFRESH_SUCCESS,
  FETCH_REFRESH_REQUEST,
} from '../actions/refresh';

const refreshFetchRequest = (state, action) => ({
  ...state,
  fetchRequest: action,
});

const refreshFetchSuccess = (state, { payload }) => ({
  ...state,
  fetchSuccess: payload,
});

const refreshFetchFailure = (state, { payload }) => {
  const { data, headers, status } = payload.response;

  return {
    ...state,
    fetchFailure: {
      errorMessage: data.error,
      headers,
      status,
    },
  };
};

export const CONFIGURE_INITIAL_STATE = {
  fetchFailure: {},
  fetchRequest: {},
  fetchSuccess: {},
};

export default handleActions({
  [FETCH_REFRESH_FAILURE]: refreshFetchFailure,
  [FETCH_REFRESH_REQUEST]: refreshFetchRequest,
  [FETCH_REFRESH_SUCCESS]: refreshFetchSuccess,
}, CONFIGURE_INITIAL_STATE);
