const api = require('./api');
const moment = require('moment');

const Transactions = {
  create: async (args) => {
    const date = args._.shift();

    if (!date) {
      throw new Error('You must provide a date!'); 
    }

    const body = {
      description: args.description || '',
      notes: args.note || '',
      amount_cents: (parseInt(args.amount) * 100) || 0
    };

    await api.post('transactions', body);
    return { status: 'Transaction created!' };
  },
  delete: async (args) => {
    let date = args._.shift();

    if (!date) {
      throw new Error('You must provide a date!');
    }

    date = moment(date).format('YYYY-MM-DD').toString();

    let {data} = await api.get('transactions');
    const transaction = data
      .filter(t => t.date === date)
      .shift();

    if (!transaction) {
      throw new Error('Transaction not found!');
    }

    await api.delete(`transactions/${transaction.id}`);

    return { status: 'Transaction deleted!' };
  },
  edit: async (args) => {
    let date = args._.shift();

    const body = {
      description: args.description || '',
      notes: args.note || '',
      amount_cents: (parseInt(args.amount) * 100) || 0
    };

    if (!date) {
      throw new Error('You must provide a date!');
    }

    date = moment(date).format('YYYY-MM-DD').toString();

    let {data} = await api.get('transactions');
    const transaction = data
      .filter(t => t.date === date)
      .shift();

    if (!transaction) {
      throw new Error('Transaction not found!');
    }

    await api.put(`transactions/${transaction.id}`, body);

    return { status: 'Transaction updated!' };
  },
  list: async () => {
    let {data} = await api.get('transactions');

    return data.map(t => {
      return {
        description: t.description,
        date: moment(t.date).format('DD/MM/YYYY'),
        paid: t.paid ? 'yes' : 'no',
        amount: t.amount_cents / 100,
        'total installments': t.total_installments,
        installment: t.installment,
        recurring: t.recurring ? 'yes' : 'no',
        notes: t.notes,
        attachments: t.attachments_count
      };
    });
  },
  more: async (args) => {
    let date = args._.shift();

    if (!date) {
      throw new Error('You must provide a date!');
    }

    date = moment(date).format('YYYY-MM-DD').toString();

    let {data} = await api.get('transactions');
    const transaction = data
      .filter(t => t.date === date)
      .shift();

    if (!transaction) {
      throw new Error('Transaction not found!');
    }

    let { data: account } = await api.get(`accounts/${transaction.account_id}`);

    transaction.account = account.name;

    let { data: creditCard } = await api.get(`credit_cards/${transaction.credit_card_id}`);

    transaction.credit_card = creditCard.name;

    return {
      description: transaction.description,
      date: moment(transaction.date).format('DD/MM/YYYY'),
      paid: transaction.paid ? 'yes' : 'no',
      amount: transaction.amount_cents / 100,
      'total installments': transaction.total_installments,
      installment: transaction.installment,
      recurring: transaction.recurring ? 'yes' : 'no',
      notes: transaction.notes,
      account: transaction.account,
      credit_card: transaction.credit_card,
      attachments: transaction.attachments_count
    };
  }
};

module.exports = Transactions;
