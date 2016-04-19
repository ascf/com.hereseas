var flash = require('connect-flash'),
    express = require('express'),
    passport = require('passport'),
    util = require('util'),
    LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var EventProxy = require('eventproxy');
var tools = require('../common/tools');

var Results = require('./commonResult');

var Apartment = require('../models').Apartment;
var Room = require('../models').Room;
var User = require('../models').User;
var School = require('../models').School;
var Recent = require('../models').Recent;

var fs = require('fs');
var adminRoute = require('./adminRoute');
var recentRoute = require('./recentRoute');


exports.getThreeApartments = function(req, res, next) {

    var schoolId = req.query.schoolId;

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

        Apartment.find(
                query,
                'id userId userName userAvatar schoolId title rooms address cover type')
            .sort({
                createAt: 'desc'
            }).
        limit(3).
        exec(function(err, apartments) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                console.log(err);
                return;
            } else if (!apartments.length) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                for (var i = 0; i < apartments.length; i++) {
                    apartments[i].price = {
                        maxPrice: calculatePrice(apartments[i].rooms).maxPrice,
                        minPrice: calculatePrice(apartments[i].rooms).minPrice
                    };
                }
                console.log(apartments);
                Apartment.count({schoolId:schoolId,available:true}, function(err, count){
                    if (err) {
                        res.json(Results.ERR_DB_ERR);
                        console.log(err);
                        return;
                    }
                    
                    res.json({
                        result: true,
                        data: apartments,
                        count: count
                    });
                });
                return;
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


};


exports.getApartmentList = function(req, res, next) {

    //schoolId = req.query.schoolId

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

    var resData = [];
    Apartment.find(
            query,
            'id schoolId title cover rooms type longitude latitude createAt updateAt')
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
                        maxPrice: calculatePrice(apartment.rooms).maxPrice,
                        minPrice: calculatePrice(apartment.rooms).minPrice
                    }
                    resData.push({
                        "id": apartment.id,
                        "schoolId": apartment.schoolId,
                        "title": apartment.title,
                        "cover": apartment.cover,
                        "type": apartment.type,
                        "longitude": apartment.longitude,
                        "latitude": apartment.latitude,
                        "createAt": apartment.createAt,
                        "updateAt": apartment.updateAt,
                        "maxPrice": price.maxPrice,
                        "minPrice": price.minPrice
                    });
                }


                res.json({
                    result: true,
                    data: resData
                });
                return;
            }
        })
};



exports.getApartmentById = function(req, res, next) {

    var apartmentId = req.param('id');

    console.log(apartmentId);

    var query = {
        '_id': apartmentId,
        'status': 1,
        'available': true
    };

    var roomQuery = {};
    roomQuery['available'] = true;
    roomQuery['status'] = 1;

    var prepareQuery = {};
    prepareQuery['$elemMatch'] = roomQuery;
    query['rooms'] = prepareQuery;

    Apartment.find(
            query,
            'userId username userAvatar schoolId title description cover images type beginDate endDate rooms description favorite available fees facilities address longitude latitude create_at update_at')
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
                res.json({
                    result: true,
                    data: apartments
                });
                return;
            }
        })

};



exports.getApartmentDraftList = function(req, res, next) {

    var query = {
        'status': 2,
        'available': true
    };

    query['userId'] = req.user.id;

    Apartment.find(
            query,
            'id userId schoolId title cover type longitude latitude createAt updateAt')
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
                res.json({
                    result: true,
                    data: apartments
                });
                return;
            }
        })
};


exports.getApartmentDraftById = function(req, res, next) {

    var apartmentId = req.param('id');

    console.log(apartmentId);

    var query = {
        '_id': apartmentId,
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

                Apartment.find(
                        query,
                        'userId username userAvatar schoolId title description cover images type beginDate endDate rooms description favorite available fees facilities address longitude latitude create_at update_at')
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
                        } else if (apartments[0].userId != req.user.id) {
                            res.json(Results.ERR_PERMISSION_ERR);
                            return;
                        } else {
                            res.json({
                                result: true,
                                data: apartments
                            });
                            return;
                        }
                    });

            }
        })

};


