var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TicketSchema = new Schema({
	student: mongoose.Schema.ObjectId,
	currentQuestion: String,
	message: String,
	location: String,
	date: {type: Date, default: Date.now },
	seen: {type: Boolean, default: false}
});

var Ticket = mongoose.model('Ticket', TicketSchema)
module.exports = Ticket