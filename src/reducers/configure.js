import {handleActions} from 'redux-actions';
import {
  FETCH_CONFIGURE_FAILURE,
  FETCH_CONFIGURE_SUCCESS,
  FETCH_CONFIGURE_REQUEST,
  SUBMIT_CONFIGURE_FAILURE,
  SUBMIT_CONFIGURE_SUCCESS,
  SUBMIT_CONFIGURE_REQUEST
} from '../actions/configure';

const configureFetchRequest = (state, action) => ({
  ...state,
  fetchRequest: action,
});

const configureFetchSuccess = (state, {payload}) => ({
  ...state,
  fetchSuccess: payload,
});

const configureFetchFailure = (state, {payload}) => ({
  ...state,
  fetchFailure: Object.assign({}, payload, {
    ...payload,
    errorMessage: payload.error,
  }),
});

const configureSubmitRequest = (state, action) => ({
  ...state,
  submitRequest: action,
});

const configureSubmitSuccess = (state, {payload}) => ({
  ...state,
  submitSuccess: payload,
});

const configureSubmitFailure = (state, {payload}) => ({
  ...state,
  submitFailure: Object.assign({}, payload, {
    ...payload,
    errorMessage: payload.error,
  }),
});

export const CONFIGURE_INITIAL_STATE = {
  fetchFailure: {},
  fetchRequest: {},
  fetchSuccess: {},
  submitFailure: {},
  submitRequest: {},
  submitSuccess: {},
};

export default handleActions({
  [FETCH_CONFIGURE_FAILURE]: configureFetchFailure,
  [FETCH_CONFIGURE_REQUEST]: configureFetchRequest,
  [FETCH_CONFIGURE_SUCCESS]: configureFetchSuccess,
  [SUBMIT_CONFIGURE_FAILURE]: configureSubmitFailure,
  [SUBMIT_CONFIGURE_REQUEST]: configureSubmitRequest,
  [SUBMIT_CONFIGURE_SUCCESS]: configureSubmitSuccess,
}, CONFIGURE_INITIAL_STATE);
