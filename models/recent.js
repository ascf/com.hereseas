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
<<<<<<< HEAD
    
    objectId:{
        type: Schema.ObjectId
    },
=======
>>>>>>> 7d7d6f0852665e0548b9725839d2bcd82d60e3d3

    title: {
        type: String
    },

    preview: {
        type: String
    },
    
<<<<<<< HEAD
    cover:{
        type: String
    },
    
    category: {
        type: Number,
        default: 0
=======
    category: {
        type: String    
>>>>>>> 7d7d6f0852665e0548b9725839d2bcd82d60e3d3
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