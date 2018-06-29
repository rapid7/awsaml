import {handleActions} from 'redux-actions';
import {
  FETCH_REFRESH_FAILURE,
  FETCH_REFRESH_SUCCESS,
  FETCH_REFRESH_REQUEST
} from '../actions/refresh';

const refreshFetchRequest = (state, action) => {
  return {
    ...state,
    fetchRequest: action
  };
};

const refreshFetchSuccess = (state, {payload}) => {
  return {
    ...state,
    fetchSuccess: payload
  };
};

const refreshFetchFailure = (state, {payload}) => {
  const {data, headers, status} = payload.response;
  return {
    ...state,
    fetchFailure: {
      headers,
      status,
      errorMessage: data.error
    }
  };
};

export const CONFIGURE_INITIAL_STATE = {
  fetchRequest: {},
  fetchSuccess: {},
  fetchFailure: {},
};

export default handleActions({
  [FETCH_REFRESH_REQUEST]: refreshFetchRequest,
  [FETCH_REFRESH_SUCCESS]: refreshFetchSuccess,
  [FETCH_REFRESH_FAILURE]: refreshFetchFailure
}, CONFIGURE_INITIAL_STATE);
