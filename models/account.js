var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
	username: String,
	password: String,
	email: String,
	studyyear: Number,
	firstname: String,
	surname: String,
	isStudent: {type: Boolean, default: true},
	isDemonstrator: {type: Boolean, default: false},
	isAdmin: {type: Boolean, default: false},
	lastUpdated: Date,
});

Account.plugin(passportLocalMongoose);
module.exports = mongoose.model('Account', Account);