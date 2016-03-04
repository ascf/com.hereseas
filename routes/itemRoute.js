var EventProxy = require('eventproxy');
var User = require('../models').User;
var Results = require('./commonResult');
var tools = require('../common/tools');
var Item = require('../models').Item;
var School = require('../models').School;
var Car = require('../models').Car;
var Apartment = require('../models').Apartment;

var recentRoute = require('./recentRoute');

exports.createItem = function(req, res, next) {
    var epUser = new EventProxy();

    epUser.all("findUser", function(user) {
        //execute after "findUser" is emited
        var reqData = {
            userId: user.id,
            username: user.username,
            userAvatar: user.avatar,
            schoolId: req.body.schoolId,
            expireAt: req.body.expireAt,
            itemName: req.body.itemName,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
            cover: req.body.cover,
            images: req.body.images
        };
        if (tools.hasNull(reqData)) {
            res.json(Results.ERR_PARAM_ERR);
            return;
        }
        var item = new Item();
        for (var key in reqData) {
            item[key] = reqData[key];
        }
        item['status'] = 2;
        item.save(function(err, item) {
            if (err) {
                console.log(err);
                return next();
            } else {
                updateUserItems(item._id, req.user.id);
                res.json({
                    result: true,
                    data: item
                });
            }
        });
    });

    User.findById(req.user.id, function(err, user) {
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
};


function updateUserItems(itemId, userId) {
    var epUser = new EventProxy();
    epUser.all("findUser", function(user) {

        user.items.addToSet(itemId);
        user.save(function() {});
        return;
    });

    User.findById(userId, function(err, user) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
            return;
        } else {
            epUser.emit("findUser", user);
        }
    });

}


exports.editItemById = function(req, res, next) {
    var itemId = req.param('id');
    var userId = req.user.id;
    var reqData = {};
    if (!req.query.step) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }
    if (req.query.step == 1) {
        reqData = {
            expireAt: req.body.expireAt,
            itemName: req.body.itemName,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
            cover: req.body.cover,
            images: req.body.images
        }
    } else if (req.query.step == 2) {
        reqData = {
            address: req.body.address,
            longitude: req.body.longitude,
            latitude: req.body.latitude
        }
    } else {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }
    if (tools.hasNull(reqData)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }
    Item.findById(itemId, function(err, item) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
            return;
        } else if (!item) {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        } else {
            if (item.userId != userId) {
                res.json(Results.ERR_PERMISSION_ERR);
                return;
            }
            for (var key in reqData) {
                item[key] = reqData[key];
            }
            item.updateAt = new Date();
            item.save(function(err, item) {
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
};

exports.getItemById = function(req, res, next) {
    var itemId = req.param('id');

    var query = {
        '_id': itemId,
        'status': 1,
        'available': true
    };

    Item.find(query,
            'userId username userAvatar schoolId expireAt itemName category price description cover images address longitude latitude createAt updateAt')
        .sort({
            createAt: 'desc'
        }).exec(function(err, items) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                return;
            } else if (!items.length) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                res.json({
                    result: true,
                    data: items
                });
                return;
            }
        })
};

exports.getThreeItems = function(req, res, next) {

    schoolId = req.query.schoolId

    if (!schoolId) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var connection;
    var ep = new EventProxy();

    ep.all('findSchoolConnection', function() {

        var subQuery = {};
        subQuery['$in'] = connection;

        var query = {
            'status': 1,
            'available': true,
            'schoolId': schoolId
        };

        Item.find(query, 'id userId username userAvatar schoolId cover').sort({
            createAt: 'desc'
        }).limit(3).exec(function(err, items) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                return;
            } else if (!items.length) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                res.json({
                    result: true,
                    data: items
                });
                return;
            }
        });
    });

    School.findById(schoolId, function(err, school) {
        if (err) {
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

};

exports.getItemList = function(req, res, next) {

    var userId = req.user.id;

    if (!userId) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var query = {
        'status': 1,
        'userId': userId,
        'available': true
    };

    Item.find(query, 'id schoolId itemName cover price expireAt longitude latitude createAt updateAt')
        .sort({
            createAt: 'desc'
        }).exec(function(err, items) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                return;
            } else if (!items.length) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                res.json({
                    result: true,
                    data: items
                });
                return;
            }
        })
};

exports.postItemById = function(req, res, next) {
    var itemId = req.param('id');
    var reqData = {};
    var userId = req.user.id;
    var epUser = new EventProxy();
    epUser.all("findUser", function(user) {
        Item.findById(itemId, function(err, item) {
            if (err) {
                //console.log(err);
                res.json(Results.ERR_DB_ERR);
                return;
            } else if (!item) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                if (item.userId != userId || item.status != 2) {
                    res.json(Results.ERR_PERMISSION_ERR);
                    return;
                }
                var reqData = {
                    userId: item.userId,
                    username: item.username,
                    userAvatar: item.userAvatar,
                    schoolId: item.schoolId,
                    expireAt: item.expireAt,
                    itemName: item.itemName,
                    category: item.category,
                    price: item.price,
                    description: item.description,
                    cover: item.cover,
                    images: item.images,
                    address: item.address,
                    longitude: item.longitude,
                    latitude: item.latitude

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
                item['status'] = 1;
                item.updateAt = new Date();
                item.save(function(err, item) {
                    if (err) {
                        //consolo.log(err);
                        return next();
                    } else {
                        recentRoute.updateRecentList(item, 3);
                        res.json({
                            result: true,
                            data: {
                                "_id": item.id,
                                "schoolId": item.schoolId
                            }
                        });
                    }
                });
            }
        });
    });

    User.findById(req.user.id, function(err, user) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
            return;
        } else {
            epUser.emit("findUser", user);
        }
    });
};


