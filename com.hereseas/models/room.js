var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');


var RoomSchema = new Schema({

	apartmentId: {type:Schema.ObjectId, ref: 'Apartment' },

	type: {
		type: String
	},

	price: {
		type: String
	},

	bathroom: {
		type: Boolean
	},

	closet: {
		type: Boolean
	},

	walkInCloset: {
		type: Boolean
	},

	beginDate: {
		type: Date
	},

	endDate: {
		type: Date
	},


	available: {
		type: Boolean,
		default: true
	},

	status:{
		type: Number,
		default : 1
	},

	create_at: {
		type: Date,
		default: Date.now
	},
	update_at: {
		type: Date,
		default: Date.now
	}


});

mongoose.model('Room', RoomSchema);

exports.Room = mongoose.model('Room');