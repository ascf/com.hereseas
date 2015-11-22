var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');

var ThreadSchema = new Schema({
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

    title: {
        type: String
    },

    content: {
        type: String
    },

    preview: {
        type: String
    },

    lastReplayUserId: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    replayCount: {
        type: Number,
          default: 0
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


mongoose.model('Thread', ThreadSchema);
exports.Thread = mongoose.model('Thread');