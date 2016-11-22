var path = require('path')
var express = require('express');
var app = express();
var fs = require("fs");
var util = require('util');

let dirTree = (filename)  => {
    let stats = fs.lstatSync(filename),
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


//get the port from the environnement or use default
let port = process.env.PORT || 8088

let server = app.listen(port)
console.log("Listening on port : " + port)

// get work_dir from command line argument or use default
let work_dir = process.argv[2] || "."
console.log("Using work dir : ",work_dir);

app.get('/files', function (req, res) {
  var json = dirTree(work_dir);
  res.json(json);
});
