var MedicalRec = artifacts.require("MedicalRec");
var fs = require('fs');
var path = require('path');



module.exports = function (deployer, network, accounts) {


	deployer.deploy(MedicalRec).then(function (instance) {
		var contractAddress = { 'address': instance.address };
 		var jsonPath = path.join(__dirname, '..', 'build',  'MedicalRecAddress.json');

		fs.writeFile(jsonPath, JSON.stringify(contractAddress) ,  'utf8', function (err) {
			if (err) {
				return console.log(err);
			}
			console.log("The address of the contract was saved to MedicalRecAddress.json!");
		});

	});
};