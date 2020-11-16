const jwt = require('jsonwebtoken');
const { knex } = require('../db');
const bcrypt = require('bcrypt');

const authenticate = async (email, password) => {
  const user = await knex('user')
    .select('*')
    .where('email', '=', email)
    .first();
  if (user &&  bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({
      userId: user.id,
      userEmail: user.email,
    }, 'francogifts');
    await knex('user')
      .update({ token })
      .where('id', '=', user.id);
    return {
      ...user,
      token,
    };
  }
  return null;
};

const register = async (email, password, password2) => {
  const user = await knex('user')
    .select('*')
    .where('email', '=', email)
    .first();
  if (user) {
    return {
      error: user.verified ? 'Email ya existe' : 'Email ya existe, pero no ha sido verificado',
    };
  }
  if (password !== password2) {
    return {
      error: 'Contraseñas no coinciden',
    };
  }
  const [id] = await knex('user')
    .insert({
      email,
      password: bcrypt.hashSync(password, 10),
      verified: true,
    }, 'id')
  // TODO: send email to verify
  return {
    user,
  };
};

module.exports = {
  authenticate,
  register,
};
