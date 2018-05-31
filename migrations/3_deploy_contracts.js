var GenericStore = artifacts.require("GenericStore");
var fs = require('fs');
var path = require('path');



module.exports = function (deployer, network, accounts) {


	deployer.deploy(GenericStore).then(function (instance) {
		var contractAddress = { 'address': instance.address };
 		var jsonPath = path.join(__dirname, '..', 'build',  'GenericStoreAddress.json');

		fs.writeFile(jsonPath, JSON.stringify(contractAddress) ,  'utf8', function (err) {
			if (err) {
				return console.log(err);
			}
			console.log("The address of the contract was saved to GenericStoreAddress.json!");
		});

	});
};