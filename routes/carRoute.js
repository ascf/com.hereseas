var EventProxy = require('eventproxy');
var User = require('../models').User;
var Results = require('./commonResult');
var tools = require('../common/tools');
var Car = require('../models').Car;
var School = require('../models').School;
var adminRoute = require('./adminRoute');

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

        reqData = {
            year: req.body.year,
            make: req.body.make,
            totalMiles: req.body.totalMiles,
            style: req.body.style,
            category: req.body.category,
            model: req.body.model,
            price: req.body.price,
            boughtDate: req.body.boughtDate,
        }

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
                    year: car.year,
                    make: car.make,
                    totalMiles: car.totalMiles,
                    style: car.style,
                    category: car.category,
                    model: car.model,
                    price: car.price,
                    boughtDate: car.boughtDate,
                    color: car.color,
                    noAccident: car.noAccident,
                    driveSystem: car.driveSystem,
                    transSystem: car.transSystem,
                    output: car.output,
                    status: car.status
                };
                //console.log(reqData);
                if (tools.isEmpty(reqData.images)) {
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
            'userId username userAvatar schoolId title description cover images year make totalMiles style category model price boughtDate color noAccident driveSystem transSystem output breakType security comfort address longitude latitude create_at update_at')
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
    var pagination = {};

    var currentPage = 1;
    var totalPage;
    var pageSize = 6;

    console.log(req.query);

    var schoolId = req.param('schoolId');

    if (!schoolId) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var connection;
    var ep = new EventProxy();

    ep.all('findSchoolConnection', function() {

        if (tools.isEmpty(connection)) {
            res.json(Results.ERR_PARAM_ERR);
            return;
        }

        var subQuery = {};
        subQuery['$in'] = connection;
        query['schoolId'] = subQuery;

        if (req.query.pageSize > 0 && req.query.page > 0) {
            pageSize = req.query.pageSize;
            currentPage = parseInt(req.query.page, 10);

            if (!tools.checkPositiveNumber(currentPage)) {
                currentPage = 1;
            }

        }

        pagination['skip'] = (currentPage - 1) * pageSize;
        pagination['limit'] = pageSize;

        if (req.query.category) {
            query['category'] = req.query.category;
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

        query['available'] = true;
        query['status'] = 1;

        Car.count(query, function(err, count) {
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
                Car.find(query, 'id userId username userAvatar schoolId title cover price category longitude latitude createAt', pagination)
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
                                data: {
                                    "cars": cars,
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


exports.adminGetCars = function(req, res, next) {
    var ep = new EventProxy();
    //check admin

    ep.all('checkAdmin', function() {
        // execute admin function
        Car.find({
                status: 1
            },
            function(err, cars) {
                if (err) {
                    res.json(Results.ERR_DB_ERR);
                } else {
                    res.json({
                        result: true,
                        data: cars
                    });
                }
            });
    });

    adminRoute.isAdmin(req.user.email, function(result) {
        if (result) {
            ep.emit('checkAdmin');
        } else {
            res.json(Results.ERR_PERMISSION_ERR);
        }
    });

};