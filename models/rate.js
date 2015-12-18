var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var RateSchema = new Schema({
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

    professorId: {
        type: Schema.ObjectId,
        ref: 'Professor'
    },

    content: {
        type: String
    },

    star: {
        type: Number
    },

    className: {
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

RateSchema.plugin(mongoosePaginate);
mongoose.model('Rate', RateSchema);
exports.Rate = mongoose.model('Rate');