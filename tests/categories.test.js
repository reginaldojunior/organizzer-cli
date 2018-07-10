const api = require('../models/api');
const Adapter = require('axios-mock-adapter');
const mock = new Adapter();
const Categories = require('../models/Categories');

describe('Categories test', () => {
  test('Categories has been listed correctly', () => {
    expect(Categories.list()).toEqual([{}])
  });
});
