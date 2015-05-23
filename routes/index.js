var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', { 
        user : req.user,
        title : "Levelfour" });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {

    req.checkBody('username', 'Must have username').notEmpty();
    req.checkBody('password', 'Must have password').notEmpty();
    req.checkBody('firstname', 'Need name').notEmpty();
    req.checkBody('surname', 'Need surname').notEmpty();
    req.assert('password', 'Passwords must match').passwordsMatch(req.body.password2);

    var errors = req.validationErrors();
    
    if (errors) {
        res.render('register', {
            errors: errors,
            username: req.body.username,
            firstname: req.body.firstname,
            surname: req.body.surname,
            yearofstudy: req.body.yearofstudy
        })};


    var newAccount = new Account({
        username: req.body.username,
        email : req.body.username + "@soton.ac.uk",
        firstname: req.body.firstname,
        surname: req.body.surname,
        yearofstudy: req.body.yearofstudy
    });

    Account.register(newAccount, req.body.password, function(err, account) {
        if (err) {
            console.log(err);
            return res.render('register', { 
                account : account,
                errors : err
                });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', 
    passport.authenticate('local'), 
    function(req, res) {
        res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;