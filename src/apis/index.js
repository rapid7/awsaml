import axios from 'axios';
import CONSTANTS from '../constants';

const {endpoints} = CONSTANTS;

const axiosClient = axios.create({
  baseURL: endpoints.electron,
  timeout: 30000,
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
    data: payload,
    method,
    url,
  });

  return data;
};

/**
 * Execute GET request against the /configure endpoint
 * @returns {Promise<*>}
 */
export const getConfigure = async () => await executeRequest({url: 'configure'});

/**
 * Execute POST request against the /configure endpoint with payload
 * @param {Object} payload
 * @returns {Promise<*>}
 */
export const postConfigure = async (payload) => await executeRequest({
  method: 'post',
  payload,
  url: 'configure',
});

/**
 * Execute GET request against the SPA /refresh endpoint
 *
 * Note: this call triggers the /refresh route on the SPA to make sure that
 * we get routed to the right component.
 *
 * @returns {Promise<*>}
 */
export const getRefresh = async () => await executeRequest({
  client: axios,
  url: 'refresh',
});

/**
 * Execute GET request against the SPA /logout endpoint
 *
 * Note: this call triggers the /logout route on the SPA to make sure that
 * we get routed to the right component.
 *
 * @returns {Promise<*>}
 */
export const getLogout = async () => await executeRequest({
  client: axios,
  url: 'logout',
});

/**
 * Execute DELETE request against the /profile endpoint with payload
 * @param {Object} payload
 * @returns {Promise<*>}
 */
export const deleteProfile = async (payload) => await executeRequest({
  method: 'delete',
  payload,
  url: 'profile',
});
