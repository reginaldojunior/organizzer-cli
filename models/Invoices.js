const api = require('./api');
const moment = require('moment');

const findInvoice = async (creditCardId, invoiceName) => {
  let {data} = await api.get(`/credit_cards/${creditCardId}/invoices`);
  let found = false;

  (Array.isArray(data) ? data : [data]).forEach(cat => {
    let match = cat.name.match(new RegExp(invoiceName, 'g'));
    if (match && match[0]) {
      found = cat;
    }
  });

  if (!found) {
    throw new Error('This invoice was not found!');
  }

  return found;
};

const argscheck = args => {
  if (!args._ || args._.length === 0) {
    throw new Error('You did not provide any invoice name!');
  }

  return true;
};

module.exports = {
  delete: async (args) => {
    argscheck(args);
    const name = args._.shift();
    const found = await findInvoice(name);
    let {data} = await api.delete(`/invoices/${found.id}`);
    return {
      status: 'Invoice deleted!',
      invoice: data.name
    };
  },
  edit: async (args) => {
    argscheck(args);
    const oldName = args._.shift();
    const name = args._.shift();

    if (!name) {
      throw new Error('You must provide a new name too!');
    }

    const found = await findInvoice(oldName);
    let {data} = await api.put(`/invoices/${found.id}`, { name });
    return {
      status: 'Invoice updated!',
      invoice: data.name
    };
  },
  create: async (args) => {
    argscheck(args);
    const name = args._.join(' ');
    const description = args.description || '';
    const type = args.type || 'checking';

    let {data} = await api.post('/invoices', { name, description, type });
    return {
      status: 'Invoice created!',
      invoice: data.name
    };
  },
  list: async (args) => {
    const creditCardTitle = args._.shift();

    if (!creditCardTitle) {
      throw new Error('You must provide a credit card title!');
    }

    let {data} = await api.get('/invoices');
    return Object.values(data.map(invoice => invoice.name));
  },
  more: async (args) => {
    argscheck(args);
    const invoiceName = args._.shift();
    let found = await findInvoice(invoiceName);
    
    let created_at = moment(found.created_at).format('DD/MM/YYYY').toString();
    let updated_at = moment(found.updated_at).format('DD/MM/YYYY').toString();

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

