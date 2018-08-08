import {createAction} from 'redux-actions';
import * as api from '../apis';

export const FETCH_SELECT_ROLE_REQUEST = 'FETCH_SELECT_ROLE_REQUEST';
export const FETCH_SELECT_ROLE_SUCCESS = 'FETCH_SELECT_ROLE_SUCCESS';
export const FETCH_SELECT_ROLE_FAILURE = 'FETCH_SELECT_ROLE_FAILURE';
export const SUBMIT_SELECT_ROLE_REQUEST = 'SUBMIT_SELECT_ROLE_REQUEST';
export const SUBMIT_SELECT_ROLE_SUCCESS = 'SUBMIT_SELECT_ROLE_SUCCESS';
export const SUBMIT_SELECT_ROLE_FAILURE = 'SUBMIT_SELECT_ROLE_FAILURE';

const fetchSelectRoleRequest = createAction(FETCH_SELECT_ROLE_REQUEST);
const fetchSelectRoleSuccess = createAction(FETCH_SELECT_ROLE_SUCCESS);
const fetchSelectRoleFailure = createAction(FETCH_SELECT_ROLE_FAILURE);

export const fetchSelectRole = () => async (dispatch) => {
  dispatch(fetchSelectRoleRequest());

  try {
    const data = await api.getSelectRole();

    if (data.error) {
      return dispatch(fetchSelectRoleFailure(data));
    }

    return dispatch(fetchSelectRoleSuccess(data));
  } catch (err) {
    return dispatch(fetchSelectRoleFailure(err));
  }
};

const submitSelectRoleRequest = createAction(SUBMIT_SELECT_ROLE_REQUEST);
const submitSelectRoleSuccess = createAction(SUBMIT_SELECT_ROLE_SUCCESS);
const submitSelectRoleFailure = createAction(SUBMIT_SELECT_ROLE_FAILURE);

export const submitSelectRole = (payload) => async (dispatch) => {
  dispatch(submitSelectRoleRequest());

  try {
    const data = await api.postSelectRole(payload);

    if (data.error) {
      return dispatch(submitSelectRoleFailure(data));
    }

    return dispatch(submitSelectRoleSuccess(data));
  } catch (err) {
    return dispatch(submitSelectRoleFailure(err));
  }
};
