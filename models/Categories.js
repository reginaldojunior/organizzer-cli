const api = require('./api');
const moment = require('moment');

module.exports = {
  list: async () => {
    let {data} = await api.get('/categories');
    return Object.values(data.map(category => category.name));
  },
  see: async (args) => {
    if (!args._ || args._.length === 0) {
      throw new Error('You did not provide any category name!');
    }

    const categoryName = args._.shift();
    let {data} = await api.get('/categories');
    let found = false;

    data.forEach(cat => {
      let match = cat.name.match(new RegExp(categoryName, 'g'));
      if (match && match[0]) {
        found = cat;
      }
    });

    if (!found) {
      throw new Error('This category was not found!');
    }
    
    let created_at = moment(found.created_at).format('DD/MM/YYYY').toString();
    let updated_at = moment(found.created_at).format('DD/MM/YYYY').toString();

    let result = {
      name: found.name,
      'created at': created_at,
      'updated at': updated_at,
    }

    if (!!found.parent_id) {
      try {
        found.parent_id = await api.get('categories', { params: {} });
        result.parent = found.parent_id.name;
      } catch (e) {}
    }

    return result;
  }
};

