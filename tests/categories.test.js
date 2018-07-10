const api = require('../models/api');
const Adapter = require('axios-mock-adapter');
const mock = new Adapter(api);
const Categories = require('../models/Categories');

describe('Categories test', () => {
  test('Categories has been listed correctly', () => {
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

  test('Get category details', () => {
    const response = [
      {
        id: 0,
        name: 'Lazer',
        created_at: '2018-07-10 17:15:00',
        updated_at: '2018-07-10 17:15:00'
      }
    ];

    const result = {
      name: 'Lazer',
      'created at': '10/07/2018',
      'updated at': '10/07/2018',
    };

    mock.onGet('categories').reply(200, response)
    expect(Categories.see({ _: ['Lazer'] })).resolves.toEqual(result);
  });
});
