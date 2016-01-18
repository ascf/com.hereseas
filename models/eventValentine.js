var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var EventValentineSchema = new Schema({


    name: {
        type: String
    },

    sex: {
        type: String
    },

    organization: {
        type: String
    },

    phone: {
        type: String
    },

    email: {
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

EventValentineSchema.plugin(mongoosePaginate);
mongoose.model('EventValentine', EventValentineSchema);
exports.EventValentine = mongoose.model('EventValentine');