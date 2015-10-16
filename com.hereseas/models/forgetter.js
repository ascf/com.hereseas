var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ForgetterSchema = new Schema({
	email: {
        type: String
    },

    username: {
		type: String,
		default: ''
	},

	createAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Forgetter', ForgetterSchema);
exports.Forgetter = mongoose.model('Forgetter');