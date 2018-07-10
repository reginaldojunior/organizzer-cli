const api = require('./api');

const Transactions = {
    getTransactionsCurrentMonth: () => new Promise((resolve, reject) => {
        api.get('transactions').then(response => {
            return resolve(response.data);
        }).catch(error => {
            return reject(error);
        });
    })
};

module.exports = Transactions;
