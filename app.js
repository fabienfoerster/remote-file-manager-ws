let path = require('path')
let express = require('express');
let app = express();
let fs = require("fs");
let util = require('util');


let dirTreeEnhancedOutput = (current_path, filename, list_files)  => {
    let stats = fs.lstatSync(filename),
        info = {
            path: current_path,
            //complete_path: filename,
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


//get the port from the environnement or use default
let port = process.env.PORT || 8088

let server = app.listen(port)
console.log("Listening on port : " + port)

// get work_dir from command line argument or use default
let work_dir = process.argv[2] || "."
console.log("Using work dir : ",work_dir);

app.get('/files', function (req, res) {
  let list_files = [];
  let json = dirTreeEnhancedOutput(work_dir,work_dir,list_files);
  res.json(json);
});
