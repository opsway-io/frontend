const axios = require('axios');
const instance = axios.create();
instance.interceptors.response.use(
  r => r,
  e => { console.log('Interceptor 1'); return Promise.reject(e); }
);
instance.interceptors.response.use(
  r => r,
  e => { console.log('Interceptor 2'); return Promise.reject(e); }
);
instance.get('http://httpstat.us/401').catch(() => console.log('Done'));