exports.searchApartment = function(req, res, next) {

    var query = {};
    var aptQuery = {};
    var pagination = {};

    var currentPage = 1;
    var totalPage;
    var pageSize = 6;

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
        aptQuery['schoolId'] = schoolId;


        if (req.query.pageSize > 0 && req.query.page > 0) {
            pageSize = req.query.pageSize;
            currentPage = parseInt(req.query.page, 10);

            if (!tools.checkPositiveNumber(currentPage)) {
                currentPage = 1;
            }
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
                Apartment.find(aptQuery, 'userId username userAvatar title schoolId cover rooms longitude latitude createAt', pagination).populate('schoolId', 'name shortName cnName')
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
                                    maxPrice: calculatePrice(apartment.rooms).maxPrice,
                                    minPrice: calculatePrice(apartment.rooms).minPrice
                                }
                                var type = getType(apartment.rooms);

                                var sameSchool = true;

                                if (school.id != apartment.schoolId._id) {
                                    sameSchool = false;
                                }

                                resData.push({
                                    "id": apartment.id,
                                    "schoolId": apartment.schoolId._id,
                                    "schoolName": apartment.schoolId.name,
                                    "schoolShortName": apartment.schoolId.shortName,
                                    "schoolCnName": apartment.schoolId.cnName,
                                    "sameSchool": sameSchool,
                                    "username": apartment.username,
                                    "userAvatar": apartment.userAvatar,
                                    "title" : apartment.title,
                                    "latitude": apartment.latitude,
                                    "longitude": apartment.longitude,
                                    "cover": apartment.cover,
                                    "price": price,
                                    "type": type,
                                    "sameSchool": sameSchool
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

/*** add get apartment by distance **/ // added 3/18/2016 // Chengyu Huang
exports.geosearchApartment = function (req, res, next) {
        //sort order 
            var sortOrder = {};
            var sortObj = req.query.sort;
            if (sortObj){
            if (sortObj == "price"){
                sortOrder = {"rooms.price": 1};
            }else if(sortObj == "dprice"){
                sortOrder = {"rooms.price": -1};
            }else if(sortObj == "time"){
                sortOrder = {"createAt": -1};
            }else if(sortObj =="dtime"){
                sortOrder = {"createAt": 1};
            }
            }
        //pages 
            var currentPage = parseInt(req.query.page,10) || 1;
            var totalPage;
            var pageSize = parseInt(req.query.pagesize,10) || 6;
        
        //geo query prams set up 
            var limit = pageSize;
            var skip = (currentPage-1)*pageSize;
        //get the max distance or set it to 8 kilometers
            var maxDistance = req.query.distance || 5;  // distance is measured by meters
            maxDistance =maxDistance*1000*1.6; // distance is measured in meters, convert it to miles here 
            
        //get [long , lat]
            var coords = [];
            coords[0]=Number(req.query.longitude);
            coords[1]=Number(req.query.latitude);   
        // build query
            var mongoQuery = {};
            var query = {};
            var aptQuery = {};
            var schoolId = req.query.schoolId;  
            
            function buildquery(){
                        var subQuery = {};
                        
                        if (schoolId) {
                            aptQuery['schoolId'] = schoolId;
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

                        if (req.query.beginDate) {
                            var subQuery1 = {};
                            subQuery1['$gte'] = new Date(req.query.beginDate);
                            aptQuery['beginDate'] = subQuery1;
                        }
                        
                        if (req.query.endDate) {
                            var subQuery2 = {};
                            subQuery2['$lte'] = new Date(req.query.endDate);
                            aptQuery['endDate'] = subQuery2;
                        }

                        query['available'] = true;
                        query['status'] = 1;

                        var prepareQuery = {};
                        prepareQuery['$elemMatch'] = query;
                        aptQuery['rooms'] = prepareQuery;

                        aptQuery['status'] = 1;
                        aptQuery['available'] = true;

                        // build loc for geo search 
                        if (coords[0] && coords[1]){
                        aptQuery['loc'] = {
                            $near:{
                                $geometry:{
                                    type: "Point",
                                    coordinates: coords
                                },
                                    $maxDistance: maxDistance,
                                    $minDistance: 0
                                }
                            };
                        }
                        
                return aptQuery;
            };  
            
        //query the database
            mongoQuery = buildquery();
                //console.log(mongoQuery);
             var resData = [];
             Apartment.count(mongoQuery).exec(function(err,count){
             if (err) {
                console.log(err);
                res.json(Results.ERR_DB_ERR);
                return;
                } else if (count == 0) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
                }else {
                    totalPage = Math.ceil(count/pageSize);
        
                //find apartment query
                    Apartment.find(mongoQuery,'userId username userAvatar title schoolId cover rooms longitude latitude createAt')
                    .populate('schoolId','name shortName cnName')
                    .sort(sortOrder)
                    .skip(skip)
                    .limit(limit)
                    .exec(function(err,apartments){
                            if (err){
                                console.log(err);
                                res.json(Results.ERR_DB_ERR);
                                return;
                            } else if (!apartments.length){
                                res.json(Results.ERR_NOTFOUND_ERR);
                                return;
                            }
                            for (var i = 0; i < apartments.length; i++) {
                                var apartment = apartments[i];
                                var price = {
                                    maxPrice: calculatePrice(apartment.rooms).maxPrice,
                                    minPrice: calculatePrice(apartment.rooms).minPrice
                                }
                                var type = getType(apartment.rooms);

                                var sameSchool = true;

                                if (schoolId != apartment.schoolId._id) {
                                    sameSchool = false;
                                }

                                resData.push({
                                    "id": apartment.id,
                                    "schoolId": apartment.schoolId._id,
                                    "schoolName": apartment.schoolId.name,
                                    "schoolShortName": apartment.schoolId.shortName,
                                    "schoolCnName": apartment.schoolId.cnName,
                                    "sameSchool": sameSchool,
                                    "username": apartment.username,
                                    "userAvatar": apartment.userAvatar,
                                    "title" : apartment.title,
                                    "latitude": apartment.latitude,
                                    "longitude": apartment.longitude,
                                    "cover": apartment.cover,
                                    "price": price,
                                    "type": type
                                });
                            }
                            res.json({
                                        result:true,
                                        data:{
                                            "totalPage": totalPage,
                                            "currentPage": currentPage,
                                            "apartments": resData,
                                        } 
                                    });
                            return;
                        });
                };
            }); // end of the entire qurey
};
// end of geoApartment search 


function calculatePrice(rooms) {
    var max = 0
    var min = Number.MAX_VALUE
    for (var i = 0; i < rooms.length; i++) {
        if (max < rooms[i].price)
            max = rooms[i].price;
        if (min > rooms[i].price)
            min = rooms[i].price;
    }
    var price = {
        maxPrice: max,
        minPrice: min
    }
    return price;
}
//type needs to be checked. There are total three types: 卧室、客厅、其它
function getType(rooms) {
    var filter = [false, false, false];
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].type === "卧室")
            filter[0] = true;
        if (rooms[i].type === "客厅")
            filter[1] = true;
        if (rooms[i].type === "其它")
            filter[2] = true;
    }
    var type = []
    if (filter[0]) type.push("卧室");
    if (filter[1]) type.push("客厅");
    if (filter[2]) type.push("其它");
    return type;
}

