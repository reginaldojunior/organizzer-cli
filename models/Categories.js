const api = require('./api');

module.exports = {
  list: async () => {
    let {data} = await api.get('/categories');
    return Object.values(data.map(category => category.name));
  }
};

