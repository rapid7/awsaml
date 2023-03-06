import { handleActions } from 'redux-actions';
import {
  DELETE_PROFILE_REQUEST,
  DELETE_PROFILE_SUCCESS,
  DELETE_PROFILE_FAILURE,
} from '../actions/profile';

const deleteProfileRequest = (state, action) => ({
  ...state,
  deleteRequest: action,
});

const deleteProfileSuccess = (state) => ({
  ...state,
  deleteSuccess: true,
});

const deleteProfileFailure = (state, { payload }) => ({
  ...state,
  deleteFailure: {
    ...payload,
    errorMessage: payload.error,
  },
});

export const PROFILE_INITIAL_STATE = {
  deleteFailure: {},
  deleteRequest: {},
  deleteSuccess: false,
};

export default handleActions({
  [DELETE_PROFILE_FAILURE]: deleteProfileFailure,
  [DELETE_PROFILE_REQUEST]: deleteProfileRequest,
  [DELETE_PROFILE_SUCCESS]: deleteProfileSuccess,
}, PROFILE_INITIAL_STATE);
