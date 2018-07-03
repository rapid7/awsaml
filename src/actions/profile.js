import {createAction} from 'redux-actions';
import {fetchConfigure} from './configure';
import * as api from '../apis';

export const DELETE_PROFILE_REQUEST = 'DELETE_PROFILE_REQUEST';
export const DELETE_PROFILE_SUCCESS = 'DELETE_PROFILE_SUCCESS';
export const DELETE_PROFILE_FAILURE = 'DELETE_PROFILE_FAILURE';

const deleteProfileRequest = createAction(DELETE_PROFILE_REQUEST);
const deleteProfileSuccess = createAction(DELETE_PROFILE_SUCCESS);
const deleteProfileFailure = createAction(DELETE_PROFILE_FAILURE);

export const deleteProfile = (payload) => async (dispatch) => {
  dispatch(deleteProfileRequest());

  try {
    const {data} = await api.deleteProfile({
      params: payload
    });
    dispatch(deleteProfileSuccess(data));
    return dispatch(fetchConfigure());
  } catch (err) {
    return dispatch(deleteProfileFailure(err));
  }
};
