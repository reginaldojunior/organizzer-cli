#! /usr/bin/env node

const Transactions = require('../models/Transactions');
const InitUser = require('../models/Init');
const argv = require('minimist')(process.argv.slice(2));

const Configstore = require('configstore');
const config = new Configstore('organizze');

const prettyjson = require('prettyjson');
const chalk = require('chalk');
const commands = {
  list_transactions: {
    description: 'List transactions of current month',
    exec: Transactions.getTransactionsCurrentMonth
  },
  init: {
    description: 'Do the auth thing',
    exec: InitUser
  }
};
let firstCommand = argv._.shift();

if (!config.username || !config.token) {
  firstCommand = 'init';
}

if (
  !firstCommand ||
  Object.keys(commands).indexOf(firstCommand) === -1 ||
  firstCommand === 'help'
) {
  if (firstCommand !== 'help') {
    console.log(chalk.blue('Sorry but this command does not exists :('));
  }

  let commandsData = {};

  Object.keys(commands).forEach(k => {
    let obj = commands[k];
    delete obj.exec;
    commandsData[k] = obj;
  });

  console.log(prettyjson.render(commandsData));
  process.exit();
}

const run = async () => {
  try {
    // Need to think about some way of args injection
    let results = await commands[firstCommand].exec();
    console.log(prettyjson.render(results));
    return 0;
  } catch (e) {
    console.error(chalk.red(e));
    return 0;
  }
};

run().then(() => process.exit());

