const api = require('./api');
const moment = require('moment');

const findUser = async (email) => {
  let {data} = await api.get(`/credit_cards/${creditCardId}/users`);
  let found = false;

  (Array.isArray(data) ? data : [data]).forEach(cat => {
    if (cat.starting_date == moment(userDate).format('YYYY-MM-DD')) {
      found = cat;
    }
  });

  if (!found) {
    throw new Error('This user was not found!');
  }

  let {data: user} = await api.get(`/credit_cards/${creditCardId}/users/${found.id}`);
  return user;
};

const argscheck = args => {
  if (!args._ || args._.length === 0) {
    throw new Error('You did not provide any user email!');
  }

  return true;
};

module.exports = {
  list: async (args) => {
    let {data} = await api.get('users');
    let results = data.map(user => {
      delete user.id;
      delete user.role;
      return user;
    });

    return results;
  },
  more: async (args) => {
    argscheck(args);
    const email = args._.shift();

    if (!email) {
      throw new Error('You must provide an email!');
    }

    let {data} = await api.get('users');
    let user = data
      .map(user => {
        delete user.id;
        return user;
      })
      .filter(u => u.email.match(new RegExp(email, 'g')))
      .shift();

    if (!user) {
      throw new Error('User not found!');
    }

    return user;
  },
};

