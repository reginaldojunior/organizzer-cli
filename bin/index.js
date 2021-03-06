#! /usr/bin/env node

const Transactions = require('../models/Transactions');
const Categories = require('../models/Categories');
const BankAccounts = require('../models/BankAccounts');
const CreditCards = require('../models/CreditCards');
const Invoices = require('../models/Invoices');
const Users = require('../models/Users');
const InitUser = require('../models/Init');
const argv = require('minimist')(process.argv.slice(2));

const Configstore = require('configstore');
const config = new Configstore('organizze');

const prettyjson = require('prettyjson');
const chalk = require('chalk');

const commands = {
  create: {
    category: {
      description: 'Create category: organizzer create category <title>',
      exec: Categories.create
    },
    account: {
      description: 'Create account: organizzer create account <title>',
      exec: BankAccounts.create
    },
    credit_card: {
      description: 'Create credit card: organizzer create credit_card <title> --network=<network> --due=<due day> --closing=<closing day> --limit=<limit>',
      exec: CreditCards.create
    },
    transaction: {
      description: 'Create transaction: organizzer create transaction <date> --description=<description> --notes=<notes> --amount=<amount>',
      exec: Transactions.create
    },
  },
  list: {
    categories: {
      description: 'List categories: organizzer list categories',
      exec: Categories.list
    },
    accounts: {
      description: 'List bank accounts: organizzer list accounts',
      exec: BankAccounts.list
    },
    credit_cards: {
      description: 'List credit cards: organizzer list credit_cards',
      exec: CreditCards.list
    },
    transactions: {
      description: 'List all transactions of month: organizzer list transactions',
      exec: Transactions.list
    },
    invoices: {
      description: 'List invoices by credit card: organizzer list invoices <credit-card-title>',
      exec: Invoices.list
    },
    users: {
      description: 'List users: organizzer list users',
      exec: Users.list
    },
  },
  more: {
    category: {
      description: 'Show category details: organizzer more category <title>',
      exec: Categories.more
    },
    account: {
      description: 'Show account details: organizzer more account <title>',
      exec: BankAccounts.more
    },
    credit_card: {
      description: 'Show credit card details: organizzer more credit_card <title>',
      exec: CreditCards.more
    },
    transaction: {
      description: 'Get details of a transaction: organizzer more transaction <date>',
      exec: Transactions.more
    },
    invoice: {
      description: 'Get invoice\'s transactions by credit card: organizzer more invoice <credit-card-title> --invoice=<invoice-date>',
      exec: Invoices.more
    },
    user: {
      description: 'Get user data: organizzer more user <email>',
      exec: Users.more
    },
  },
  edit: {
    category: {
      description: 'Edit category title: organizzer edit category <old-title> --title=<new-title>',
      exec: Categories.edit
    },
    account: {
      description: 'Edit account title: organizzer edit account <old-title> <new-title>',
      exec: BankAccounts.edit
    },
    credit_card: {
      description: 'Edit credit card: organizzer edit credit_card <old-title> --title=<new-title> --due=<due day> --closing=<closing day> --invoices-since=<invoices-since>',
      exec: CreditCards.edit
    },
    transaction: {
      description: 'Edit transaction: organizzer edit transaction <date> --description=<description> --notes=<notes> --amount=<amount>',
      exec: Transactions.edit
    },
  },
  delete: {
    category: {
      description: 'Delete category: organizzer delete category <title>',
      exec: Categories.delete
    },
    account: {
      description: 'Delete account: organizzer delete account <title>',
      exec: BankAccounts.delete
    },
    credit_card: {
      description: 'Delete credit card: organizzer delete credit_card <title>',
      exec: CreditCards.delete
    },
    transaction: {
      description: 'Delete transaction: organizzer delete transaction <date>',
      exec: Transactions.delete
    },
  },
  reset: {
    description: 'Reset your tokens!',
    exec: InitUser
  },
  pay: {
    invoice: {
      description: 'Pay invoice: organizzer pay invoice <credit-card-title> --invoice=<invoice-date>',
      exec: Invoices.pay
    },
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
  } catch (error) {
    if (error.response) {
      if (error.response.status === 422) {
        console.log(chalk.red(prettyjson.render(error.response.data.errors)));
      } else {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    return;
  }
};

run().then(() => process.exit());

