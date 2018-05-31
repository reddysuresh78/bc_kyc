var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var bcutils = require('./bcutil');

var vaccineRouter = express.Router();

app.use(bodyParser.json({ type: 'application/json' }));
app.use('/js',express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/vaccines', vaccineRouter);

app.get('/', function(req,res) {
  res.sendfile('index.html');
});

vaccineRouter.get('/', async (req, res) => {  //Start
  
  bcutils.searchVaccineInfo(req.query.childName, function(retVal) {
    var response = JSON.stringify(retVal , null, 3);
    res.setHeader('Content-Type', 'application/json');
    res.send(response);
   });

 }); //End of method

 

vaccineRouter.post('/', function(req, res) {  //Start post handling
    console.log(req.body);

    bcutils.recordVaccine(req.body);

    res.send({ status: 'SUCCESS' });

}); //End of post method

console.log('App initialized');

module.exports = app;

app.listen(3000);