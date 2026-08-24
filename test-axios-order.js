const axios = require('axios');

const instance = axios.create();

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("TokenInterceptor error");
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("LogOutInterceptor error");
    return Promise.reject(err);
  }
);

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(instance);
mock.onGet('/test').reply(401);

instance.get('/test').catch(() => console.log("Final catch"));
