#! /usr/bin/env node

const arguments    = process.argv.splice(2, process.argv.length -1).join(' ')
const Transactions = require('../models/Transactions')
const Help         = require('../models/Help')
const prettyjson   = require('prettyjson')

if (arguments === 'help') 
    Help.listCommands()

if (arguments === 'list_transactions') 
    Transactions.getTransactionsCurrentMonth.then(response => {
        console.log(prettyjson.render(response))
    })
