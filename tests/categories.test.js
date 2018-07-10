const api = require('../models/api');
const Adapter = require('axios-mock-adapter');
const mock = new Adapter(api);
const Categories = require('../models/Categories');

describe('Categories test', () => {
  test('Categories has been listed correctly', async () => {
    const response = [
      {
        id: 0,
        name: 'Lazer',
        color: '#fffffff',
        created_at: '2018'
      }
    ];

    mock.onGet('categories').reply(200, response)
    expect(Categories.list()).resolves.toEqual(['Lazer']);
  });
});
