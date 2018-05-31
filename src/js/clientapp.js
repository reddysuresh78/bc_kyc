msg = document.querySelector('.message');
chooser = document.querySelector('form');
App = {

  init: function () {
    //Initialize 
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

    var reqObj = {
        toWho : document.getElementById("childName").value,
        byWhom : "HYD_ASHA_WORKER",
        vaccine : document.getElementById("vaccine").value,
        date : "28-05-2018",
        location : "HYDERABAD"
    };

    $.ajax({
        url: "/vaccines",
        method: "POST",
        data: JSON.stringify(reqObj),
        dataType: 'json',
        contentType: "application/json",  
         success: function(result,status,jqXHR ){
            console.log('Vaccine info saved successfully');
         },
         error(jqXHR, textStatus, errorThrown){
             console.log('Error while saving vaccine info');
         }
    });  
  },

  showHistory: function () {

    $("#vaccinehistory > tbody").html("");

    var childNameVal = $("#childName").val();

    console.log("Child name " + childNameVal);

    $.ajax({
        url: "/vaccines",
        method: "GET",
        data: { childName : childNameVal} ,
        success: function(result,status,jqXHR ){
            console.log('Vaccine info retrieved successfully ' + JSON.stringify( result));
         // we have the logs, now print them
            result.history.forEach(
            function (log) {
                var markup = "<tr><td>" +  log.vaccine  +  "</td><td>" +  log.byWhom  + "</td><td>" +  log.date  + "</td><td>" +  log.location  + "</td></tr>";
                $("table tbody").append(markup);
            });
         },
         error(jqXHR, textStatus, errorThrown){
             console.log('Error while retrieving vaccine info ' + errorThrown );
         }
    });  

      
    } 
 
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});


