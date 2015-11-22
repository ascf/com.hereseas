var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var mongoosePaginate = require('mongoose-paginate');

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

CommentSchema.plugin(mongoosePaginate);
mongoose.model('Comment', CommentSchema);
exports.Comment = mongoose.model('Comment');