const api = require('./api');
const moment = require('moment');

const findCategory = async (categoryName) => {
  let {data} = await api.get('/categories');
  let found = false;

  data.forEach(cat => {
    let match = cat.name.match(new RegExp(categoryName, 'g'));
    if (match && match[0]) {
      found = cat;
    }
  });

  return found;
};

const argscheck = args => {
  if (!args._ || args._.length === 0) {
    throw new Error('You did not provide any category name!');
  }

  return true;
};

module.exports = {
  create: async (args) => {
    argscheck(args);
    const name = args._.shift();
    let {data} = await api.post('/categories', { name });
    return {
      status: 'Category created!',
      category: name
    };
  },
  list: async () => {
    let {data} = await api.get('/categories');
    return Object.values(data.map(category => category.name));
  },
  more: async (args) => {
    argscheck(args);
    const categoryName = args._.shift();
    let found = await findCategory(categoryName);

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

