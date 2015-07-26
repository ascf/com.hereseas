var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');


var SchoolSchema = new Schema({

	name: {
		type: String
	},

	avatar: {
		type: String
	},

	description: {
		type: String
	},

	image: {
		type: String
	},

	address: Schema.Types.Mixed,

	longitude: {
		type: String
	},

	latitude: {
		type: String
	},

	userCount: {
		type: Number,
		default: 0
	},

	status: {
		type: Number,
		default: 1
	},

	createAt: {
		type: Date,
		default: Date.now
	},
	updateAt: {
		type: Date,
		default: Date.now
	}

});

mongoose.model('School', SchoolSchema);

exports.Room = mongoose.model('School');