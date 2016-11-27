let path = require('path')
let express = require('express');
var bodyParser = require('body-parser');
let app = express();
let fs = require("fs");
let util = require('util');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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

let removeFile = (filePath,RemoveCallback) => {
  ///fs.unlink(filePath,RemoveCallback);
  // WARNING THIS WILL DEFINITIVELY REMOVE THE FILE
}

let isValidePassword = (password, passwordUser) => {
    let shasum = crypto.createHash('sha1');
    shasum.update(password);
    password = shasum.digest('hex');

    if (password === passwordUser) {return true;}
    return false;
};

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

app.delete('/files', function(req, res){
  let filesToRemove = req.body;
  for (var i = 0; i < filesToRemove.length; i++) {
    let file = filesToRemove[i];
    let filePath = file.path+file.name;
    console.log("Removing ",filePath);
    removeFile(filePath,function(){
      console.log("file should be removed");
    });
  }
  res.status(200).send('Everything is ok here');
});

app.post('/login',function(req,res){

})
