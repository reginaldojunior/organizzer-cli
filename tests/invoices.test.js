const api = require('../models/api');
const Adapter = require('axios-mock-adapter');
const mock = new Adapter(api);
const Invoices = require('../models/Invoices');
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
const invoiceExample = {
  id: 180,
  date: '2015-01-15',
  starting_date: '2014-12-03',
  closing_date: '2015-01-02',
  amount_cents: 0,
  payment_amount_cents: 0,
  balance_cents: 0,
  previous_balance_cents: 0,
  credit_card_id: 3
};

mock.onGet('credit_cards').reply(200, [creditCardExample]);
mock.onGet(`credit_cards/${creditCardExample.id}/invoices`).reply(200, [invoiceExample]);

describe('Invoices test', () => {
  test('Invoices has been listed correctly', () => {
    let result = {
      'start date': '03/12/2014',
      'end date': '02/01/2015',
      amount: 0,
      payment: 0,
      balance: 0
    };
    expect(Invoices.list({ _: ['Visa'] })).resolves.toEqual([result]);
  });

  /*
  test('Get invoice details', () => {
    const response = [bankInvoiceExample];

    const result = {
      name: 'Bradesco CC',
      description: 'Bradesco',
      archived: 'no',
      default: 'yes',
      type: 'checking',
      'created at': '22/06/2017',
      'updated at': '31/08/2017',
    };

    mock.onGet('invoices').reply(200, response);
    expect(Invoices.more({ _: ['Bradesco'] })).resolves.toEqual(result);
  });

  test('Create invoice', () => {
    const response = bankInvoiceExample;

    const result = {
      invoice: 'Bradesco CC',
      status: 'Invoice created!',
    };

    mock.onPost('invoices').reply(200, response)
    expect(Invoices.create({ _: ['Bradesco CC'] })).resolves.toEqual(result);
  });

  test('Update invoice', () => {
    const response = bankInvoiceExample;

    const result = {
      invoice: 'Bradesco',
      status: 'Invoice updated!',
    };

    const responsePut = Object.assign({}, response, { name: 'Bradesco' })

    mock.onGet('invoices').reply(200, response);
    mock.onPut(`invoices/${response.id}`).reply(200, responsePut)
    expect(Invoices.edit({ _: ['Bradesco', 'Bradesco'] })).resolves.toEqual(result);
  });

  test('Delete invoice', () => {
    const response = bankInvoiceExample;

    const result = {
      status: 'Invoice deleted!',
      invoice: 'Bradesco CC'
    };

    mock.onGet('invoices').reply(200, response);
    mock.onDelete(`invoices/${response.id}`).reply(200, response)
    expect(Invoices.delete({ _: ['Bradesco'] })).resolves.toEqual(result);
  });
  */
});