exports.createApartment = function(req, res, next) {

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

        var reqData = {
            userId: user.id,
            username: user.username,
            userAvatar: user.avatar,
            schoolId: req.body.schoolId,
            type: req.body.type,
            beginDate: req.body.beginDate,
            endDate: req.body.endDate,
        };

        if (tools.hasNull(reqData)) {

            res.json(Results.ERR_PARAM_ERR);
            return;
        }

        var apartment = new Apartment();

        for (var key in reqData) {
            apartment[key] = reqData[key];
        }

        apartment['status'] = 2;

        apartment.save(function(err, apartment) {

            if (err) {
                console.log(err);
                return next();
            } else {
                updateUserApartments(apartment._id, req.user.id);
                res.json({
                    result: true,
                    data: {
                        "_id": apartment.id,
                        "schoolId": apartment.schoolId,
                        "type": apartment.type,
                        "beginDate": apartment.beginDate,
                        "endDate": apartment.endDate
                    }
                });
            }
        });
    });
}

//insert apartmentId into user.apartments after create apartment
function updateUserApartments(apartmentId, userId) {
    var epUser = new EventProxy();
    User.findById(userId, function(err, user) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
            return;
        } else {
            epUser.emit("findUser", user);
        }
    });
    epUser.all("findUser", function(user) {

        user.apartments.addToSet(apartmentId);
        user.save(function() {});
    });
    return;
}



