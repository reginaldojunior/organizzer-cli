const api = require('./api');

const Transactions = {
    list: () => new Promise((resolve, reject) => {
        api.get('transactions').then(response => {
            return resolve(response.data);
        }).catch(error => {
            return reject(error);
        });
    }),
    more: (args) => new Promise((resolve, reject) => {
        id = args._.shift();

        api.get('transactions/' + id).then(response => {
            return resolve(response.data)
        }).catch(error => {
            return reject(error)
        })
    })
};

module.exports = Transactions;
