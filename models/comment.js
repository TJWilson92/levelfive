var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
	ticket: mongoose.Schema.Types.ObjectId,
  from: mongoose.Schema.Types.ObjectId,
  date: {type: Date, default: Date.now},
  text: String
});

module.exports = mongoose.model('Comment', Comment);
