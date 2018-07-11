#! /usr/bin/env node

const Transactions = require('../models/Transactions');
const Categories = require('../models/Categories');
const InitUser = require('../models/Init');
const argv = require('minimist')(process.argv.slice(2));

const Configstore = require('configstore');
const config = new Configstore('organizze');

const prettyjson = require('prettyjson');
const chalk = require('chalk');
const commands = {
  create: {
    transaction: {
      description: '',
      exec: () => {}
    },
    category: {
      description: 'Create category: organizze create category <title>',
      exec: Categories.create
    }
  },
  list: {
    categories: {
      description: 'List categories',
      exec: Categories.list
    }
  },
  more: {
    category: {
      description: 'Show category details: organizze more category <title>',
      exec: Categories.more
    }
  },
  edit: {
    category: {
      description: 'Edit category title: organizze edit category <old-title> <new-title>',
      exec: Categories.edit
    }
  },
  delete: {
    category: {
      description: 'Delete category: organizze delete category <title>',
      exec: Categories.delete
    }
  },
  reset: {
    description: 'Reset your tokens!',
    exec: InitUser
  }
};

if (!config.get('username') || !config.get('token')) {
  argv._.unshift('reset');
}

const action = argv._.shift();
const type = argv._.shift();

if (
  !action ||
  Object.keys(commands).indexOf(action) === -1 ||
  (
    !!commands[action].exec === false &&
    Object.keys(commands[action]).indexOf(type) === -1
  ) ||
  action === 'help'
) {
  if (action !== 'help' && (action || '').length > 0) {
    console.log(chalk.blue('Sorry but this command does not exists :('));
  }

  let commandsData = {};

  Object.keys(commands).forEach(commandAction => {
    let commandsList = commands[commandAction];

    Object.keys(commandsList).forEach(key => {
      commandsData[`${commandAction } ${key}`] = commandsList[key].description;
    });
  });

  console.log(prettyjson.render(commandsData));
  process.exit();
}

const run = async () => {
  try {
    let group = commands[action];
    let results = await (group.exec ? group : group[type]).exec(argv);
    if (results) {
      console.log(prettyjson.render(results));
    }
    return;
  } catch (e) {
    console.error(chalk.red(e));
    return;
  }
};

run().then(() => process.exit());

