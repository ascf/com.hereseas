var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, function(err) {
	if (err) {
		console.error('connect to %s error: ', config.db, err.message);
		process.exit(1);
	}
});

// models
require('./user.js');
require('./apartment.js');
require('./room.js');
require('./school.js');
require('./car.js');
require('./admin.js');
require('./forgetter.js');
require('./message.js');
require('./item.js');
require('./thread.js');
require('./comment.js');
require('./professor.js');
require('./rate.js');
require('./eventValentine.js');
//added on 3/16/2016 by Chengyu 
require('./city.js') 


exports.User = mongoose.model('User');
exports.Apartment = mongoose.model('Apartment');
exports.Room = mongoose.model('Room');
exports.School = mongoose.model('School');
exports.Car = mongoose.model('Car');
exports.Admin = mongoose.model('Admin');
exports.Forgetter = mongoose.model('Forgetter');
exports.Message = mongoose.model('Message');
exports.Item = mongoose.model('Item');
exports.Thread = mongoose.model('Thread');
exports.Comment = mongoose.model('Comment');
exports.Professor = mongoose.model('Professor');
exports.Rate = mongoose.model('Rate');
exports.EventValentine = mongoose.model('EventValentine');
exports.City = mongoose.model('City')