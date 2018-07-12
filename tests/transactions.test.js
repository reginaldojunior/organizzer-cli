const api = require('../models/api');
const Adapter = require('axios-mock-adapter');
const mock = new Adapter(api);
const Transactions = require('../models/Transactions')
const transactionExample = {
  id: 15,
  description: 'SAQUE LOT',
  date: '2015-09-06',
  paid: false,
  amount_cents: -15000,
  total_installments: 1,
  installment: 1,
  recurring: false,
  account_id: 3,
  category_id: 21,
  contact_id: null,
  notes: '',
  attachments_count: 0,
  credit_card_id: 3,
  credit_card_invoice_id: 189,
  paid_credit_card_id: null,
  paid_credit_card_invoice_id: null,
  oposite_transaction_id: null,
  oposite_account_id: null,
  created_at: '2015-07-01T10:52:06-03:00',
  updated_at: '2015-08-04T20:17:17-03:00'
};

const accountExample = {
  id: 3,
  name: 'Bradesco CC',
  description: 'Bradesco',
  archived: false,
  created_at: '2017-06-22T16:17:03-03:00',
  updated_at: '2017-08-31T22:24:24-03:00',
  default: true,
  type: 'checking'
};

const creditCardExample = {
  id: 3,
  name: 'Visa Exclusive',
  description: 'Visa Description',
  card_network: 'visa',
  closing_day: 4,
  due_day: 17,
  limit_cents: 1200000,
  kind: 'credit_card',
  archived: true,
  default: false,
  created_at: '2018-06-22T16:45:30-03:00',
  updated_at: '2018-09-01T18:18:48-03:00'
};

mock.onGet('transactions').reply(200, [transactionExample]);
mock.onGet(`transactions/${transactionExample.id}`).reply(200, transactionExample);
mock.onGet(`accounts/${transactionExample.account_id}`).reply(200, accountExample);
mock.onGet(`credit_cards/${transactionExample.credit_card_id}`).reply(200, creditCardExample);

describe('Transactions Test', () => {
  test('Transactions has been listed correctly', () => {
    const result = [
      {
        description: 'SAQUE LOT',
        date: '06/09/2015',
        paid: 'no',
        amount: -150,
        'total installments': 1,
        installment: 1,
        recurring: 'no',
        notes: '',
        attachments: 0
      }
    ];
    expect(Transactions.list()).resolves.toEqual(result);
  })

  test('Get details of transaction', () => {
    const result = {
      description: 'SAQUE LOT',
      date: '06/09/2015',
      paid: 'no',
      amount: -150,
      'total installments': 1,
      installment: 1,
      recurring: 'no',
      notes: '',
      account: 'Bradesco CC',
      credit_card: 'Visa Exclusive',
      attachments: 0
    };

    expect(Transactions.more({ _: ['2015-09-06'] })).resolves.toEqual(result);
  })
})
