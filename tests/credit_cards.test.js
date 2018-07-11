const api = require('../models/api');
const Adapter = require('axios-mock-adapter');
const mock = new Adapter(api);
const CreditCards = require('../models/CreditCards');
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

describe('CreditCards test', () => {
  test('CreditCards has been listed correctly', () => {
    const response = [creditCardExample];

    mock.onGet('credit_cards').reply(200, response)
    expect(CreditCards.list()).resolves.toEqual(['Visa Exclusive']);
  });

  test('Get credit_card details', () => {
    const response = [creditCardExample];

    const result = {
      name: 'Visa Exclusive',
      description: 'Visa Description',
      'card network': 'visa',
      'closing day': 4,
      'due day': 17,
      limit: 'R$ 12000',
      kind: 'credit_card',
      archived: 'yes',
      default: 'no',
      'created at': '22/06/2018',
      'updated at': '01/09/2018'
    };

    mock.onGet('credit_cards').reply(200, response);
    expect(CreditCards.more({ _: ['Visa'] })).resolves.toEqual(result);
  });

  test('Create credit_card', () => {
    const response = creditCardExample;

    const result = {
      credit_card: 'Visa Exclusive',
      status: 'Credit Card created!',
    };

    mock.onPost('credit_cards').reply(200, response)
    const args = {
      _: ['Visa Exclusive'],
      network: 'hipercard',
      due: 15,
      closing: 28,
      limit: 120000
    };
    expect(CreditCards.create(args)).resolves.toEqual(result);
  });

  test('Update credit_card', () => {
    const response = creditCardExample;

    const result = {
      credit_card: 'Visa',
      status: 'Credit Card updated!',
    };

    const responsePut = Object.assign({}, response, { name: 'Visa' })

    mock.onGet('credit_cards').reply(200, response);
    mock.onPut(`credit_cards/${response.id}`).reply(200, responsePut)
    const args = {
      _: ['Visa Exclusive'],
      due: 15,
      closing: 28,
      title: 'Visa',
      'invoices-since': '2018-01-01'
    };
    expect(CreditCards.edit(args)).resolves.toEqual(result);
  });

  test('Delete credit_card', () => {
    const response = creditCardExample;

    const result = {
      status: 'Credit Card deleted!',
      credit_card: 'Visa Exclusive'
    };

    mock.onGet('credit_cards').reply(200, response);
    mock.onDelete(`credit_cards/${response.id}`).reply(200, response)
    expect(CreditCards.delete({ _: ['Visa'] })).resolves.toEqual(result);
  });
});

