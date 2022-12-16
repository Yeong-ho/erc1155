const WEB3_PROVIDER_KEY = require('./.env').WEB3_PROVIDER_KEY;
const factorycontract_address = require('./.env').METAROC_FACTORY_ADDRESS;
const contract_address = require('./.env').METAROC_NFT_ADDRESS;
const network_chain = require('./.env').network_chain;


const Web3 = require('web3');
const web3 =  new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER_KEY));
const { Wallet } = require('alchemy-sdk');
const archemy = require('./archemy');
const contractABI = require('./erc1155abi').abi;
const FactorycontractABI = require('./factorycontracabia').abi;

exports.getNftBalanceOf =async function(contract,wallet,tokenid){

    
  const nftContract = new web3.eth.Contract(contractABI,contract);
  let balance = await nftContract.methods.balanceOf(wallet,tokenid).call({from:wallet});
  
  return balance;
}

exports.deploy =async function(address,prikey,tokenname, uri){
  const nftFatoryContract = new web3.eth.Contract(FactorycontractABI,factorycontract_address);
  let nonce = await web3.eth.getTransactionCount(address,'latest');
  
  const tx = {
      from: address,
      to: factorycontract_address,
      gas: 2970807,
      nonce,
      maxPriorityFeePerGas: 2999999987,
      value: 0,
      data: nftFatoryContract.methods
        .deployERC1155(tokenname,uri)
        .encodeABI()
  };
  console.log(tx);
  const signedTx = await web3.eth.accounts.signTransaction(tx, prikey);
  const hash = await sendSignedTransaction(signedTx);

  return hash;
}



exports.nftMint = async function(address,prikey,tokenid,amount){
    const nftFatoryContract = new web3.eth.Contract(FactorycontractABI,factorycontract_address);
    let nonce = await web3.eth.getTransactionCount(address,'latest');
    
    const tx = {
        from: address,
        to: factorycontract_address,
        gas: 2970807,
        nonce,
        maxPriorityFeePerGas: 2999999987,
        value: 0,
        data: nftFatoryContract.methods
          .mintERC1155(2,address,tokenid,amount)
          .encodeABI()
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, prikey);
    const hash = await sendSignedTransaction(signedTx);

    return hash;
}

exports.transfer = async function(prikey,toaddress,amount){

  let wallet = new Wallet(prikey);
  let nonce = await web3.eth.getTransactionCount(wallet.address,'latest');

  let tx = {
    to: toaddress,
    value: Web3.utils.toWei(amount,"ether"),
    gasLimit: "21000",
    maxPriorityFeePerGas: Web3.utils.toWei("5","Gwei"),
    maxFeePerGas: Web3.utils.toWei("20","Gwei"),
    nonce: nonce,
    type: 2,
    chainId: network_chain,
  };

  let rawTransaction = await wallet.signTransaction(tx);
  const hash = await archemy.sendTransaction(rawTransaction);
  
  return hash;
}

exports.nftTransfer = async function(fromaddress,prikey,toaddress,tokenid,amount){
    const nftContract = new web3.eth.Contract(contractABI,contract_address);
    let nonce = await web3.eth.getTransactionCount(fromaddress,'latest');
    
    const tx = {
        from: fromaddress,
        to: contract_address,
        gas: 2970807,
        nonce,
        maxPriorityFeePerGas: 2999999987,
        value: 0,
        data: nftContract.methods
          .safeTransferFrom(fromaddress,toaddress,tokenid,amount,"0x00")
          .encodeABI()
    };
    
    const signedTx = await web3.eth.accounts.signTransaction(tx, prikey);
    const hash = await sendSignedTransaction(signedTx);

    return hash;
}

exports.getGasPrice = async function(){

    let fee = await web3.eth.getGasPrice();
    return fee;
}

exports.getTransaction = async function(hash){

    let block = await web3.eth.getTransaction(hash);
    return block;
}

exports.getBalance = async function(address){
    let balance = await web3.eth.getBalance(address);
    return balance;
}

exports.callContract = async function(index){
  const nftContract = new web3.eth.Contract(FactorycontractABI,factorycontract_address);
  const contract = await nftContract.methods.tokens(index).call({from:factorycontract_address});
  return contract;
}






const sendSignedTransaction = (signedTx) =>
  new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, (err, hash) => {
      if (!err) {
        return resolve(hash);
      }
      return reject(err);
    });
  });