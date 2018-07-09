const axios      = require('axios');
const env        = require('../env')
const helpers    = require('../helpers')

const Transactions = {
    getTransactionsCurrentMonth: new Promise((resolve, reject) => {
        axios.get(helpers.buildUrl('transactions'), {auth: env.auth}).then(response => {
            return resolve(response.data)
        }).catch(error => {
            return reject(error)
        })
    })
}

module.exports = Transactions