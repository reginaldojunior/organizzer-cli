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

    mock.onGet('categories').reply(200, response);
    expect(Categories.more({ _: ['Lazer'] })).resolves.toEqual(result);
  });

  test('Create category', () => {
    const response = [
      {
        id: 0,
        name: 'Lazer',
        created_at: '2018-07-10 17:15:00',
        updated_at: '2018-07-10 17:15:00'
      }
    ];

    const result = {
      category: 'Lazer',
      status: 'Category created!',
    };

    mock.onPost('categories').reply(200, response)
    expect(Categories.create({ _: ['Lazer'] })).resolves.toEqual(result);
  });

  test('Update category', () => {
    const response = [
      {
        id: 0,
        name: 'Lazer',
        created_at: '2018-07-10 17:15:00',
        updated_at: '2018-07-10 17:15:00'
      }
    ];

    const result = {
      category: 'Lazer 2',
      status: 'Category updated!',
    };

    const responsePut = Object.assign({}, response, { name: 'Lazer 2' })

    mock.onGet('categories').reply(200, response);
    mock.onPut(`categories/0`).reply(200, responsePut)
    expect(Categories.edit({ _: ['Lazer', 'Lazer 2'] })).resolves.toEqual(result);
  });

  test('Delete category', () => {
    const response = [
      {
        id: 0,
        name: 'Lazer',
        created_at: '2018-07-10 17:15:00',
        updated_at: '2018-07-10 17:15:00'
      }
    ];

    const result = {
      status: 'Category deleted!',
      category: 'Lazer'
    };

    mock.onGet('categories').reply(200, response);
    mock.onDelete(`categories/0`).reply(200, response[0])
    expect(Categories.delete({ _: ['Lazer'] })).resolves.toEqual(result);
  });
});