exports.editApartmentById = function(req, res, next) {

    var apartmentId = req.param('id');
    var reqData = {};
    var userId = req.user.id;

    if (!req.query.step) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    if (req.query.step == 1) {
        reqData = {
            type: req.body.type,
            schoolId: req.body.schoolId,
            type: req.body.type,
            beginDate: req.body.beginDate,
            endDate: req.body.endDate
        }

    } else if (req.query.step == 2) {

        if (tools.isEmpty(req.body.rooms)) {
            res.json(Results.ERR_PARAM_ERR);
            return;
        }

        var rooms = [];

        for (var i = 0; i < req.body.rooms.length; i++) {
            if (!tools.checkPrice(req.body.rooms[i].price)) {
                res.json(Results.ERR_PARAM_ERR);
                return;
            }
            if (!tools.checkRoomType(req.body.rooms[i].type)) {
                res.json(Results.ERR_PARAM_ERR);
                return;
            }
            var room = {
                share: req.body.rooms[i].share,
                type: req.body.rooms[i].type,
                price: req.body.rooms[i].price,
                priceType: req.body.rooms[i].priceType,
                bathroom: req.body.rooms[i].bathroom,
                closet: req.body.rooms[i].closet,
                walkInCloset: req.body.rooms[i].walkInCloset
            }

            if (tools.hasNull(room)) {
                res.json(Results.ERR_PARAM_ERR);
                return;
            }
            rooms.push(room);
        }
        reqData.rooms = rooms;


    } else if (req.query.step == 3) {
        reqData = {
            facilities: req.body.facilities
        }
    } else if (req.query.step == 4) {
        reqData = {
            fees: req.body.fees
        }
    } else if (req.query.step == 5) {
        reqData = {
            title: req.body.title,
            description: req.body.description,
        }
    } else if (req.query.step == 6) {
        reqData = {
            address: req.body.address,
            longitude: req.body.longitude,
            latitude: req.body.latitude
        }
    } else if (req.query.step == 7) {
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


    User.findById(req.user.id,
        function(err, user) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                return;
            } else if (user.status != 1 || user.verified != true) {
                res.json(Results.ERR_PERMISSION_ERR);
                return;
            } else if (user.schoolId == null) {
                res.json(Results.ERR_SCHOOLISNULL_ERR);
                return;
            } else {

                Apartment.findById(apartmentId, function(err, apartment) {
                    if (err) {
                        console.log(err);
                        res.json(Results.ERR_DB_ERR);
                        return;
                    } else if (!apartment) {
                        res.json(Results.ERR_NOTFOUND_ERR);
                        return;
                    } else {

                        if (apartment.userId != userId) {
                            res.json(Results.ERR_PERMISSION_ERR);
                            return;
                        }

                        for (var key in reqData) {
                            apartment[key] = reqData[key];
                        }
                        apartment.update_at = new Date();

                        apartment.save(function(err, apartment) {
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



            }
        });

};

exports.postApartmentById = function(req, res, next) {

    var apartmentId = req.param('id');
    var reqData = {};
    var userId = req.user.id;

    var epUser = new EventProxy();

    if (!apartmentId) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

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

        Apartment.findById(apartmentId, function(err, apartment) {
            if (err) {
                console.log(err);
                res.json(Results.ERR_DB_ERR);
                return;
            } else if (!apartment) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                if (apartment.userId != userId || apartment.status != 2) {
                    res.json(Results.ERR_PERMISSION_ERR);
                    return;
                }

                var reqData = {
                    userId: apartment.userId,
                    username: apartment.username,
                    userAvatar: apartment.userAvatar,
                    schoolId: apartment.schoolId,
                    title: apartment.title,
                    description: apartment.description,
                    cover: apartment.cover,
                    images: apartment.images,
                    type: apartment.type,
                    fees: apartment.fees,
                    facilities: apartment.facilities,
                    address: apartment.address,
                    longitude: apartment.longitude,
                    latitude: apartment.latitude,
                    rooms: apartment.rooms,
                    status: apartment.status
                };

                if (tools.isEmpty(reqData.rooms) || tools.isEmpty(reqData.images)) {
                    res.json(Results.ERR_NOTFINISHED_ERR);
                    return;
                }

                if (tools.hasNull(reqData)) {
                    res.json(Results.ERR_NOTFINISHED_ERR);
                    return;
                }

                apartment['status'] = 1;
                apartment.update_at = new Date();

                apartment.save(function(err, apartment) {
                    if (err) {
                        console.log(err);
                        return next();
                    } else {
                        recentRoute.updateRecentList(apartment, 1);
                        res.json({
                            result: true,
                            data: {
                                "_id": apartment.id,
                                "schoolId": apartment.schoolId
                            }
                        });           
                    }
                });
            }
        });
    });
}

exports.deleteApartmentById = function(req, res, next) {

    var apartmentId = req.param('id');
    var reqData = {};
    var userId = req.user.id;

    if (!apartmentId) {
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

        Apartment.findById(apartmentId, function(err, apartment) {
            if (err) {
                console.log(err);
                res.json(Results.ERR_DB_ERR);
                return;
            } else if (!apartment) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                if (apartment.userId != userId) {
                    res.json(Results.ERR_PERMISSION_ERR);
                    return;
                }

                apartment['available'] = false;
                apartment.update_at = new Date();

                apartment.save(function(err, apartment) {
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

    });

}



exports.image_upload = function(req, res, next) {
    //res.json({result:'hell'});
    //return;

    console.log(JSON.stringify(req.files));

    var result = {};
    result.result = 'true';
    var image = "apartment_" + req.files.file.name;


    // 获得文件的临时路径
    var tmp_path = req.files.file.path;
    // 指定文件上传后的目录 - 示例为"images"目录。 
    // var target_path = './public/images/' + 'apartment' +'/'+ image;

    var target_path = './public/images/apartment/' + image;
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
        // 删除临时文件夹文件, 
        //fs.unlink(tmp_path, function(err){
        if (err) {
            console.log(err);
            res.json({
                result: 'false'
            });
        } else {
            res.json({
                result: 'true',
                image: image
            });

        };
        //});
    });



    //console.log("message");

    //res.json({result:'hell'});
};

function saveImage(file, path, newName, callback) {
    // 获得文件的临时路径
    var tmp_path = file.path;
    // 指定文件上传后的目录 - 示例为"images"目录。 
    var target_path = './public/images/' + path + '/' + newName;
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
        // 删除临时文件夹文件, 
        fs.unlink(tmp_path, callback(err));
    });
};


