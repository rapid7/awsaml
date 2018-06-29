import axios from 'axios';

const instances = {};

export const createAxiosInstances = (endpoints) => {
  Object.keys(endpoints).forEach((entry) => {
    instances[entry] = axios.create({
      baseURL: endpoints[entry],
      timeout: 30000
    });
  });
};

export default instances;
