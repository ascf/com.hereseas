var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');


var SchoolSchema = new Schema({

	name: {
		type: String
	},

	cnName: {
		type: String
	},

	shortName: {
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

	users: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],

	userCount: {
		type: Number,
		default: 0
	},

	connection: [Schema.ObjectId],

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