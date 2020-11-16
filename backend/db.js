const mysql = require('mysql');
const Promise = require('bluebird');
const config = require('config');

const dbConfig = config.get('db');

const DB_DATA = {
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.pass,
  database: dbConfig.name,
  port: dbConfig.port,
};

console.log(DB_DATA)

const con = mysql.createConnection({
  ...DB_DATA,
  insecureAuth: true,
  multipleStatements: true,
});

const knex = require('knex')({
  client: 'mysql',
  connection: {
    ...DB_DATA,
    insecureAuth: true,
    multipleStatements: true,
  }
});

const connect = () => {
  return new Promise((resolve, reject) => {
    con.connect(function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(con);
      }
    });
  });
};

const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    con.query(sql, values, function(err, rows, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const close = () => {
  return new Promise((resolve, reject) => {
    con.close(function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(con);
      }
    });
  });
};

const upsert = async (table, props) => {
  const insert = knex(table).insert(props).toString();
  const update = knex(table).update(props);
  const query = `${insert.toString()} ON DUPLICATE KEY UPDATE ${update.toString().replace(/^update\s.*\sset\s/i, '')}`;
  return await knex.raw(query);
};


module.exports = {
  connect,
  query,
  knex,
  close,
  upsert,
};