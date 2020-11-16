const routes = require('express').Router();
const { importCsv } = require('../service/import');
const { success, error } = require('../response');

routes.post('/csv-import', async (req, res) => {
  console.log('importing', req.body);
  try {
    await importCsv(req.body);
    success(res, 'OK');
  } catch(e) {
    error(res, e);
  }
});

module.exports = routes;
