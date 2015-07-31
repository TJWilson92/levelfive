var express   = require('express');
var mongoose  = require('mongoose');
var ObjectId  = mongoose.Schema.Types.ObjectId;
var Account   = require('../models/account');
var Ticket    = require('../models/ticket');
var router    = express.Router();

/* GET users listing. */


router.get('/show/:id', function(req, res, next){
  Account.findById(req.params.id, function(err, account){
    Ticket.find({student: ObjectId(account._id)}, function(err, tickets){
      if (req.user.isAdmin) {
        res.render('user/show', {
          student: account,
          tickets: tickets,
          user: req.user
        })
      } else {
        res.render('user/not_admin');
      }
    })
  })
});

router.post('/toggleDemonstrator', function(req, res, next){
  Account.findById(req.body.account_id, function(err, account){
    if (account.isDemonstrator) {
      account.isDemonstrator = false;
      account.save();
    } else {
      account.isDemonstrator = true;
      account.save();
    }

    res.send('Changed');
  });
});

router.post('/toggleAdmin', function(req, res, next){
  Account.findById(req.body.account_id, function(err, account){
    if (account.isAdmin) {
      account.isAdmin = false;
      account.save();
    } else {
      account.isAdmin = true;
      account.save();
    }
    account.save();
    res.send('Changed');
  });
});

module.exports = router;
