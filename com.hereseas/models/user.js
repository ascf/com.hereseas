var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');


var UserSchema = new Schema({
    username: {
        type: String,
        index: {
            unique: true
        }
    },
    email: {
        type: String,
        index: {
            unique: true
        }
    },
    password: {
        type: String
    },
    salt: {
        type: String
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    gender: {
        type: String,
        default: 'male'
    },
    school: {
        type: String
    },
    avatar: {
        type: String,
        default: 'default.png'
    },
    birthday: {
        type: Date
    },

    role: {
        type: String
    },

    description: {
        type: String
    },

    tags: [String],

    favorite: [Schema.ObjectId],

    last_contact: [Schema.Types.Mixed],

    last_location: Schema.Types.Mixed,

    verified: {
        type: Boolean,
        default: false
    },

    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    },
    last_login: {
        type: Date,
        default: Date.now
    }


});

UserSchema.virtual('avatar_url').get(function () {
    return 'http://www.gravatar.com/avatar/' + utility.md5(this.email.toLowerCase()) + '?size=48';
    //return 'avatars/' + this.avatar;
});


UserSchema.virtual('age').get(function () {
    return 18;
});


UserSchema.index({
    username: 1,
    email: 1
}, {
    unique: true
});

mongoose.model('User', UserSchema);

exports.User = mongoose.model('User');