//admin functions
exports.adminGetApartmentId = function(req, res, next) {
    var ep = new EventProxy();
    //check admin
    adminRoute.isAdmin(req.user.email, function(result) {
        if (result) {
            ep.emit('checkAdmin');
        } else {
            res.json(Results.ERR_PERMISSION_ERR);
        }
    });
    ep.all('checkAdmin', function() {
        // execute admin function

        var query = {};

        Apartment.find(query, 'id').sort({
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
    });
};

exports.adminGetApartmentAllInfo = function(req, res, next) {
    var ep = new EventProxy();
    //check admin
    adminRoute.isAdmin(req.user.email, function(result) {
        if (result) {
            ep.emit('checkAdmin');
        } else {
            res.json(Results.ERR_PERMISSION_ERR);
        }
    });
    ep.all('checkAdmin', function() {
        // execute admin function
        var apartmentId = req.param('id');
        if (apartmentId) {
            Apartment.findById(apartmentId,
                function(err, apartment) {
                    if (err) {
                        res.json(Results.ERR_DB_ERR);
                    } else {
                        res.json({
                            result: true,
                            data: apartment
                        });
                    }
                });
        } else {
            res.json(Results.ERR_URL_ERR);
        }
    });
};

exports.adminEditApartmentStatus = function(req, res, next) {
    var ep = new EventProxy();
    //check admin
    adminRoute.isAdmin(req.user.email, function(result) {
        if (result) {
            ep.emit('checkAdmin');
        } else {
            res.json(Results.ERR_PERMISSION_ERR);
        }
    });
    ep.all('checkAdmin', function() {
        // execute admin function
        var apartmentId = req.param('id');
        var reqData = {
            status: req.body.status
        };
        if (tools.isEmpty(apartmentId)) {
            res.json(Results.ERR_PARAM_ERR);
            return;
        }
        if (tools.hasNull(reqData)) {
            res.json(Results.ERR_PARAM_ERR);
            return;
        }
        var query = {
            id: apartmentId
        };
        Apartment.findById(apartmentId, function(err, apartment) {
            if (err) {
                console.log(err);
                return next();
            } else if (!apartment) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                for (var key in reqData) {
                    apartment[key] = reqData[key];
                }
                apartment.save(function(err, apartmentSave) {
                    if (err) {
                        console.log(err);
                        return next();
                    } else {
                        res.json({
                            result: true,
                            data: {
                                'id': apartmentSave.id,
                                'username': apartmentSave.username,
                                'status': apartmentSave.status
                            }
                        });
                    }
                });

            }

        });
    });
};