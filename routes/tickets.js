var express = require('express');
var passport = require('passport');
var Ticket =  require('../models/ticket');
var router = express.Router();

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

	// console.log(newTicket);

	newTicket.save(function (err){
		if (err) return handleError(err);
		res.redirect('/');	
	});	
	};
	

	
	
})
module.exports = router;