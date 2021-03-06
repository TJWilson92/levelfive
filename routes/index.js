var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Ticket = require('../models/ticket')
var ObjectId = require('mongoose').Types.ObjectId;
var plm = require('passport-local-mongoose');
var router = express.Router();
var nodemailer = require('nodemailer');

var gmail_auth = require('../createMailer');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: gmail_auth
});

// This is a change of file
router.get('/', function (req, res) {
    if (!req.user) {
        res.redirect('login');
    } else {
      Account.findById(req.user._id, function(err, account){
        if ((Date.now() - account.lastLoggedIn)  > 3600000) {
          needsLocation = true;
          account.lastLoggedIn = Date.now();
          account.save();
        } else {
          needsLocation = false;
        }
        Ticket.find({}, function(err, tickets){
          Ticket.find({student: req.user._id}, function(err, student_tickets){
            res.render('index', {
                number_tickets: tickets.length,
                student_tickets: student_tickets,
                needs_location: needsLocation,
                user : req.user,
                title : "Levelfour" });
          })
        });
      });

    }
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
            res.redirect('/', 200);
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        req.user.save(function(err){
            if (err) throw (err);
            res.redirect('/', 200, {
              needs_location: true
            });
        });
});

router.get('/forgot-password', function(req, res, next){
  res.render('forgot-password');
})

router.post('/forgot-password', function(req, res, next){
  console.log(req);
  var user_email = req.body.email;
  var new_password = Math.random().toString(24).slice(2);
  Account.findOne({email: user_email}, function(err, account){
    account.setPassword(new_password, function(err){
      if(err) throw(err);
      account.save();
      var mailOptions = {
        from: 'Chemistry Robot',
        to: account.email,
        subject: 'New Password for you!',
        text: 'Boop, beep, boop. \nYou forgot your password, you silly goose. So here is a new one: ' + new_password + ' . It has been especially made for you, but it is entirely random, so you might want to change to to something more memorable, by going to the  "My Account" page once you have logged in.\nBoop, beep, the Chemistry robot. '
      }
      transporter.sendMail(mailOptions, function(err, info){
        if (err){
          console.log(err);
        }
        console.log(info.response);
        res.render('login');
      });
    });
  });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/myaccount', function(req, res, next){
    if (!req.user) {
        res.redirect('login');
    } else {
        res.render('myaccount', {user : req.user});
    }
});

router.post('/myaccount', function(req, res, next){
    var user = req.user;
    // Validate the form
    req.checkBody('username', 'Must have username').notEmpty();
    req.checkBody('firstname', 'Need name').notEmpty();
    req.checkBody('surname', 'Need surname').notEmpty();
    req.checkBody('password', 'You must enter your password to change anything').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('myaccount', {
            errors: errors,
            user: req.user,
            username: req.body.username,
            firstname: req.body.firstname,
            surname: req.body.surname,
            yearofstudy: req.body.yearofstudy
        });
    } else {
        req.user.authenticate(req.body.password, function(err, thisModel, passwordErr){
            if (err) throw err;
            if (passwordErr) {
                res.render('myaccount',{
                    errors: [passwordErr],
                    user: req.user,
                    username: req.body.username,
                    firstname: req.body.firstname,
                    surname: req.body.surname,
                    yearofstudy: req.body.yearofstudy
                });
            } else {
                Account.update({
                    username:user.username},
                    {
                        username: req.body.username,
                        email: req.body.username + "@soton.ac.uk",
                        firstname: req.body.firstname,
                        surname: req.body.surname,
                        yearofstudy: req.body.yearofstudy
                    },
                    {multi : false },
                    function(err){
                        if (err) throw err;
                    });
                if (req.body.password1.length > 0) {
                    req.user.setPassword(req.body.password1, function(err){
                        if (err) throw err;
                        req.user.save();
                    });
                }
            }
        });
    }

    res.redirect('/', 200, {
        user: Account.find({username:req.user.username})
    });
});

router.post('/updateLocation', function(req, res, next){
    var newLocation = req.body.newLocation;
    var uId = req.body['account[_id]'];
    Account.findOne({_id : uId}, function(err, acc){
        acc.location = newLocation;
        acc.save();
        res.send('success');
    });
});

router.post('/createTicket', function(req, res, next){
    var tktQuestion = req.body.tktQuestion;
    var tktText = req.body.tktText;

    var newTicket = new Ticket({
        student: req.user._id,
        currentQuestion: tktQuestion,
        message: tktText,
        location: req.user.location
    });
    newTicket.save(function(err, ticket){
      res.send(ticket);
    });

});

router.get('/getTickets', function(req, res, next){
    Ticket.find({student: req.user.id}, function(err, tckts){
        res.send(tckts);
    });
});

// Function for finding, formatting, and returning tickets, for queries used by admin.
var returnTickets = function(tickets, callback){
    var results = [];
    tickets.forEach(function(curr, ind, arr) {
        Account.findOne({_id : ObjectId(curr.student)}, function(err, account) {
            var ticketResult = [];
            ticketResult.push(account.firstname +  ' ' + account.surname + ' (' + account.email + ')');
            ticketResult.push(curr.currentQuestion);
            ticketResult.push(curr.message);
            ticketResult.push(curr.date);
            ticketResult.push(curr._id);
            results.push(ticketResult);

            if (ind == (arr.length - 1)) {
                callback(results)
            };
        });
    })
}

router.get('/getTicketsUnseen', function(req, res, next){
    ticketType = req.query.ticketType
    if (ticketType == "Unseen") {
        Ticket.find( {
            $and : [
                { open : true},
                { seen : false}
            ]
        }, function(err, tickets) {
            if (tickets.length == 0) {
                res.send('No Tickets')
            } else {
                var results = returnTickets(tickets, function(arr){
                    res.send(arr);
                });
            };
        });

    } else if (ticketType == "Seen") {
        Ticket.find( {
            $and : [
                { open: true},
                { seen: true}
            ]
        }, function(err, tickets) {
           if (tickets.length == 0) {
                res.send('No Tickets')
            } else {
                var results = returnTickets(tickets, function(arr){
                    res.send(arr);
                });
            };
        });
    } else if (ticketType == "Closed") {
        Ticket.find({open: false}, function(err, tickets){
            var results = returnTickets(tickets, function(arr){
                res.send(arr);
            })
        })
    }
});

module.exports = router;
