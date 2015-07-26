var express = require('express');
var passport = require('passport');
var Ticket =  require('../models/ticket');
var Account = require('../models/account');
var Comment = require('../models/comment');
var ObjectId = require('mongoose').Types.ObjectId;
var router = express.Router();

router.get('/show/:id', function(req, res, next){
	if (!req.user) {
		res.render('login');
	} else {
		Ticket.findOne({_id: ObjectId(req.params.id)}).populate('comments').exec(function(err, ticket){
			Account.findOne({_id: ObjectId(ticket.student)}, function(err, student){
				if (req.user.isAdmin || student._id == req.user._id) {
					Comment.find({ticket: ObjectId(ticket._id)}).populate({path: 'account'}).exec(function(err, comments){
						res.render('ticket/show', {
							ticket: ticket,
							user: req.user,
							student: student,
							comments: comments
						});
					})
				} else {
					res.render('index');
				}
			});
		});
	}
});

router.get('/your_tickets', function(req, res, next) {
	if (!req.user) {
		res.render('login');
	}
	else {
		Account.findOne({_id: ObjectId(req.user._id)}, function(err, account){
			if (account.isAdmin || account.isDemonstrator) {
				Ticket.find({handledBy: ObjectId(account._id)}, function(err, tickets){
					var accObjects = [];
					tickets.forEach(function(val, ind, array){
						Account.findOne({_id: ObjectId(val.student)}, function(err, student){
								var newObj = {
									ticketId: val._id,
									firstname: account.firstname,
									surname: account.surname,
									email: account.email,
									question: val.currentQuestion,
									studentLocation: val.location,
									studentMessage: val.message,
									ticketStatus: val.ticketStatus,
									seen: val.seen,
									open: val.open
								};
								accObjects.push(newObj);
								if (accObjects.length == tickets.length) {

									var openTickets = accObjects.filter(function(item){
										return item.open;
									});


									res.render('ticket/your_tickets', {
										user: req.user,
										title: "Your Tickets",
										openTickets: openTickets,
									});
								}
						});
					});
				});
			} else {
				Ticket.find({student: ObjectId(account._id)}, function(err, tickets){
					res.render('tickets/your_tickets',
					{tickets:tickets});
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
		res.redirect('/');
	});
	};
});

router.post('/studentCloseTicket', function(req, res, next){
	Ticket.findOne({'_id' : req.body.ticketId}, function(err, ticket){
		ticket.remove();
		res.send('Ticket deleted')
	});
})

router.post('/markAsSeen', function(req, res, next){
	Ticket.findOne({'_id': req.body.ticket_id}, function(err, ticket){
		ticket.seen = true;
		ticket.handledBy = req.user._id;
		ticket.save();
		res.send('complete')
	});
})

router.post('/markAsClosed', function(req, res, next){
	Ticket.findOne({'_id': req.body.ticket_id}, function(err, ticket){
		ticket.open = false;
		ticket.save();
		res.send('complete')
	});
})

router.post('/updateTicketStatus', function(req, res, next){
	Ticket.findOne({'_id': req.body.ticket_id}, function(err, ticket){
		ticket.ticketStatus = req.body.statusUpdate
		ticket.save();
		res.send('Ticket Edited');
	});
});

module.exports = router;
