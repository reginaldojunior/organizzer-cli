const api = require('../models/api');
const Adapter = require('axios-mock-adapter');
const mock = new Adapter(api);
const BankAccounts = require('../models/BankAccounts');
const bankAccountExample = {
  id: 3,
  name: 'Bradesco CC',
  description: 'Bradesco',
  archived: false,
  created_at: '2017-06-22T16:17:03-03:00',
  updated_at: '2017-08-31T22:24:24-03:00',
  default: true,
  type: 'checking'
};

describe('BankAccounts test', () => {
  test('BankAccounts has been listed correctly', () => {
    const response = [bankAccountExample];

    mock.onGet('accounts').reply(200, response)
    expect(BankAccounts.list()).resolves.toEqual(['Bradesco CC']);
  });

  test('Get account details', () => {
    const response = [bankAccountExample];

    const result = {
      name: 'Bradesco CC',
      description: 'Bradesco',
      archived: 'no',
      default: 'yes',
      type: 'checking',
      'created at': '31/08/2017',
      'updated at': '31/08/2017',
    };

    mock.onGet('accounts').reply(200, response);
    expect(BankAccounts.more({ _: ['Bradesco'] })).resolves.toEqual(result);
  });

  test('Create account', () => {
    const response = bankAccountExample;

    const result = {
      account: 'Bradesco CC',
      status: 'Account created!',
    };

    mock.onPost('accounts').reply(200, response)
    expect(BankAccounts.create({ _: ['Bradesco CC'] })).resolves.toEqual(result);
  });

  test('Update account', () => {
    const response = bankAccountExample;

    const result = {
      account: 'Bradesco',
      status: 'Account updated!',
    };

    const responsePut = Object.assign({}, response, { name: 'Bradesco' })

    mock.onGet('accounts').reply(200, response);
    mock.onPut(`accounts/0`).reply(200, responsePut)
    expect(BankAccounts.edit({ _: ['Bradesco', 'Bradesco'] })).resolves.toEqual(result);
  });

  test('Delete account', () => {
    const response = bankAccountExample;

    const result = {
      status: 'Account deleted!',
      account: 'Bradesco CC'
    };

    mock.onGet('accounts').reply(200, response);
    mock.onDelete(`accounts/0`).reply(200, response[0])
    expect(BankAccounts.delete({ _: ['Bradesco'] })).resolves.toEqual(result);
  });
});
