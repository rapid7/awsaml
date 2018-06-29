import {createAction} from 'redux-actions';
import axios from "axios/index";

export const FETCH_LOGOUT_REQUEST = 'FETCH_LOGOUT_REQUEST';
export const FETCH_LOGOUT_SUCCESS = 'FETCH_LOGOUT_SUCCESS';
export const FETCH_LOGOUT_FAILURE = 'FETCH_LOGOUT_FAILURE';

const fetchLogoutRequest = createAction(FETCH_LOGOUT_REQUEST);
const fetchLogoutSuccess = createAction(FETCH_LOGOUT_SUCCESS);
const fetchLogoutFailure = createAction(FETCH_LOGOUT_FAILURE);

export const fetchLogout = () => async (dispatch) => {
  dispatch(fetchLogoutRequest());

  try {
    const {data} = await axios.get('logout');

    if (data.error) {
      return dispatch(fetchLogoutFailure(data));
    }

    return dispatch(fetchLogoutSuccess(data));
  } catch (err) {
    return dispatch(fetchLogoutFailure(err));
  }
};
