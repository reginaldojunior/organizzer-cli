const axios = require('axios');
const Configstore = require('configstore');
const config = new Configstore('organizze');
const axiosConfig = {
  baseURL: 'https://api.organizze.com.br/rest/v2',
  headers: {
    'User-Agent': `${config.get('username')} (${config.get('username')})`
  },
  auth: {
    username: config.get('username'),
    password: config.get('token')
  }
};

module.exports = axios.create(axiosConfig);

