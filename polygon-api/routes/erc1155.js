var express = require('express');
var router = express.Router();
const web = require('./web');
const archemy = require('./archemy');
const wallet = require('eth-lightwallet');


/* GET ERC1155. */
router.post('/', async (req, res, next) => {

    res.send({"method": ["getnfts","transfer","mint","delpoy","getbalanceof","getowners","metadata","contract"]});  
});

/* GET NFT BALANCE */
router.post('/getbalanceof', async (req, res, next) => {

  let address = req.body.address;
  let tokenid = req.body.tokenid;
  let contract = req.body.contract;

  let result = await web.getNftBalanceOf(contract,address,tokenid);

  const data = { 
    
        "contract" : contract,
        "address" : address,
        'tokenid': tokenid,
        "balance" : result
  };
 
  res.send(data);
});


/* GET NFT TRANSFER. */
router.post('/transfer', async (req, res, next) => {

  let mnemonic = req.body.mnemonic;
  let toaddress = req.body.toaddress;
  let tokenid = req.body.tokenid;
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
        let hash = await web.nftTransfer(address,prikey,toaddress,tokenid,amount);
        
      res.send({"txhash": hash});
    })
}); 
});

/* GET NFT MINT. */
router.post('/mint', async (req, res, next) => {

  let mnemonic = req.body.mnemonic;
  let tokenid = req.body.tokenid;
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
        let hash = await web.nftMint(address,prikey,tokenid,amount);
      
      res.send({"txhash": hash});
    })
}); 
});

/* GET NFT CONTRACT DEPLOY */
router.post('/deploy', async (req, res, next) => {

  let mnemonic = req.body.mnemonic;
  let tokenname = req.body.tokenname;
  let uri = req.body.uri;

  wallet.keystore.createVault({
    password: "1234",
    seedPhrase: mnemonic,
    hdPathString: "m/0'/0'/0'"
  },function(err,ks){
    ks.keyFromPassword("1234",async function(err,pwDerivedKey){

        ks.generateNewAddress(pwDerivedKey,1);
        let address = ks.getAddresses().toString();
        let prikey = ks.exportPrivateKey(address,pwDerivedKey);
        let hash = await web.deploy(address,prikey,tokenname,uri);
      
      res.send({"txhash": hash});
    })
}); 
});


/* GET NFT LIST. */
router.post('/getnfts', async (req, res, next) => {

  let data = [];

  try{
  let wallet = req.body.address;
  let nftlist = await archemy.getNfts(wallet);
  for(idx in nftlist.ownedNfts){
    
    let balnace = await web.getNftBalanceOf(nftlist.ownedNfts[idx].contract.address,wallet,nftlist.ownedNfts[idx].tokenId)
  
    let tmp = {
       contract:nftlist.ownedNfts[idx].contract.address, 
       tokenId: nftlist.ownedNfts[idx].tokenId,
       balance : balnace
     };
     data.push(tmp);
   };
}
  catch(err){res.status(500).send(err);}
  
  res.send(data);
});

/* GET NFT OWNERS LIST. */
router.post('/getowners', async (req, res, next) => {

  let nftlist;

  try{
  let contract = req.body.contract;
  let tokenid = req.body.tokenid;
  
  nftlist = await archemy.getOwners(contract,tokenid);
  
  }
  catch(err){res.send(err);}
  
  res.send(nftlist);
});

/* GET NFT METADATA */
router.post('/getmetadata', async (req, res, next) => {
  
  let nftlist;

  try{
  let contract = req.body.contract;
  let tokenid = req.body.tokenid;

  nftlist = await archemy.getMetaData(contract,tokenid);
  }
  catch(err){res.send(err);}
  
  res.send(nftlist);
});

/* GET CONTRACT ADDRESS*/
router.post('/contract',async(req, res, next) => {
  try{
  let contract = {contract: await web.callContract(req.body.index)};

  res.send(contract)
  }catch(err){res.send(err);}
});



module.exports = router;


