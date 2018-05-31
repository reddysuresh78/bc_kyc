var Web3 = require('web3');
var util = require('ethereumjs-util');
var tx = require('ethereumjs-tx');
var lightwallet = require('eth-lightwallet');
var ipfsAPI = require('ipfs-api')
var fs = require('fs');
var txutils = lightwallet.txutils;
var web3 = new Web3(
  new Web3.providers.HttpProvider('http://localhost:8545')
);
var ipfs = ipfsAPI('localhost', '5001', { protocol: 'http' })

//Ethereum sender address
var address = '0xA298BFe6884B8dCAb53aFc570Ae1815eAAfC9759';

//Sender's private key
var key = '287937eaa7cc5ace0369f710e241ceea6b8e7dccdad0c13e986e6b95c3b097ab';

var addressfile = require('../build/MedicalRecAddress.json')

var contractAddress = addressfile.address;

console.log("Contract Address: " + contractAddress);

var interface = require('../build/contracts/MedicalRec.json');

// console.log(interface);

var contract = web3.eth.contract(interface.abi);
var instance = contract.at(contractAddress);


module.exports = {

 
    recordVaccine: function (vaccineDtls) {

      console.log("Recording Vaccine");

      instance.recordGivenVaccine(web3.toHex(vaccineDtls.toWho),
        web3.toHex(vaccineDtls.byWhom),
        web3.toHex(vaccineDtls.vaccine),
        web3.toHex(vaccineDtls.date),
        web3.toHex(vaccineDtls.location),
        { from: address, gas: 500000, gasLimit: 500000, gasPrice: 2000000000 });
    },

    searchVaccineInfo: async (searchCriteria, callbackfunc) => {
  
      criteria = { toWho: searchCriteria };

      let vaccineEvents = instance.VaccineGiven(criteria, { fromBlock: 0, toBlock: 'latest' })

      console.log("Retrieving Vaccine Info");

      retValue = { history: [] };

      const finalval = await vaccineEvents.get(async (error, logs) => {
 
        // we have the logs, now print them
        await logs.forEach(
          function (log) {

            var toWhoAscii = web3.toAscii(log.args.toWho);
 
            var curRec = {
              toWho :  toWhoAscii ,
              byWhom : web3.toAscii(log.args.byWhom),
              vaccine : web3.toAscii(log.args.vaccine),
              date : web3.toAscii(log.args.date),
              location : web3.toAscii(log.args.location)
          };
          retValue.history.push(   curRec );
          }
        )
        // console.log(retValue);
        callbackfunc( retValue);
        return retValue;    
      });
      // console.log("Final value" + JSON.stringify(finalval));
      return finalval;

    },

    storeFile: function (filename, stream) {

      let readablestream = fs.createReadStream(filename);
      let result = readablestream.read();
 
      const files = [
        {
          path: '/tmp/myfile.txt',
          content: result
        }
      ]


      ipfs.files.add(files, function (err, ofiles) {
        console.log('ERROR: ' + err);

        ofiles.forEach(
          function (file) {
            console.log('File saved successfully with following details') ;
            console.log(file.hash);
            console.log(file.path);
            console.log(file.size);
          }

        )
      });

      // 'files' will be an array of objects containing paths and the multihashes of the files added
    }
   
};

