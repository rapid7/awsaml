import axios from 'axios';
import CONSTANTS from '../constants';

const {endpoints} = CONSTANTS;

const axiosClient = axios.create({
  baseURL: endpoints.electron,
  timeout: 30000
});

/**
 * Generic HTTP request function to wrap axios operations
 * @param url
 * @param method
 * @param payload
 * @param client
 * @returns {Promise<void>}
 */
const executeRequest = async ({url, method = 'get', payload = null, client = axiosClient}) => {
  const {data} = await client.request({
    url,
    method,
    data: payload
  });

  return data;
};

/**
 * Execute GET request against the /configure endpoint
 * @returns {Promise<*>}
 */
export const getConfigure = async () => {
  return await executeRequest({url: 'configure'});
};

/**
 * Execute POST request against the /configure endpoint with payload
 * @param {Object} payload
 * @returns {Promise<*>}
 */
export const postConfigure = async (payload) => {
  return await executeRequest({url: 'configure', method: 'post', payload});
};

/**
 * Execute GET request against the SPA /refresh endpoint
 * @returns {Promise<*>}
 */
export const getRefresh = async () => {
  // Note: this call triggers the /refresh route on the SPA to make sure that
  // we get routed to the right component.
  return await executeRequest({url: 'refresh', client: axios});
};

/**
 * Execute GET request against the SPA /logout endpoint
 * @returns {Promise<*>}
 */
export const getLogout = async () => {
  // Note: this call triggers the /logout route on the SPA to make sure that
  // we get routed to the right component.
  return await executeRequest({url: 'logout', client: axios});
};

/**
 * Execute DELETE request against the /profile endpoint with payload
 * @param {Object} payload
 * @returns {Promise<*>}
 */
export const deleteProfile = async (payload) => {
  return await executeRequest({url: 'profile', method: 'delete', payload});
};
