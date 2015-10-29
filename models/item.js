var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');

var ItemSchema = new Schema({
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

    expireAt: {
        type: Date
    },

    itemName: {
        type: String
    },

    category: {
        type: String
    },

    price: {
        type: Number
    },

    description: {
        type: String
    },

    cover: {
        type: String
    },

    images: [String],

    address: Schema.Types.Mixed,

    longitude: {
        type: String
    },

    latitude: {
        type: String
    },

    available: {
        type: Boolean,
        default: true
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

mongoose.model('Item', ItemSchema);
exports.Item = mongoose.model('Item');