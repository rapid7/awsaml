import {handleActions} from 'redux-actions';
import {
  FETCH_SELECT_ROLE_REQUEST,
  FETCH_SELECT_ROLE_SUCCESS,
  FETCH_SELECT_ROLE_FAILURE,
  SUBMIT_SELECT_ROLE_REQUEST,
  SUBMIT_SELECT_ROLE_SUCCESS,
  SUBMIT_SELECT_ROLE_FAILURE,
} from '../actions/select-role';

const selectRoleFetchRequest = (state, action) => ({
  ...state,
  fetchRequest: action,
});

const selectRoleFetchSuccess = (state, {payload}) => ({
  ...state,
  fetchSuccess: payload,
});

const selectRoleFetchFailure = (state, {payload}) => ({
  ...state,
  fetchFailure: Object.assign({}, payload, {
    ...payload,
    errorMessage: payload.error,
  }),
});

const selectRoleSubmitRequest = (state, action) => ({
  ...state,
  submitRequest: action,
});

const selectRoleSubmitSuccess = (state, {payload}) => ({
  ...state,
  submitSuccess: payload,
});

const selectRoleSubmitFailure = (state, {payload}) => ({
  ...state,
  submitFailure: Object.assign({}, payload, {
    ...payload,
    errorMessage: payload.error,
  }),
});

export const SELECT_ROLE_INITIAL_STATE = {
  fetchFailure: {},
  fetchRequest: {},
  fetchSuccess: {},
  submitFailure: {},
  submitRequest: {},
  submitSuccess: {},
};

export default handleActions({
  [FETCH_SELECT_ROLE_FAILURE]: selectRoleFetchFailure,
  [FETCH_SELECT_ROLE_REQUEST]: selectRoleFetchRequest,
  [FETCH_SELECT_ROLE_SUCCESS]: selectRoleFetchSuccess,
  [SUBMIT_SELECT_ROLE_FAILURE]: selectRoleSubmitFailure,
  [SUBMIT_SELECT_ROLE_REQUEST]: selectRoleSubmitRequest,
  [SUBMIT_SELECT_ROLE_SUCCESS]: selectRoleSubmitSuccess,
}, SELECT_ROLE_INITIAL_STATE);
