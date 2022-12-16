var express = require('express');
var router = express.Router();
const web = require('./web')


/* GET users listing. */
router.post('/', async (req, res, next) => {

  let address = req.body.address;
 

  let result = await web.getBalance(address);

  const data = { 
    
        "address" : address,
        "balance" : amounttoint(result)
  };
  
  console.log(data);
  res.send(data);
});

function amounttoint(val){

  if(val.length>18){
  
      let int = val.substring(0,val.length-18)
      let float = val.substring(val.length-18,val.length);
      let result = int+'.'+float;

      return result;
  }
  else if(val.length==18){
      let result = '0.'+val;

      return result;
  }

  else{
      let ether =  '000000000000000000';
      
      let result = '0.'+ether.substring(0, ether.length-val.length)+val;

      return result;
  }
}

module.exports = router;


