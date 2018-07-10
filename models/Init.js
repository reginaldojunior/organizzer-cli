const Configstore = require('configstore');
const config = new Configstore('organizze');
const figlet = require('figlet');
const inquirer = require('inquirer');
const show = () => new Promise((resolve, reject) => {
  figlet('Organizze', (err, data) => {
    if (err) {
      return reject(err);
    }

    return resolve(data);
  });
});

module.exports = async () => {
  console.log(await show());

  const questions = [
    {
      type: 'input',
      name: 'username',
      message: 'Enter your username',
    },
    {
      type: 'input',
      name: 'token',
      message: 'Enter your token',
      description: 'You can get your token here: https://app.organizze.com.br/configuracoes/api-keys'
    },
  ];

  let r = await inquirer.prompt(questions);

  if (r.username.length === 0 || r.token.length === 0) {
    throw new Error('You need to authenticate first!');
  }

  config.set('username', r.username);
  config.set('token', r.token);

  console.log(chalk.green('Success! Your Organizze account has been authenticated.'));
  return false;
};

