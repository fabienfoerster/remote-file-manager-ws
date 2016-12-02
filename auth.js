var users = require('./users.json');
var crypto = require('crypto');
module.exports = {
    getUserPassWord: function (username) {
        return users.users[username]
    },
    isValidUser: function (username) {
        if (users.users[username]) return true
        return false
    },
    isValidePassword: function (password, passwordUser) {
        var shasum = crypto.createHash('sha1');
        shasum.update(password);
        password = shasum.digest('hex');

        if (password === passwordUser) { return true; }
        return false;
    }
}