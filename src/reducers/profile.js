import {handleActions} from 'redux-actions';
import {
  DELETE_PROFILE_REQUEST,
  DELETE_PROFILE_SUCCESS,
  DELETE_PROFILE_FAILURE
} from '../actions/profile';

const deleteProfileRequest = (state, action) => {
  return {
    ...state,
    deleteRequest: action
  };
};

const deleteProfileSuccess = (state) => {
  return {
    ...state,
    deleteSuccess: true
  };
};

const deleteProfileFailure = (state, {payload}) => {
  return {
    ...state,
    deleteFailure: Object.assign(payload, {
      ...payload,
      errorMessage: payload.error
    })
  };
};

export const PROFILE_INITIAL_STATE = {
  deleteRequest: {},
  deleteSuccess: false,
  deleteFailure: {},
};

export default handleActions({
  [DELETE_PROFILE_REQUEST]: deleteProfileRequest,
  [DELETE_PROFILE_SUCCESS]: deleteProfileSuccess,
  [DELETE_PROFILE_FAILURE]: deleteProfileFailure
}, PROFILE_INITIAL_STATE);
