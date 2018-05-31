msg = document.querySelector('.message');
chooser = document.querySelector('form');
mark = null;
cells = null;
cellValues = [];
winningSymbol = "";
App = {
  web3Provider: null,
  contracts: {},
  fromAccount: null,

  init: function () {
    //Initialize 
    return App.initWeb3();
  },

  initWeb3: function () {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      console.log('Connected to metamask version');
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      console.log('Connected to localhost 7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {


    $.getJSON('MedicalRec.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var MedicalRecArtifact = data;
      App.contracts.MedicalRec = TruffleContract(MedicalRecArtifact);

      // Set the provider for our contract
      App.contracts.MedicalRec.setProvider(App.web3Provider);

      msg.textContent = 'You may save vaccine details or check vaccines already given to the child';

      return;
    });

    return App.bindEvents();
  },


  bindEvents: function () {

    btnShowHistory = document.getElementById("btnShowHistory");

    btnShowHistory.addEventListener('click', App.showHistory, false);

    btnSaveVaccineDtls = document.getElementById("btnSaveVaccineInfo");

    btnSaveVaccineDtls.addEventListener('click', App.saveVaccine, false);


  },


  saveVaccine: function () {
    console.log('savevaccine called');
    var medicalRecInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      fromAccount = accounts[0];


    });


    App.contracts.MedicalRec.deployed().then(function (instance) {

      console.log('contract deployer ');
      medicalRecInstance = instance;
      //string toWho, string byWhom, string vaccine, string date, string location
      var toWho = web3.toHex(document.getElementById("childName").value);
      var byWhom = web3.toHex("HYD_ASHA_WORKER"); //document.getElementById("childName").textContent;
      var vaccine = web3.toHex(document.getElementById("vaccine").value);
      var date = web3.toHex("28-05-2018");
      var location = web3.toHex("HYDERABAD");
      console.log(toWho + " " + vaccine);
      return medicalRecInstance.recordGivenVaccine(toWho, byWhom, vaccine, date, location);
      //,  { from: fromAccount, gas: 500000,  gasLimit: 500000, gasPrice: 2000000000 } );
    }).then(function (result) {
      console.log('recordGivenVaccine called successfully ' + result);
      msg.textContent = 'Vaccine Record successful.';
    }).catch(function (err) {
      // debugger;
      console.log('Error occurred while setting value ' + err.message);

    });
  },

  showHistory: function () {

    var medicalRecInstance;

    vaccinehistory = document.getElementById("vaccinehistory");

    $("#vaccinehistory > tbody").html("");

    App.contracts.MedicalRec.deployed().then(function (instance) {
      medicalRecInstance = instance;
      criteria = {};

      childName = $("#childName").val();

      if(childName != ""   ) {
        criteria = { toWho : childName };
      }
      console.log($("#childName").val());

      let vacchineEvents = medicalRecInstance.VaccineGiven( criteria, { fromBlock: 0, toBlock: 'latest' })
      vacchineEvents.get((error, logs) => {
        // we have the logs, now print them
        logs.forEach(
          function (log) {
            var markup = "<tr><td>" + web3.toAscii(log.args.vaccine) +  "</td><td>" + web3.toAscii(log.args.byWhom) + "</td><td>" + web3.toAscii(log.args.date) + "</td><td>" + web3.toAscii(log.args.location) + "</td></tr>";
            $("table tbody").append(markup);


            console.log(web3.toAscii(log.args.toWho));
            console.log(web3.toAscii(log.args.byWhom));
            console.log(web3.toAscii(log.args.vaccine));
            console.log(web3.toAscii(log.args.date));
            console.log(web3.toAscii(log.args.location));
          }
        )
      }

      )
    }).catch(function (err) {
      console.log('Error occurred while reading logs ' + err.message);
    });
  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});


