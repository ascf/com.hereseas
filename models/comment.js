var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');

var CommentSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    username: {
        type: String
    },

    userAvatar: {
        type: String
    },

    schoolId: {
        type: Schema.ObjectId,
        ref: 'School'
    },

     threadId: {
        type: Schema.ObjectId,
        ref: 'Thread'
    },

    content: {
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


mongoose.model('Comment', CommentSchema);
exports.Comment = mongoose.model('Comment');