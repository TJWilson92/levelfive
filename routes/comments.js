var express = require('express');
var Ticket =  require('../models/ticket');
var Account = require('../models/account');
var Comment = require('../models/comment');
var ObjectId = require('mongoose').Types.ObjectId;
var router = express.Router();

router.post('/new', function(req, res, next){
  console.log(req);
  var ticket_id = req.body.ticket_id;
  var account = req.user._id;
  var text = req.body.comment_text;

  req.checkBody('comment_text', 'Comment text cannot be empty').notEmpty();
  var errors = req.validationErrors();
  if (errors) res.render('tickets/new', {errors: errors});

  var newComment = new Comment({
    ticket: ObjectId(ticket_id),
    account: account,
    text: text
  });

  newComment.save(function(err){
    res.redirect('/tickets/show/' + ticket_id);
  });

  Ticket.findById(newComment.ticket, function(err, ticket){
    ticket.comments.push(newComment._id);
    ticket.save();
  })
});

router.get('/get_comments', function(req, res, next){
  var ticket_id = req.query.ticket_id;
  Comment.find({ticket: ObjectId(ticket_id)}).populate({path: 'account'}).exec(function(err, comments){
    res.send(comments);
  })
})


module.exports = router;
