import { createAction } from 'redux-actions';
import * as api from '../apis';

export const FETCH_CONFIGURE_REQUEST = 'FETCH_CONFIGURE_REQUEST';
export const FETCH_CONFIGURE_SUCCESS = 'FETCH_CONFIGURE_SUCCESS';
export const FETCH_CONFIGURE_FAILURE = 'FETCH_CONFIGURE_FAILURE';
export const SUBMIT_CONFIGURE_REQUEST = 'SUBMIT_CONFIGURE_REQUEST';
export const SUBMIT_CONFIGURE_SUCCESS = 'SUBMIT_CONFIGURE_SUCCESS';
export const SUBMIT_CONFIGURE_FAILURE = 'SUBMIT_CONFIGURE_FAILURE';

const fetchConfigureRequest = createAction(FETCH_CONFIGURE_REQUEST);
const fetchConfigureSuccess = createAction(FETCH_CONFIGURE_SUCCESS);
const fetchConfigureFailure = createAction(FETCH_CONFIGURE_FAILURE);

export const fetchConfigure = () => async (dispatch) => {
  dispatch(fetchConfigureRequest());

  try {
    const data = await api.getConfigure();

    return dispatch(fetchConfigureSuccess(data));
  } catch (err) {
    return dispatch(fetchConfigureFailure(err));
  }
};

const submitConfigureRequest = createAction(SUBMIT_CONFIGURE_REQUEST);
const submitConfigureSuccess = createAction(SUBMIT_CONFIGURE_SUCCESS);
const submitConfigureFailure = createAction(SUBMIT_CONFIGURE_FAILURE);

export const submitConfigure = (payload) => async (dispatch) => {
  dispatch(submitConfigureRequest());

  try {
    const data = await api.postConfigure(payload);

    if (data.error) {
      return dispatch(submitConfigureFailure(data));
    }

    return dispatch(submitConfigureSuccess(data));
  } catch (err) {
    return dispatch(submitConfigureFailure(err));
  }
};
