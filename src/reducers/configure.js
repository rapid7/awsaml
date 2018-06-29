import {handleActions} from 'redux-actions';
import {
  FETCH_CONFIGURE_FAILURE,
  FETCH_CONFIGURE_SUCCESS,
  FETCH_CONFIGURE_REQUEST,
  SUBMIT_CONFIGURE_FAILURE,
  SUBMIT_CONFIGURE_SUCCESS,
  SUBMIT_CONFIGURE_REQUEST
} from '../actions/configure';

const configureFetchRequest = (state, action) => {
  return {
    ...state,
    fetchRequest: action
  };
};

const configureFetchSuccess = (state, {payload}) => {
  return {
    ...state,
    fetchSuccess: payload
  };
};

const configureFetchFailure = (state, {payload}) => {
  return {
    ...state,
    fetchFailure: Object.assign(payload, {
      ...payload,
      errorMessage: payload.error
    })
  };
};

const configureSubmitRequest = (state, action) => {
  return {
    ...state,
    submitRequest: action
  };
};

const configureSubmitSuccess = (state, {payload}) => {
  return {
    ...state,
    submitSuccess: payload
  };
};

const configureSubmitFailure = (state, {payload}) => {
  return {
    ...state,
    submitFailure: Object.assign(payload, {
      ...payload,
      errorMessage: payload.error
    })
  };
};

export const CONFIGURE_INITIAL_STATE = {
  fetchRequest: {},
  fetchSuccess: {},
  fetchFailure: {},
  submitRequest: {},
  submitSuccess: {},
  submitFailure: {}
};

export default handleActions({
  [FETCH_CONFIGURE_REQUEST]: configureFetchRequest,
  [FETCH_CONFIGURE_SUCCESS]: configureFetchSuccess,
  [FETCH_CONFIGURE_FAILURE]: configureFetchFailure,
  [SUBMIT_CONFIGURE_REQUEST]: configureSubmitRequest,
  [SUBMIT_CONFIGURE_SUCCESS]: configureSubmitSuccess,
  [SUBMIT_CONFIGURE_FAILURE]: configureSubmitFailure
}, CONFIGURE_INITIAL_STATE);
