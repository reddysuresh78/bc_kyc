var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var vaccineRouter = express.Router();

vaccineRouter.get('/:childName', function(req, res) { });

vaccineRouter.post('/', function(req, res) {  //Start post handling

    console.log(req.body.childName);


}); //End of post method

app.use('/vaccines', vaccineRouter);
app.use(bodyParser.json({ type: 'application/json' }));


module.exports = app;