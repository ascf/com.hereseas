var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfessorSchema = new Schema({
	name: {
        type: String
    },

    schoolId: {
        type: Schema.ObjectId,
        ref: 'School'
    },

    department: {
		type: String,
		default: ''
	},

    biography: {
        type: String
    },

    website: {
        type: String
    },

    star: {
        type: Number
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

mongoose.model('Professor', ProfessorSchema);
exports.Professor = mongoose.model('Professor');