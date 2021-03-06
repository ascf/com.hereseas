var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    receiver: {
        type: Schema.ObjectId
    },

    receiverUsername: {
        type: String
    },

    receiverSchool: {
        type: Schema.ObjectId
    },

    sender: {
        type: Schema.ObjectId
    },

    senderUsername: {
        type: String
    },

    senderSchool: {
        type: Schema.ObjectId
    },

    createAt: {
        type: Date,
        default: Date.now
    },

    content: {
        type: String
    },

    read: {
        type: Boolean
    }
});

mongoose.model('Message', MessageSchema);
exports.Message = mongoose.model('Message');