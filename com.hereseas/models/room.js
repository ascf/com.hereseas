var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');


var RoomSchema = new Schema({

	apartment_id: {type:Schema.ObjectId, ref: 'Apartment' },

	type: {
		type: String
	},

	bathroom: {
		type: Boolean
	},

	closet: {
		type: Boolean
	},

	walk_in_closet: {
		type: Boolean
	},

	begin_date: {
		type: Date
	},

	end_date: {
		type: Date
	},

	price: {
		type: String
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