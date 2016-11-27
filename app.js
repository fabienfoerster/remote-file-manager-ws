var path = require('path')
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require("fs");
var util = require('util');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var dirTreeEnhancedOutput = function(current_path, filename, list_files) {
    var stats = fs.lstatSync(filename),
        info = {
            path: current_path,
            //compvare_path: filename,
            name: path.basename(filename)
        };

    if (stats.isDirectory()) {
        fs.readdirSync(filename).map(function(child) {
            dirTreeEnhancedOutput(filename + '/', filename + '/' + child,list_files);
        });
    } else {
        info.extension = path.extname(filename);
        if(info.extension != ''){
          list_files.push(info);
        }
    }
    return list_files;
}

var removeFile = function(filePath,RemoveCallback) {
  ///fs.unlink(filePath,RemoveCallback);
  // WARNING THIS WILL DEFINITIVELY REMOVE THE FILE
}

var isValidePassword = function(password, passwordUser) {
    var shasum = crypto.createHash('sha1');
    shasum.update(password);
    password = shasum.digest('hex');

    if (password === passwordUser) {return true;}
    return false;
};

//get the port from the environnement or use default
var port = process.env.PORT || 8088

var server = app.listen(port)
console.log("Listening on port : " + port)

// get work_dir from command line argument or use default
var work_dir = process.argv[2] || "."
console.log("Using work dir : ",work_dir);

app.get('/files', function (req, res) {
  var list_files = [];
  var json = dirTreeEnhancedOutput(work_dir,work_dir,list_files);
  res.json(json);
});

app.devare('/files', function(req, res){
  var filesToRemove = req.body;
  for (var i = 0; i < filesToRemove.length; i++) {
    var file = filesToRemove[i];
    var filePath = file.path+file.name;
    console.log("Removing ",filePath);
    removeFile(filePath,function(){
      console.log("file should be removed");
    });
  }
  res.status(200).send('Everything is ok here');
});

app.post('/login',function(req,res){

})
