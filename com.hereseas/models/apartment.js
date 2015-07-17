var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');


var ApartmentSchema = new Schema({

	user_id: [Schema.ObjectId],
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
	rooms: [Schema.ObjectId],
	favorite: [Schema.ObjectId],

	available: {
		type: Boolean,
	},

	contact: [Schema.Types.Mixed],	

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


