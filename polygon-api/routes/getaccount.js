var express = require('express');
var router = express.Router();
const wallet = require('eth-lightwallet');


/* GET users listing. */
router.get('/',async (req, res, next) =>{

  let mnemonic = wallet.keystore.generateRandomSeed();
  
  wallet.keystore.createVault(
    {
      password: '1234',
      seedPhrase: mnemonic,
      hdPathString: "m/0'/0'/0'",
    },
    (err, ks) => {
      ks.keyFromPassword('1234',(err, key) => {
        ks.generateNewAddress(key, 1);

        let address = ks.getAddresses().toString();
        
        res.send({ "mnemonic": mnemonic, "address": address });
      });
    }
  );  
});

module.exports = router;

