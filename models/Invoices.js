const api = require('./api');
const moment = require('moment');

const findCreditCard = async (title) => {
  let {data} = await api.get('/credit_cards');
  let found = false;

  (Array.isArray(data) ? data : [data]).forEach(cat => {
    let match = cat.name.match(new RegExp(title, 'g'));
    if (match && match[0]) {
      found = cat;
    }
  });

  if (!found) {
    throw new Error('This credit card was not found!');
  }

  return found;
};

const findInvoice = async (creditCardId, invoiceDate) => {
  let {data} = await api.get(`/credit_cards/${creditCardId}/invoices`);
  let found = false;

  (Array.isArray(data) ? data : [data]).forEach(cat => {
    if (cat.starting_date == moment(invoiceDate).format('YYYY-MM-DD')) {
      found = cat;
    }
  });

  if (!found) {
    throw new Error('This invoice was not found!');
  }

  let {data: invoice} = await api.get(`/credit_cards/${creditCardId}/invoices/${found.id}`);
  return invoice;
};

const argscheck = args => {
  if (!args._ || args._.length === 0) {
    throw new Error('You did not provide any invoice name!');
  }

  return true;
};

module.exports = {
  list: async (args) => {
    const creditCardTitle = args._.shift();

    if (!creditCardTitle) {
      throw new Error('You must provide a credit card title!');
    }

    let creditCard = await findCreditCard(creditCardTitle);
    let {data} = await api.get(`/credit_cards/${creditCard.id}/invoices`);
    let results = data.map(invoice => {
      return {
        'start date': moment(invoice.starting_date).format('DD/MM/YYYY'),
        'end date': moment(invoice.closing_date).format('DD/MM/YYYY'),
        amount: invoice.amount_cents / 100,
        payment: invoice.payment_amount_cents / 100,
        balance: invoice.balance_cents / 100
      };
    });

    return results;
  },
  more: async (args) => {
    argscheck(args);
    const creditCardTitle = args._.shift();
    const invoiceDate = args.invoice;

    if (!creditCardTitle) {
      throw new Error('You must provide a credit card title!');
    }

    const creditCard = await findCreditCard(creditCardTitle);
    const invoice = await findInvoice(creditCard.id, invoiceDate);
    
    let created_at = moment(invoice.created_at).format('DD/MM/YYYY').toString();
    let updated_at = moment(invoice.updated_at).format('DD/MM/YYYY').toString();

    let results = {
      'start date': moment(invoice.starting_date).format('DD/MM/YYYY').toString(),
      'end date': moment(invoice.closing_date).format('DD/MM/YYYY').toString(),
      amount: invoice.amount_cents / 100,
      payment: invoice.payment_amount_cents / 100,
      balance: invoice.balance_cents / 100
    };

    results.transactions = invoice.transactions.map(t => {
      return {
        description: t.description,
        date: moment(t.date).format('DD/MM/YYYY'),
        paid: t.paid ? 'yes' : 'no',
        amount: t.amount_cents / 100,
        'total installments': t.total_installments,
        installment: t.installment,
        recurring: t.recurring ? 'yes' : 'no',
        'account type': t.account_type,
        notes: t.notes,
        attachments: t.attachments_count
      };
    });

    return results;
  },
  pay: async (args) => {
    argscheck(args);
    const creditCardTitle = args._.shift();
    const invoiceDate = args.invoice;

    if (!creditCardTitle) {
      throw new Error('You must provide a credit card title!');
    }

    const creditCard = await findCreditCard(creditCardTitle);
    const invoice = await findInvoice(creditCard.id, invoiceDate);

    const url = `credit_cards/${creditCard.id}/invoices/${invoice.id}/payments`;
    await api.get(url);
    return {
      status: 'Invoice paid successfully!'
    };
  }
};

