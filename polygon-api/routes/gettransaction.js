var express = require('express');
var router = express.Router();
const web = require('./web');
const wallet = require('eth-lightwallet');


/* GET users listing. */
router.post('/', async (req, res, next) => {

  let hash = req.body.txhash;
  let transactioninfo = await web.getTransaction(hash);

  res.send(transactioninfo);
});

module.exports = router;

