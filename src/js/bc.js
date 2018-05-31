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

var address = '0xA298BFe6884B8dCAb53aFc570Ae1815eAAfC9759';
var key = '287937eaa7cc5ace0369f710e241ceea6b8e7dccdad0c13e986e6b95c3b097ab';

addressfile = require('../../build/MedicalRecAddress.json')

var contractAddress = addressfile.address; 

console.log("Contract Address: " + contractAddress);

var interface = require('../../build/contracts/MedicalRec.json');

// console.log(interface);

var contract = web3.eth.contract( interface.abi);
var instance = contract.at(contractAddress);

console.log("Recording Vaccine" );

instance.recordGivenVaccine(web3.toHex("suresh"), 
                            web3.toHex("someone"), 
                            web3.toHex("rotavirus"),
                            web3.toHex("09-07-2018"), 
                            web3.toHex("Hyderabad"),
                            { from: address, gas: 500000,  gasLimit: 500000, gasPrice: 2000000000 } );


criteria = { toWho : "suresh" };
 
let vaccineEvents = instance.VaccineGiven( criteria, { fromBlock: 0, toBlock: 'latest' })

console.log("Rectrieving Vaccine Info" );

vaccineEvents.get((error, logs) => {
    // we have the logs, now print them
    logs.forEach(
    function (log) {

        console.log("\n" + web3.toAscii(log.args.toWho));
        console.log(web3.toAscii(log.args.byWhom));
        console.log(web3.toAscii(log.args.vaccine));
        console.log(web3.toAscii(log.args.date));
        console.log(web3.toAscii(log.args.location));
    }
    )
});

console.log("Done!" );

const filename = '../../build/contracts/MedicalRec.json';
let readablestream = fs.createReadStream(filename);
let result = readablestream.read();


var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})

const files = [
    {
      path: '/tmp/myfile.txt',
      content: result
    }
  ]
  
  ipfs.files.add(files, function (err, ofiles) {
        console.log('ERROR: ' + err);

        ofiles.forEach (
        function (file) {

            console.log(file.hash);
            console.log(file.path);
            console.log(file.size);
        }

      )

    // 'files' will be an array of objects containing paths and the multihashes of the files added
  })
