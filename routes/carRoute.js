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
			username: user.username,
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

exports.editCarById = function(req, res, next) {
	var carId = req.param('id');
	var reqData = {};
	var userId = req.user.id;
	if (!req.query.step) {
		res.json(Results.ERR_PARAM_ERR);
		return;
	}
	if (req.query.step == 1) {
		/* no type of car for now
		reqData = {
			type: req.body.type,
		}
		*/
		if (tools.isEmpty(req.body.basicInfo)) {
			res.json(Results.ERR_PARAM_ERR);
			return;
		}
		var basicInfo = [];
		for (var i = 0; i < req.body.basicInfo.length; i++) {
			var basic = {
				year: req.body.basicInfo[i].year,
				make: req.body.basicInfo[i].make,
				totalMiles: req.body.basicInfo[i].totalMiles,
				style: req.body.basicInfo[i].style,
				category: req.body.basicInfo[i].category,
				model: req.body.basicInfo[i].model,
				price: req.body.basicInfo[i].price,
				boughtDate: req.body.basicInfo[i].boughtDate,
			}
			if (tools.hasNull(basic)) {
				res.json(Results.ERR_PARAM_ERR);
				return;
			}
			basicInfo.push(basic);
		}
		reqData.basicInfo = basicInfo;
	} else if (req.query.step == 2) {
		reqData = {
			color: req.body.color,
			noAccident: req.body.noAccident,
			driveSystem: req.body.driveSystem,
			transSystem: req.body.transSystem,
			output: req.body.output
		}
	} else if (req.query.step == 3) {
        reqData = {
            breakType: req.body.breakType,
            security: req.body.security,
            comfort: req.body.comfort
        }
    } else if (req.query.step == 4) {
        reqData = {
            description: req.body.description,
        }
    } else if (req.query.step == 5) {
        reqData = {
            address: req.body.address,
            longitude: req.body.longitude,
            latitude: req.body.latitude
        }
    } else if (req.query.step == 6) {
        reqData = {
            cover: req.body.cover,
            images: req.body.images,
        }
    } else {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }
	if (tools.hasNull(reqData)) {
		res.json(Results.ERR_PARAM_ERR);
		return;
	}
	Car.findById(carId, function(err, car) {
		if (err) {
			console.log(err);
			res.json(Results.ERR_DB_ERR);
			return;
		} else if (!car) {
			res.json(Results.ERR_NOTFOUND_ERR);
			return;
		} else {
			if (car.userId != userId) {
				res.json(Results.ERR_PERMISSION_ERR);
                return;
			}
			for (var key in reqData) {
				car[key] = reqData[key];
			}
			car.updateAt = new Date();
			car.save(function(err, apartment) {
				if (err) {
					console.log(err);
					return next();
				} else {
					res.json({
						result: true,
						data: {}
					});
				}
			});
		}
	});
};

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
                    username: car.username,
                    userAvatar: car.userAvatar,
                    schoolId: car.schoolId,
                    description: car.description,
                    cover: car.cover,
                    images: car.images,
                    address: car.address,
                    longitude: car.longitude,
                    latitude: car.latitude,
                    breakType: car.breakType,
                    security: car.security,
                    comfort: car.comfort,
                    basicInfo: car.basicInfo,
                    status: car.status
                   
				};
				//console.log(reqData);
				if (tools.isEmpty(reqData.basicInfo) || tools.isEmpty(reqData.images)) {
					res.json(Results.ERR_NOTFINISHED_ERR);
					return;
				}
				if (tools.hasNull(reqData)) {
					res.json(Results.ERR_NOTFINISHED_ERR);
					return;
				}
				car['status'] = 1;
				car.update_at = new Date();
				car.save(function(err, car) {
					if (err) {
						consolo.log(err);
						return next();
					} else {
						res.json({
							result: true,
							data: {
								"_id": car.id,
                                "schoolId": car.schoolId
							}
						});
					}
				});
			}
		});
	});
};

exports.getCarList = function(req, res, next) {
    userId = req.user.id;

    if (!userId) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var query = {
        'status': 1,
        'userId': userId,
        'available': true
    };

    Car.find(
            query,
            'id schoolId title cover username longitude latitude createAt updateAt')
        .sort({
            createAt: 'desc'
        }).exec(function(err, cars) {
        	//console.log(cars);
            if (err) {
                console.log(err);
                res.json(Results.ERR_DB_ERR);
                return;
            } else if (!cars.length) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                res.json({
                    result: true,
                    data: cars
                });
                return;
            }
        })
};

exports.getCarById = function(req, res, next) {

    var carId = req.param('id');

    console.log(carId);

    var query = {
        '_id': carId,
        'status': 1,
        'available': true
    };

    Car.find(
            query,
            'userId username userAvatar schoolId title description cover images basicInfo color noAccident driveSystem transSystem output breakType security comfort address longitude latitude create_at update_at')
        .sort({
            createAt: 'desc'
        }).exec(function(err, cars) {
            if (err) {
                console.log(err);
                res.json(Results.ERR_DB_ERR);
                return;
            } else if (!cars.length) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                res.json({
                    result: true,
                    data: cars
                });
                return;
            }
        })

};