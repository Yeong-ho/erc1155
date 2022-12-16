var express = require('express');
var router = express.Router();
const web = require('./web');
const wallet = require('eth-lightwallet');


/* GET users listing. */
router.post('/', async (req, res, next) => {

  let toaddress = req.body.toaddress;
  let mnemonic = req.body.mnemonic;
  let amount = req.body.amount;

  wallet.keystore.createVault({
    password: "1234",
    seedPhrase: mnemonic,
    hdPathString: "m/0'/0'/0'"
  },function(err,ks){
    ks.keyFromPassword("1234",async function(err,pwDerivedKey){

        ks.generateNewAddress(pwDerivedKey,1);
        let address = ks.getAddresses().toString();
        let prikey = ks.exportPrivateKey(address,pwDerivedKey);
        let hash = await web.transfer(prikey,toaddress,amount);
        
      res.send({"txhash": hash});
    })
});   
});

module.exports = router;

