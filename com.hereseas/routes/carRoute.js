var EventProxy = require('eventproxy');
var User = require('../models').User;
var Results = require('./commonResult');
var tools = require('../common/tools');
var Car = require('../models').Car;

exports.createCar = function(req, res, next) {
	var epUser = new EventProxy();
	User.findById(req.user.id, 
		function(err, user) {
			if (err) {
				res.json(Results.ERR_DB_ERR);
				return;
			} else {
				if (user.status != 1) {
					res.json(Results.ERR_PERMISSION_ERR);
					return;
				}
				epUser.emit("findUser", user);
			}
		});
	epUser.all("findUser", function(user) {
		//execute after "findUser" is emited
		//console.log("user" , user);
		var reqData = {
			userId: user.id,
			userFirstName: user.firstName,
			userLastName: user.lastName,
			userAvatar: user.avatar,
			schoolId: req.body.schoolId,
		};

		if (tools.hasNull(reqData)) {
			res.json(Results.ERR_PARAM_ERR);
			return;
		}
		var car = new Car();
		for (var key in reqData) {
			car[key] = reqData[key];
		}
		car['status'] = 2;
		car.save(function(err, car) {
			if (err) {
				console.log(err);
				return next();
			} else {
				res.json({
					result: true,
					data: car
				});
			}
		});
	});
}