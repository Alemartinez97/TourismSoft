const config = require('config');

const db = config.get('db');
let testDb = {};
if (config.has('test')) {
  testDb = config.get('test');
}

console.log(db, testDb);

module.exports = {
  production: {
    client: 'mysql',
    connection: {
      host: db.host,
      user: db.user,
      password: db.pass,
      database: db.name,
      port: db.port,
      insecureAuth: true,
      multipleStatements: true,
    },
  },
  productionTest: {
    client: 'mysql',
    connection: {
      host: testDb.host,
      user: testDb.user,
      password: testDb.pass,
      database: testDb.name,
      port: testDb.port,
      insecureAuth: true,
      multipleStatements: true,
    },
  },
};