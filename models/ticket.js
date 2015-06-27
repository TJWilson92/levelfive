var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;

var TicketSchema = new Schema({
	student: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
	currentQuestion: String,
	message: String,
	location: String,
	date: {type: Date, default: Date.now },
	seen: {type: Boolean, default: false},
	open: {type: Boolean, default: true},
	ticketStatus: {type: String, default: 'Submitted'},
	handledBy: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
});

var Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;