exports.searchItem = function(req, res, next) {

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

    ep.all('findSchoolConnection', function(school) {

        // if (tools.isEmpty(connection)) {
        //     res.json(Results.ERR_PARAM_ERR);
        //     return;
        // }

        var subQuery = {};
        //subQuery['$in'] = connection;
        query['schoolId'] = schoolId;

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

        Item.count(query, function(err, count) {
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
                Item.find(query, 'id userId username userAvatar schoolId itemName cover price category longitude latitude createAt', pagination).populate('schoolId', 'name shortName cnName')
                    .sort({
                        createAt: 'desc'
                    }).exec(function(err, items) {
                        if (err) {
                            console.log(err);
                            res.json(Results.ERR_DB_ERR);
                            return;
                        } else if (!items.length) {
                            res.json(Results.ERR_NOTFOUND_ERR);
                            return;
                        } else {

                            for (var i = 0; i < items.length; i++) {

                                var item = items[i];
                                var sameSchool = true;
                                if (school.id != item.schoolId._id) {
                                    sameSchool = false;
                                }
                                resData.push({
                                    "id": item.id,
                                    "itemName": item.itemName,
                                    "schoolId": item.schoolId._id,
                                    "schoolName": item.schoolId.name,
                                    "schoolShortName": item.schoolId.shortName,
                                    "schoolCnName": item.schoolId.cnName,
                                    "sameSchool": sameSchool,
                                    "username": item.username,
                                    "userAvatar": item.userAvatar,
                                    "latitude": item.latitude,
                                    "longitude": item.longitude,
                                    "cover": item.cover,
                                    "price": item.price,
                                    "category": item.category,
                                });

                            }

                            res.json({
                                result: true,
                                data: {
                                    "items": resData,
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
                ep.emit('findSchoolConnection', school);
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



exports.deleteItemById = function(req, res, next) {

    var itemId = req.param('id');
    var reqData = {};
    var userId = req.user.id;

    if (!itemId) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var epUser = new EventProxy();

    epUser.all("findUser", function(user) {

        Item.findById(itemId, function(err, item) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                return;
            } else if (!item) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                if (item.userId != userId) {
                    res.json(Results.ERR_PERMISSION_ERR);
                    return;
                }

                item['available'] = false;
                item.updateAt = new Date();

                item.save(function(err, item) {
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

    User.findById(req.user.id, function(err, user) {
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

}

exports.getUserOtherItems = function(req, res, next) {
    //console.log(req.query.itemId);
    var userId = req.param('id');
    var itemId = req.query.itemId;

    if (!userId || !itemId) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var query = {
        'status': 1,
        'userId': userId,
        'available': true
    };

    var ep = new EventProxy();

    ep.all('findItems', function() {

        //sort resData by updateAt in descending order

        resData.sort(function(a, b) {
            return b.content.updateAt.valueOf() - a.content.updateAt.valueOf();
        });

        if (resData.length <= 9) {
            res.json({
                result: true,
                data: resData
            });
            return;
        } else {
            res.json({
                result: true,
                data: resData.slice(0, 9)
            });
            return;
        }

    });


    ep.all('findCars', function() {
        var queryItem = {
            'status': 1,
            'userId': userId,
            'available': true,
            '_id': {
                '$ne': itemId
            }
        }
        Item.find(queryItem, 'id itemName cover createAt updateAt')
            .sort({
                updateAt: 'desc'
            }).limit(9).exec(function(err, items) {
                if (err) {
                    console.log(err);
                    res.json(Results.ERR_DB_ERR);
                    return;
                } else {
                    for (var i = 0; i < items.length; i++) {
                        var tmp = {};
                        tmp.identity = 3;
                        tmp.content = items[i];
                        resData.push(tmp);
                    }
                    ep.emit('findItems')
                }
            });

    });


    ep.all('findApartments', function() {
        Car.find(query, 'id title cover createAt updateAt')
            .sort({
                updateAt: 'desc'
            }).limit(9).exec(function(err, cars) {
                if (err) {
                    console.log(err);
                    res.json(Results.ERR_DB_ERR);
                    return;
                } else {
                    for (var i = 0; i < cars.length; i++) {
                        var tmp = {};
                        tmp.identity = 2;
                        tmp.content = cars[i];
                        resData.push(tmp);
                    }
                    ep.emit('findCars')
                }
            });

    });

    var resData = [];

    Apartment.find(query, 'id title cover createAt updateAt')
        .sort({
            updateAt: 'desc'
        }).limit(9).exec(function(err, apartments) {
            if (err) {
                console.log(err);
                res.json(Results.ERR_DB_ERR);
                return;
            } else {
                for (var i = 0; i < apartments.length; i++) {
                    var tmp = {};
                    tmp.identity = 1;
                    tmp.content = apartments[i];
                    resData.push(tmp);
                }
                ep.emit('findApartments')
            }
        });
}