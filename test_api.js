const axios = require('axios');
axios.get('http://localhost:8001/v1/teams/1/monitors')
  .then(res => console.log(JSON.stringify(res.data, null, 2)))
  .catch(err => console.error(err.response?.data || err.message));
