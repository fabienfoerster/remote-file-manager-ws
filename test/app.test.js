
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var sinon = require('sinon');
var request = require('superagent');
var should = chai.should();

var app = require('../app');
var auth = require('../auth');


chai.use(chaiHttp);



describe('Authentification Behavior', function () {

    before(function () {
        //mocking the functions in the auth module for testing purpose
        sinon.stub(auth, "isValidUser", function (username) {
            if (username === "etienne") {
                return true;
            }
            return false;
        });
        sinon.stub(auth, 'getUserPassword', function () { return "f760af55d25ffd26161d2ea3951f541ecd986a13"; });
    });

    


    it('it should failed if user is not found', function (done) {

        chai.request(app)
            .post('/auth')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({ username: 'thierry', password: 'henry' })
            .end(function (err, res) {
                res.should.have.status(401);
                res.text.should.equal('User not found');
                done();
            });
    });

    it('it should failed if the password is not valid', function (done) {
        chai.request(app)
            .post('/auth')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({ username: 'etienne', password: 'foerster' })
            .end(function (err, res) {
                res.should.have.status(401);
                res.text.should.equal('Invalid password');
                done();
            });
    });
    it('it should works if correct credentials', function (done) {
        chai.request(app)
            .post('/auth')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({ username: 'etienne', password: 'strobbe' })
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
});

describe('GET /files', function () {
    var token = null;
    before(function (done) {
        //getting the token for following test
        chai.request(app)
            .post('/auth')
            .send({ username: 'etienne', password: 'strobbe' })
            .end(function (err, res) {
                token = res.text;
                done();
            });
    });

    it('it should send 401 if not authentificated', function (done) {
        chai.request(app)
            .get('/files')
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
    });
    
    it('it should send 200 if authentificated', function(done) {
        chai.request(app)
            .get('/files')
            .set('Authorization','Bearer ' + token)
            .end(function(err,res){
                res.should.have.status(200);
                done();
            });
    });

});

describe('DELETE /files', function () {
    var token = null;
    before(function (done) {
        //getting the token for following test
        chai.request(app)
            .post('/auth')
            .send({ username: 'etienne', password: 'strobbe' })
            .end(function (err, res) {
                token = res.text;
                done();
            });
    });

    it('it should send 401 if not authentificated', function (done) {
        chai.request(app)
            .delete('/files')
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
    });

     it('it should send 200 if authentificated', function(done) {
        chai.request(app)
            .delete('/files')
            .set('Authorization','Bearer ' + token)
            .end(function(err,res){
                res.should.have.status(200);
                done();
            });
    });

});