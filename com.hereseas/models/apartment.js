var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');



var ApartmentSchema = new Schema({

	user_id: {type:Schema.ObjectId, ref: 'User' },
	user_name: {
		type: String
	},
	user_avatar: {
		type: String
	},
	title: {
		type: String
	},
	content: {
		type: String
	},

    cover: {
    	type: String
    },

	images: [String],

	type: {
		type: String
	},
	
	rooms: [{ type:Schema.ObjectId, ref: 'Room'}],
	favorite: [{type:Schema.ObjectId, ref: 'User'}],

	available: {
		type: Boolean,
	},

	description: {
		type: String
	},

	location: [Schema.Types.Mixed],


	create_at: {
		type: Date,
		default: Date.now
	},
	update_at: {
		type: Date,
		default: Date.now
	}


});

ApartmentSchema.virtual('avatar_url').get(function() {
	return 'http://www.gravatar.com/avatar/' + utility.md5(this.email.toLowerCase()) + '?size=48';
	//return 'avatars/' + this.avatar;
});



// UserSchema.index({
// 	username: 1,
// 	email: 1
// }, {
// 	unique: true
// });

mongoose.model('Apartment', ApartmentSchema);

exports.Apartment = mongoose.model('Apartment');


