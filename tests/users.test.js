const api = require('../models/api');
const Adapter = require('axios-mock-adapter');
const mock = new Adapter(api);
const Users = require('../models/Users');
const userExample = {
  id: 3,
  name: 'Esdras Mayrink',
  email: 'falecom@email.com.br',
  role: 'admin'
};

mock.onGet('users').reply(200, [userExample]);
mock.onGet(`users/${userExample.id}`).reply(200, userExample);

describe('Users test', () => {
  test('Users has been listed correctly', () => {
    const result = Object.assign({}, userExample);
    delete result.id;
    delete result.role;
    expect(Users.list()).resolves.toEqual([result]);
  });

  test('Get user details', () => {
    const result = Object.assign({}, userExample);
    delete result.id;
    expect(Users.more({ _: ['falecom'] })).resolves.toEqual(result);
  });
});
