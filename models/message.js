var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	receiver: {
        type: Schema.ObjectId
    },

    receiverUsername: {
        type: String
    },

    sender: {
		type: Schema.ObjectId
	},

    senderUsername: {
        type: String
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