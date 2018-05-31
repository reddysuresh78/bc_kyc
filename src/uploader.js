var path = require('path');
var fs = require('fs');
var os = require('os');
var express = require('express');
var ipfsAPI = require('ipfs-api')

var Busboy = require('busboy');

var app = express();


app.get('/', function (req, res) {
    res.send('<html><head></head><body>\
               <form method="POST" enctype="multipart/form-data">\
                <input type="text" name="textfield"><br />\
                <input type="file" name="filefield"><br />\
                <input type="submit">\
              </form>\
            </body></html>');
  res.end();
});

var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})

// accept POST request on the homepage
app.post('/', function (req, res) {
    var busboy = new Busboy({ headers: req.headers });

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        file.on('data', function(data) {
                console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
                // let result = data.read();
                
                const files = [
                    {
                    path: filename,
                    content: data
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


        });
        file.on('end', function() {
          console.log('File [' + fieldname + '] Finished');
        });
      });

 

    // busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    //   var saveTo = path.join('.', filename);
    //   console.log('Uploading: ' + saveTo);
    //   file.pipe(fs.createWriteStream(saveTo));
    // });
    busboy.on('finish', function() {
      console.log('Upload complete');
      res.writeHead(200, { 'Connection': 'close' });
      res.end("That's all folks!");
    });


    return req.pipe(busboy);

});

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});