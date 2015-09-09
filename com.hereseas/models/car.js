var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');

var CarSchema = new Schema({
	userId: {type:Schema.ObjectId, ref: 'User'},
	userFirstName: {
		type: String
	},
	userLastName: {
		type: String
	},
	userAvatar: {
		type: String
	},
	schoolId: {type:Schema.ObjectId, ref: 'School'},
	title: {
		type: String
	},
	description: {
		type: String
	},
	cover: {
		type: String
	},
	images: [String],
	type: {
		type: String
	},

	cars: [{
		make: {
			type: String
		},
		model: {
			type: String
		},
	}],
	available: {
		type: Boolean,
		default: true
	},
	fees: Schema.Types.Mixed,
	facilities: Schema.Types.Mixed,
	address: Schema.Types.Mixed,
	longitude: {
		type: String
	},
	latitude: {
		type: String
	},
	status: {
		type: Number,
		default: 2
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
CarSchema.virtual('avatar_url').get(function() {
	return 'http://www.gravatar.com/avatar/' + utility.md5(this.email.toLowerCase()) + '?size=48';
});
mongoose.model('Car', CarSchema);
exports.Car = mongoose.model('Car');