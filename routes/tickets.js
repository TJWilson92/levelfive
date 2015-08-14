var express = require('express');
var passport = require('passport');
var Ticket =  require('../models/ticket');
var Account = require('../models/account');
var Comment = require('../models/comment');
var ObjectId = require('mongoose').Types.ObjectId;
var router = express.Router();

router.get('/show/:id', function(req, res, next){
	if(req.user){
		Ticket.findById(req.params.id).populate('student').exec(function(err, ticket){
			res.render('ticket/show', {
				ticket: ticket,
				user: req.user
			});
		});
	} else {
		res.render('login');
	};
});

router.get('/your_tickets', function(req, res, next) {
	if (!req.user) {
		res.render('login');
	}
	else {
		Account.findById(req.user._id, function(err, account){
			if (account.isAdmin || account.isDemonstrator) {
				Ticket.find({}).populate('student').exec(function(err, tickets){
					res.render('ticket/your_tickets', {
						tickets: tickets,
						user: req.user
					})
				})
			} else {
				Ticket.find({student: ObjectId(account._id)}).populate({path: 'student'}).exec(function(err, tickets){
					res.render('ticket/your_tickets', {
						tickets: tickets,
						user: req.user
					});
				});
			}
		})
	}
});

router.get('/new', function(req, res, next){
	res.render('ticket/new')
})

router.post('/new', function(req, res){
	var t_title = req.body.mes_title;
	var t_message = req.body.mes_message;
	var t_location = req.body.mes_location;
	var t_seen = false;

	req.checkBody('mes_title', 'Message cannot be empty').notEmpty();
	req.checkBody('mes_message', 'Location cannot be empty').notEmpty();
	req.checkBody('mes_location', 'Location cannot be empty - you must be somewhere').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		res.render('ticket/new', {
			errors : errors,
			mes_title : t_title,
			mes_message : t_message,
			mes_location : t_location
		});
	} else {
		var newTicket = new Ticket({
		title : t_title,
		message : t_message,
		location : t_location
	});

	newTicket.save(function (err){
		if (err) return handleError(err);
		res.redirect('/tickets/show/' + newTicket._id);
	});
	};
});

router.post('/studentCloseTicket', function(req, res, next){
	Ticket.findById(req.body.ticketId, function(err, ticket){
		ticket.remove();
		res.send('ticket deleted.');
	});
})

router.post('/markAsSeen', function(req, res, next){
	Ticket.findOne({'_id': req.body.ticket_id}, function(err, ticket){
		ticket.seen = true;
		ticket.handledBy = req.user._id;
		ticket.save(function(err, ticket){
				res.send('complete')
		});
	});
})

router.post('/markAsClosed', function(req, res, next){
	Ticket.findOne({'_id': req.body.ticket_id}, function(err, ticket){
		ticket.remove(function(err, ticket){
			res.send('Complete');
		});
	});
})


module.exports = router;
