var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Ticket = new Schema({
	student: String,
	title: String,
	message: String,
	location: String,
	datetime: Date
});

module.exports = mongoose.model('Ticket', Ticket);