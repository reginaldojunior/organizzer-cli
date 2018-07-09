const transactions = require("../models/Transactions")

test('Show all Transactions', () => {
    expect(transactions.getTransactionsCurrentMonth).resolves.toEqual([{
        'name': 'Reginaldo'
    }]);
})