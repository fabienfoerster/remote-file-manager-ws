var path = require('path')
var express = require('express');
var bodyParser = require('body-parser');
var fs = require("fs");
var util = require('util');
var jwt = require('jsonwebtoken');
var expressJWT = require('express-jwt');
var auth = require('./auth.js');

var app = express();


//get the secret from the environnement
var secret = process.env.JWT_SECRET || "you should really set an env var for that";

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// every path is secure except login and getting files
app.use(expressJWT({ secret: secret}).unless({path:['/auth']}));


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
};

var removeFile = function(filePath,RemoveCallback) {
  ///fs.unlink(filePath,RemoveCallback);
  // WARNING THIS WILL DEFINITIVELY REMOVE THE FILE
};


//get the port from the environnement or use default
var port = process.env.PORT || 8088;

var server = app.listen(port);
console.log("Listening on port : " + port);

// get work_dir from command line argument or use default
var work_dir = process.argv[2] || "."
console.log("Using work dir : ",work_dir);

app.get('/files', function (req, res) {
  var list_files = [];
  var json = dirTreeEnhancedOutput(work_dir,work_dir,list_files);
  res.json(json);
});

app.delete('/files', function(req, res){
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

//endpoint for authentification
app.post('/auth', function(req,res){
    var username = req.body.username
    // check if the user is knowed to us
    if(!auth.isValidUser(username)){
        res.status(401).send("User not found");
        return;
    }
    // check if it is the corrrect password
    if(!auth.isValidePassword(req.body.password,auth.getUserPassword(username))){
        res.status(401).send("Invalid password");
        return;
    }
    // if all is good create a token containing the username and sign it using the secret
    var token = jwt.sign({username: username},secret);
    // send back the token to the user
    res.send(token);
});


//for testing
module.exports = app;


