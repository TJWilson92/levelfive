var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
	ticket: {type: mongoose.Schema.Types.ObjectId, ref: 'Ticket'},
  account: mongoose.Schema.Types.ObjectId,
  date: {type: Date, default: Date.now},
  text: String
});

module.exports = mongoose.model('Comment', Comment);
