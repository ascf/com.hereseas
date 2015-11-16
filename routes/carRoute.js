var EventProxy = require('eventproxy');
var User = require('../models').User;
var Results = require('./commonResult');
var tools = require('../common/tools');
var Car = require('../models').Car;
var School = require('../models').School;

exports.createCar = function(req, res, next) {
    var epUser = new EventProxy();
    User.findById(req.user.id,
        function(err, user) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                return;
            } else {
                if (user.status != 1 || user.verified != true) {
                    res.json(Results.ERR_PERMISSION_ERR);
                    return;
                } else if (user.schoolId == null) {
                    res.json(Results.ERR_SCHOOLISNULL_ERR);
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
            title: req.body.title,
            description: req.body.description
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
            car.save(function(err, car) {
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
                if (car.userId != userId || car.status != 2) {
                    res.json(Results.ERR_PERMISSION_ERR);
                    return;
                }
                var reqData = {
                    userId: car.userId,
                    username: car.username,
                    userAvatar: car.userAvatar,
                    schoolId: car.schoolId,
                    title: car.title,
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
                    color: car.color,
                    noAccident: car.noAccident,
                    driveSystem: car.driveSystem,
                    transSystem: car.transSystem,
                    output: car.output,
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

exports.getThreeCars = function(req, res, next) {

    schoolId = req.query.schoolId

    if (!schoolId) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var connection;
    var ep = new EventProxy();

    School.findById(schoolId, function(err, school) {
        if (err) {
            console.log(err);
            res.json(Results.ERR_DB_ERR);
            return;

        } else if (school) {
            if (school.status == 1) {
                connection = school.connection;
                ep.emit('findSchoolConnection');
            } else {
                res.json(Results.ERR_ACTIVATED_ERR);
                return;
            }
        } else {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        }

    });


    ep.all('findSchoolConnection', function() {

        var subQuery = {};
        subQuery['$in'] = connection;

        var query = {
            'status': 1,
            'available': true,
            'schoolId': subQuery
        };

        Car.find(
                query,
                'id userId username userAvatar schoolId cover')
            .sort({
                createAt: 'desc'
            }).
        limit(3).
        exec(function(err, cars) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                console.log(err);
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
        });
    });

};


exports.searchCar = function(req, res, next) {

    var query = {};
    var aptQuery = {};
    var pagination = {};

    var currentPage = 1;
    var totalPage;
    var pageSize = 6;

    console.log(req.query);
    // var page = false;

    var schoolId = req.param('schoolId');

    if (!schoolId) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var connection;
    var ep = new EventProxy();

    School.findById(schoolId, function(err, school) {
        if (err) {
            console.log(err);
            res.json(Results.ERR_DB_ERR);
            return;

        } else if (school) {
            if (school.status == 1) {
                connection = school.connection;
                ep.emit('findSchoolConnection');
            } else {
                res.json(Results.ERR_ACTIVATED_ERR);
                return;
            }
        } else {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        }
    });


    ep.all('findSchoolConnection', function() {

        if (tools.isEmpty(connection)) {
            res.json(Results.ERR_PARAM_ERR);
            return;
        }

        var subQuery = {};
        subQuery['$in'] = connection;
        aptQuery['schoolId'] = subQuery;


        if (req.query.pageSize > 0 && req.query.page > 0) {
            pageSize = req.query.pageSize;
            currentPage = req.query.page;
        }

        pagination['skip'] = (currentPage - 1) * pageSize;
        pagination['limit'] = pageSize;

        if (req.query.car) {
            var subQuery = {};
            subQuery['car'] = req.query.car;
            aptQuery['facilities'] = subQuery;
        }

        if (req.query.utility) {
            var subQuery = {};
            subQuery['utility'] = req.query.utility;
            aptQuery['facilities'] = subQuery;
        }

        if (req.query.pet) {
            var subQuery = {};
            subQuery['pet'] = req.query.pet;
            aptQuery['facilities'] = subQuery;
        }

        if (req.query.share) {
            query['share'] = req.query.share;
        }

        if (req.query.startPrice && req.query.endPrice) {
            var subQuery = {};
            subQuery['$gte'] = req.query.startPrice;
            subQuery['$lt'] = req.query.endPrice;
            query['price'] = subQuery;
        } else if (req.query.startPrice) {
            var subQuery = {};
            subQuery['$gte'] = req.query.startPrice;
            query['price'] = subQuery;
        } else if (req.query.endPrice) {
            var subQuery = {};
            subQuery['$lt'] = req.query.endPrice;
            query['price'] = subQuery;
        }

        if (req.query.apartmentType) {
            aptQuery['type'] = req.query.apartmentType;
        }

        if (req.query.roomType) {
            query['type'] = req.query.roomType;
        }

        if (req.query.date) {
            var subQuery1 = {};
            subQuery1['$gte'] = req.query.date;
            aptQuery['endDate'] = subQuery1;

            var subQuery2 = {};
            subQuery2['$lt'] = req.query.date;
            aptQuery['beginDate'] = subQuery2;
        }

        query['available'] = true;
        query['status'] = 1;

        var prepareQuery = {};
        prepareQuery['$elemMatch'] = query;
        aptQuery['rooms'] = prepareQuery;

        aptQuery['status'] = 1;
        aptQuery['available'] = true;

        // console.log("aptQuery", aptQuery);

        /*
            Apartment.find(
                    aptQuery,
                    'userId username userAvatar schoolId title description cover images type rooms description favorite available fees facilities address longitude latitude create_at update_at', pagination)
                .sort({
                    createAt: 'desc'
                }).exec(function(err, apartments) {
                    if (err) {
                        console.log(err);
                        res.json(Results.ERR_NOTFOUND_ERR);
                        return;
                    } else if (!apartments.length) {
                        res.json(Results.ERR_NOTFOUND_ERR);
                        return;
                    } else {
                        res.json({
                            result: true,
                            data: apartments
                        });
                        return;
                    }
                })
        */

        Apartment.count(aptQuery, function(err, count) {
            if (err) {
                console.log(err);
                res.json(Results.ERR_DB_ERR);
                return;
            } else if (count == 0) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {

                totalPage = Math.ceil(count / pageSize);

                var resData = [];
                Apartment.find(aptQuery, 'userId username userAvatar schoolId cover rooms longitude latitude create_at', pagination)
                    .sort({
                        createAt: 'desc'
                    }).exec(function(err, apartments) {
                        if (err) {
                            console.log(err);
                            res.json(Results.ERR_DB_ERR);
                            return;
                        } else if (!apartments.length) {
                            res.json(Results.ERR_NOTFOUND_ERR);
                            return;
                        } else {
                            for (var i = 0; i < apartments.length; i++) {
                                var apartment = apartments[i];
                                var price = {
                                    maxPrice: calculatePrice(apartments[0].rooms).maxPrice,
                                    minPrice: calculatePrice(apartments[0].rooms).minPrice
                                }
                                var type = getType(apartment.rooms);
                                resData.push({
                                    "id": apartment.id,
                                    "schoolId": apartment.schoolId,
                                    "username": apartment.username,
                                    "userAvatar": apartment.userAvatar,
                                    "latitude": apartment.latitude,
                                    "longitude": apartment.longitude,
                                    "cover": apartment.cover,
                                    "price": price,
                                    "type": type
                                });
                            }
                            res.json({
                                result: true,
                                data: {
                                    "apartments": resData,
                                    "totalPage": totalPage,
                                    "currentPage": currentPage
                                }
                            });
                            return;
                        }
                    });
            }
        });



    });



}






exports.getCarDraftList = function(req, res, next) {

    var query = {
        'status': 2,
        'available': true
    };

    query['userId'] = req.user.id;

    Car.find(
            query,
            'id userId schoolId title cover longitude latitude createAt updateAt')
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

exports.getCarDraftById = function(req, res, next) {

    var carId = req.param('id');

    var query = {
        '_id': carId,
        'status': 2
    };

    User.findById(req.user.id,
        function(err, user) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                return;
            } else if (user.status != 1 || user.verified != true) {
                res.json(Results.ERR_PERMISSION_ERR);
                return;
            } else {

                Car.find(
                        query,
                        'userId username userAvatar schoolId title description cover images basicInfo color noAccident driveSystem transSystem output breakType security comfort available status address longitude latitude create_at update_at')
                    .sort({
                        createAt: 'desc'
                    }).exec(function(err, cars) {
                        if (err) {
                            res.json(Results.ERR_DB_ERR);
                            return;
                        } else if (!cars.length) {
                            res.json(Results.ERR_NOTFOUND_ERR);
                            return;
                        } else if (cars[0].userId != req.user.id) {
                            res.json(Results.ERR_PERMISSION_ERR);
                            return;
                        } else {
                            res.json({
                                result: true,
                                data: cars
                            });
                            return;
                        }
                    });

            }
        })

};

exports.deleteCarById = function(req, res, next) {

    var carId = req.param('id');
    var reqData = {};
    var userId = req.user.id;

    if (!carId) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var epUser = new EventProxy();

    User.findById(req.user.id,
        function(err, user) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                return;
            } else {
                if (user.status != 1 || user.verified != true) {
                    res.json(Results.ERR_PERMISSION_ERR);
                    return;
                }

                epUser.emit("findUser", user);
            }
        });

    epUser.all("findUser", function(user) {

        Car.findById(carId, function(err, car) {
            if (err) {
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

                car['available'] = false;
                car.updateAt = new Date();

                car.save(function(err, car) {
                    if (err) {
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

    });

}