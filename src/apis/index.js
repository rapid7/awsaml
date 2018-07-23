import axios from 'axios';
import {ENDPOINTS} from '../constants';

const axiosClient = axios.create({
  baseURL: ENDPOINTS.electron,
  timeout: 30000,
});

/**
 * Execute GET request against the /configure endpoint
 * @returns {Promise<*>}
 */
export const getConfigure = async () => {
  const {data} = await axiosClient.get('configure');

  return data;
};

/**
 * Execute POST request against the /configure endpoint with payload
 * @param {Object} payload
 * @returns {Promise<*>}
 */
export const postConfigure = async (payload) => {
  const {data} = await axiosClient.post('configure', payload);

  return data;
};

/**
 * Execute GET request against the SPA /refresh endpoint
 *
 * Note: this call triggers the /refresh route on the SPA to make sure that
 * we get routed to the right component.
 *
 * @returns {Promise<*>}
 */
export const getRefresh = async () => {
  const {data} = await axios.get('refresh');

  return data;
};

/**
 * Execute GET request against the SPA /logout endpoint
 *
 * Note: this call triggers the /logout route on the SPA to make sure that
 * we get routed to the right component.
 *
 * @returns {Promise<*>}
 */
export const getLogout = async () => {
  const {data} = await axios.get('logout');

  return data;
};

/**
 * Execute DELETE request against the /profile endpoint with payload
 * @param {Object} payload
 * @returns {Promise<*>}
 */
export const deleteProfile = async (payload) => {
  const {data} = await axiosClient.delete('profile', payload);

  return data;
};
