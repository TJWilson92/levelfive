var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
	username: String,
	password: String,
	email: String,
	location: String,
	studyyear: Number,
	firstname: String,
	surname: String,
	isStudent: {type: Boolean, default: true},
	isDemonstrator: {type: Boolean, default: false},
	isAdmin: {type: Boolean, default: false},
	lastUpdated: Date,
	lastLoggedIn: Date,
	comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
	tickets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ticket'}]
});

Account.plugin(passportLocalMongoose);
module.exports = mongoose.model('Account', Account);
