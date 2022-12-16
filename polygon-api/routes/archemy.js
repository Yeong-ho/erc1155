const API_KEY = require('./.env').API_KEY;
const { Alchemy, Network, Wallet, Utils } =require("alchemy-sdk");
const settings = {
   apiKey: API_KEY, // Replace with your Alchemy API Key.
   network: Network.MATIC_MUMBAI, // Replace with your network.
};
const alchemy = new Alchemy(settings);


exports.getNfts = async function (wallet){

 let nftlist = await alchemy.nft.getNftsForOwner(wallet);
  return nftlist;
}

exports.getOwners = async function (contract,tokenid){

 let owners = await alchemy.nft.getOwnersForNft(contract,tokenid);
   return owners;
}

exports.getBlockNumber  = async function (num){

 let blocknumber = await alchemy.core.getBlockNumber(num);
  return blocknumber.toString();
}


exports.getMetaData  = async function (contract,tokenid){
 
 let metadata = await alchemy.nft.getNftMetadata(contract,tokenid);
   return metadata;
}

exports.getNoce  =  async function (wallet){

 let nonce = await alchemy.core.getTransactionCount(wallet, "latest");
   return nonce;
}

exports.getRawTransaction  =  async function (tx){
 let rawTransaction = await wallet.signTransaction(tx);
    return rawTransaction;
}

exports.sendTransaction =  async function (rawTransaction){
    
   const signedTx = await alchemy.transact.sendTransaction(rawTransaction);
    return signedTx
}