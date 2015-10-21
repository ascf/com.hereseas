var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');

var UserSchema = new Schema({

    email: {
        type: String,
        index: {
            unique: true
        }
    },
    password: {
        type: String
    },

    username: {
        type: String,
        default: ''
    },

    schoolId: {
        type: Schema.ObjectId,
        ref: 'School'
    },

    enrollYear: {
        type: String
    },
    enrollSeason: {
        type: String
    },

    avatar: {
        type: String,
        default: 'avatar/default.png'
    },

    address: Schema.Types.Mixed,

    description: {
        type: String
    },

    tags: [String],


    favorite: {
        apartments: [Schema.ObjectId],
        cars: [Schema.ObjectId],
        items: [Schema.ObjectId],
        activities: [Schema.ObjectId]
    },

    lastLocation: [Schema.Types.Mixed],

    verified: {
        type: Boolean,
        default: false
    },

    eduEmail: {
        type: String,
        index: {
            unique: true,
            sparse: true
        }
    },
    eduEmailTemp: {
        type: String
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
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    activecode: {
        type: String
    },

    apartments: [Schema.ObjectId],

    chats: [Schema.ObjectId]

});

// UserSchema.virtual('avatar_url').get(function() {
//     return 'http://www.gravatar.com/avatar/' + utility.md5(this.email.toLowerCase()) + '?size=48';
//     //return 'avatars/' + this.avatar;
// });


UserSchema.virtual('age').get(function() {
    return 18;
});


UserSchema.index({
    email: 1
}, {
    unique: true
});

mongoose.model('User', UserSchema);

exports.User = mongoose.model('User');