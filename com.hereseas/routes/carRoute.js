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

exports.postCarById = function(req, res, next) {
	var carId = req.param('id');
	var reqData = {};
	var userId = req.user.id;
	var epUser = new EventProxy();
	User.findById(req.user.id, function(err, user) {
		if (err) {
			res.json(Results.ERR_DB_ERR);
			return;
		} else {
			epUser.emit("findUser", user);
		}
	});
	epUser.all("findUser", function(user) {
		Car.findById(carId, function(err, car) {
			if (err) {
				console.log(err);
				res.json(Results.ERR_DB_ERR);
				return;
			} else if (!car) {
				res.json(Results.ERR_NOTFOUND_ERR);
				return;
			} else {
				if (car.userId != userId || car.status != 2){
					res.json(Results.ERR_PERMISSION_ERR);
					return;
				}
				var reqData = {
					userId: car.userId,
                    userFirstName: car.userFirstName,
                    userLastName: car.userFirstName,
                    userAvatar: car.userAvatar,
                    schoolId: car.schoolId,
                    title: car.title,
                    description: car.description,
                    cover: car.cover,
                    images: car.images,
                    type: car.type,
                    fees: car.fees,
                    facilities: car.facilities,
                    address: car.address,
                    longitude: car.longitude,
                    latitude: car.latitude,
                    rooms: car.rooms,
                    status: car.status
				};
				if (tools.isEmpty(reqData.rooms) || tools.isEmpty(reqData.images)) {
					res.json(Results.ERR_NOTFINISHED_ERR);
					return;
				}
				if (tools.hasNull(reqData)) {
					res.json(Results.ERR_NOTFINISHED_ERR);
					return;
				}
				car['status'] = 1;
				car.update_at = new Date();
				car.save(function(err, apartment) {
					if (err) {
						consolo.log(err);
						return next();
					} else {
						res.json({
							result: true,
							data: car
						});
					}
				});
			}
		});
	});
}