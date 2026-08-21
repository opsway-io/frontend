const axios = require('axios');

const instance = axios.create();

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log('Interceptor 1');
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log('Interceptor 2');
    return Promise.reject(err);
  }
);

instance.get('https://httpstat.us/401').catch(() => console.log('Done'));
