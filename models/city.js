var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');

var CitySchema = new Schema({

	city: {
		type: String
	},

	state: {
		type: String
	},

	zipcode: {
		type: Number
	},
    
    latitude:{
        type: String
    },
    
    longitude:{
        type: String
    }
});

mongoose.model('City', CitySchema);
exports.City = mongoose.model('City');