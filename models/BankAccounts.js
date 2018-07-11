const api = require('./api');
const moment = require('moment');

const findAccount = async (accountName) => {
  let {data} = await api.get('/accounts');
  let found = false;

  (Array.isArray(data) ? data : [data]).forEach(cat => {
    let match = cat.name.match(new RegExp(accountName, 'g'));
    if (match && match[0]) {
      found = cat;
    }
  });

  if (!found) {
    throw new Error('This account was not found!');
  }

  return found;
};

const argscheck = args => {
  if (!args._ || args._.length === 0) {
    throw new Error('You did not provide any account name!');
  }

  return true;
};

module.exports = {
  delete: async (args) => {
    argscheck(args);
    const name = args._.shift();
    const found = await findAccount(name);
    let {data} = await api.delete(`/accounts/${found.id}`);
    return {
      status: 'Account deleted!',
      account: data.name
    };
  },
  edit: async (args) => {
    argscheck(args);
    const oldName = args._.shift();
    const name = args._.shift();

    if (!name) {
      throw new Error('You must provide a new name too!');
    }

    const found = await findAccount(oldName);
    let {data} = await api.put(`/accounts/${found.id}`, { name });
    return {
      status: 'Account updated!',
      account: data.name
    };
  },
  create: async (args) => {
    argscheck(args);
    const name = args._.join(' ');
    const description = args.description || '';
    const type = args.type || 'checking';

    let {data} = await api.post('/accounts', { name, description, type });
    return {
      status: 'Account created!',
      account: data.name
    };
  },
  list: async () => {
    let {data} = await api.get('/accounts');
    return Object.values(data.map(account => account.name));
  },
  more: async (args) => {
    argscheck(args);
    const accountName = args._.shift();
    let found = await findAccount(accountName);
    
    let created_at = moment(found.created_at).format('DD/MM/YYYY').toString();
    let updated_at = moment(found.created_at).format('DD/MM/YYYY').toString();

    let result = {
      name: found.name,
      description: found.description,
      archived: found.archived ? 'yes' : 'no',
      default: found.default ? 'yes' : 'no',
      type: 'checking',
      'created at': created_at,
      'updated at': updated_at,
    }

    return result;
  }
};

