var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminSchema = new Schema({
	email: {
		type: String,
		index: {
			unique: true
		}
	},
	password: {
		type: String
	},
	/*
	username: {
		type: String,
		default: ''
	},
	*/
});

mongoose.model('Admin', AdminSchema);
exports.Admin = mongoose.model('Admin');