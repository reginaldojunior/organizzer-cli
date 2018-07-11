const api = require('../models/api');
const Adapter = require('axios-mock-adapter');
const mock = new Adapter(api);
const Categories = require('../models/Categories');
const categoryExample = {
  id: 6,
  name: 'Marketing',
  color: '8dd47f',
  parent_id: null,
  created_at: '2015-09-15T21:20:44-03:00',
  updated_at: '2015-09-15T21:20:44-03:00'
};

describe('Categories test', () => {
  test('Categories has been listed correctly', () => {
    const response = [categoryExample];

    mock.onGet('categories').reply(200, response)
    expect(Categories.list()).resolves.toEqual([categoryExample.name]);
  });

  test('Get category details', () => {
    const response = [categoryExample];

    const result = {
      name: categoryExample.name,
      'created at': '15/09/2015',
      'updated at': '15/09/2015',
    };

    mock.onGet('categories').reply(200, response);
    expect(Categories.more({ _: [categoryExample.name] })).resolves.toEqual(result);
  });

  test('Create category', () => {
    const response = [categoryExample];

    const result = {
      category: categoryExample.name,
      status: 'Category created!',
    };

    mock.onPost('categories').reply(200, response)
    expect(Categories.create({ _: [categoryExample.name] })).resolves.toEqual(result);
  });

  test('Update category', () => {
    const response = [categoryExample];

    const result = {
      category: 'New Category Name',
      status: 'Category updated!',
    };

    const responsePut = Object.assign(categoryExample, { name: result.category })

    mock.onGet('categories').reply(200, response);
    mock.onPut(`categories/${categoryExample.id}`).reply(200, responsePut)
    expect(Categories.edit({ _: [categoryExample.name], title: 'New Category Name' })).resolves.toEqual(result);
  });

  test('Delete category', () => {
    const response = [categoryExample];

    const result = {
      status: 'Category deleted!',
      category: categoryExample.name
    };

    mock.onGet('categories').reply(200, response);
    mock.onDelete(`categories/${categoryExample.id}`).reply(200, categoryExample)
    expect(Categories.delete({ _: [categoryExample.name] })).resolves.toEqual(result);
  });
});
