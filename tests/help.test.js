const help = require('../models/Help')

test('List commands', () => {
    expect(help.listCommands()).toBe('list_transactions | List all transactions \n')
})