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
};
const action = argv._.shift();
const type = argv._.shift();

if (!config.get('username') || !config.get('token')) {
  InitUser().then(() => process.exit());
}

if (
  !action ||
  Object.keys(commands).indexOf(action) === -1 ||
  Object.keys(commands[action]).indexOf(type) === -1 ||
  action === 'help'
) {
  if (action !== 'help') {
    console.log(chalk.blue('Sorry but this command does not exists :('));
  }

  let commandsData = {};

  Object.keys(commands).forEach(commandAction => {
    let commandsList = commands[commandAction];

    Object.keys(commandsList).forEach(key => {
      commandsData[key] = commandsList[key].description;
    });
  });

  console.log(prettyjson.render(commandsData));
  process.exit();
}

const run = async () => {
  try {
    let results = await commands[action][type].exec(argv);
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

