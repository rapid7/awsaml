import {createAction} from 'redux-actions';
import * as api from '../apis';

export const FETCH_REFRESH_REQUEST = 'FETCH_REFRESH_REQUEST';
export const FETCH_REFRESH_SUCCESS = 'FETCH_REFRESH_SUCCESS';
export const FETCH_REFRESH_FAILURE = 'FETCH_REFRESH_FAILURE';

const fetchRefreshRequest = createAction(FETCH_REFRESH_REQUEST);
const fetchRefreshSuccess = createAction(FETCH_REFRESH_SUCCESS);
const fetchRefreshFailure = createAction(FETCH_REFRESH_FAILURE);

export const fetchRefresh = () => async (dispatch) => {
  dispatch(fetchRefreshRequest());

  try {
    const data = await api.getRefresh();

    if (data.error) {
      return dispatch(fetchRefreshFailure(data));
    }

    return dispatch(fetchRefreshSuccess(data));
  } catch (err) {
    return dispatch(fetchRefreshFailure(err));
  }
};
