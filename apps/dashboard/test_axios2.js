const axios = require('axios');
const instance = axios.create();
instance.interceptors.response.use(
  r => r,
  e => { console.log('Interceptor 1 error'); return Promise.resolve('Fixed'); }
);
instance.interceptors.response.use(
  r => { console.log('Interceptor 2 success:', r); return r; },
  e => { console.log('Interceptor 2 error'); return Promise.reject(e); }
);
instance.get('http://httpstat.us/401').then(() => console.log('Done')).catch(() => console.log('Caught'));
