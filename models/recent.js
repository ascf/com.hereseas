var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var RecentSchema = new Schema({
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

    preview: {
        type: String
    },
    
    category: {
        type: String    
    },

    status: {
        type: Number,
        default: 1
    },
    
    priority: {
        type: Number,
        default:1
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

mongoose.model('Recent', RecentSchema);
exports.Recent = mongoose.model('Recent');