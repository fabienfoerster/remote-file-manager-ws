var path = require('path')
var express = require('express');
var app = express();
var fs = require("fs");
var util = require('util');

function dirTree(filename) {
    var stats = fs.lstatSync(filename),
        info = {
            path: filename,
            name: path.basename(filename)
        };

    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = "file";
    }

    return info;
}


var work_dir = ".";

var server = app.listen(8088, function () {

  var host = server.address().address
  var port = server.address().port
  console.log("Server is listening at at http://%s:%s", host, port)

});

work_dir = process.argv[2];
console.log("work_dir",work_dir);

app.get('/files', function (req, res) {
  var json = dirTree(work_dir);
  //console.log(json);
  res.json(json);
});
