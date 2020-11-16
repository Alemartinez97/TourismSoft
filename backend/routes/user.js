const routes = require('express').Router();
const { knex } = require('../db');
const { success, error } = require('../response');
const global = require('../global');
const withUser = require('../middleware/auth');

const getEnhancedUser = async (prop, value) => {
  const user = await knex('user')
    .select('*')
    .where(prop, '=', value)
    .first();
  user.addresses = JSON.parse(user.addresses || '[]');
  delete user.password;
  delete user.token;
  return user;
};

routes.get('/', withUser, async (req, res) => {
  if (req.user) {
    success(res, await getEnhancedUser('id', req.user.id));
  } else {
    error(res, 'User not found');
  }
});

routes.get('/email/:email', async (req, res) => {
  const user = await knex('user')
    .select('*')
    .where('email', req.params.email)
    .first();
  if (user) {
    success(res, await getEnhancedUser('id', user.id));
  } else {
    error(res, 'User not found');
  }
});

routes.post('/register', async (req, res) => {
  if (!!req.body.email || !req.body.password) {
    return error(res, 'Bad request', 400);
  }
  const user = await knex('user')
    .select('*')
    .where('email', '=', req.body.email)
    .first();
  if (!user) {
    await knex('user').insert({
      email: req.body.email,
      verified: false,
      password: req.body.password,
    });
  }
  success(res, await getEnhancedUser('email', req.body.email));
});

routes.post('/login', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return error(res, 'Bad request', 400);
  }
  const user = await knex('user')
    .select('*')
    .where('email', '=', req.body.email);
  if (user && user.password === req.body.password) {
    success(res, await getEnhancedUser('id', user.id));
  } else {
    error(res, 'User not found');
  }
});

const isValidAddress = (address) => {
  return (
    address.street &&
    address.number &&
    address.city &&
    address.zipcode &&
    address.state &&
    address.country
  );
};

routes.put('/', withUser, async (req, res) => {
  let addresses = undefined;
  if (req.body.addresses) {
    if (req.body.addresses.some(address => !isValidAddress(address))) {
      return error(res, 'Bad request', 400);
    }
    addresses = JSON.stringify(req.body.addresses);
  }
  await knex('user')
    .update({
      first: req.body.first || undefined,
      last: req.body.last || undefined,
      ssn: req.body.ssn || undefined,
      preferred_address_index: req.body.preferred_address_index || undefined,
      phone_1: req.body.phone_1 || undefined,
      phone_2: req.body.phone_2 || undefined,
      addresses: addresses || undefined,
    })
    .where('id', req.user.id);
  success(res, await getEnhancedUser('id', req.user.id));
});

routes.get('/init', async (req, res) => {
  success(res, {
    ages: global.get('ages'),
    categories: global.get('categories'),
    orderStatuses: global.get('orderStatuses'),
    variantTypes: global.get('variantTypes'),
  });
});

module.exports = routes;
