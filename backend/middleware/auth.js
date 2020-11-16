const jwt = require('jsonwebtoken');
const { knex } = require('../db');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'francogifts');
    const userEmail = decodedToken.userEmail;
    if (!userEmail) {
      throw 'Invalid user ID';
    }
    const user = await knex('user')
      .select('*')
      .where('email', '=', userEmail)
      .first();
    if (user) {
      req.user = user;
      next();
    } else {
      throw 'Invalid user ID';
    }
  } catch(e) {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};