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

var fs = require('fs');



exports.getThreeApartments = function(req, res, next) {

    var query = {
        'status': 1
    };

    Apartment.find(
            query,
            'id userId userName userAvatar schoolId title cover type createAt updateAt')
        .sort({
            create_at: 'desc'
        }).
    limit(3).
    exec(function(err, apartments) {
        if (err) {
            console.log(err);
        } else if (!schools.length) {
            res.json(Results.ERR_NOTFOUND_ERR);
        } else {
            res.json({
                result: true,
                data: apartments
            });
        }
    })
};


exports.getApartmentList = function(req, res, next) {

    var query = {
        'status': 1
    };

    Apartment.find(
            query,
            'id userId userFirstName userLastName userAvatar schoolId title cover type longitude latitude createAt updateAt')
        .sort({
            createAt: 'desc'
        }).exec(function(err, apartments) {
            if (err) {
                console.log(err);
            } else if (!apartments.length) {
                res.json(Results.ERR_NOTFOUND_ERR);
            } else {
                res.json({
                    result: true,
                    data: apartments
                });
            }
        })
};



exports.getApartmentById = function(req, res, next) {

    var apartmentId = req.param('id');

    console.log(apartmentId);

    var query = {
        '_id': apartmentId,
        'status': 1
    };

    Apartment.find(
            query,
            'userId userFirstName userLastName userAvatar schoolId title description cover images type rooms description favorite available fees facilities address longitude latitude create_at update_at ').limit(1)
        .populate('rooms', null, {
            'status': 1
        }).exec(function(err, apartment) {
            if (err) {
                console.log(err);
            } else if (!apartment.length) {
                res.json(Results.ERR_NOTFOUND_ERR);
            } else {

                console.log(apartment);

                res.json({
                    result: true,
                    data: apartment
                });
            }
        })

};
//'type price bathroom closet walkInCloset beginDate endDate available create_at update_at'


exports.addApartment = function(req, res, next) {

    var reqData = {
        userId: req.body.userId,
        userFirstName: req.body.userFirstName,
        userLastName: req.body.userLastName,
        userAvatar: req.body.userAvatar,
        schoolId: req.body.schoolId,
        title: req.body.title,
        description: req.body.description,
        cover: req.body.cover,
        images: req.body.images,
        type: req.body.type,
        fees: req.body.fees,
        facilities: req.body.facilities,
        address: req.body.address,
        longitude: req.body.longitude,
        latitude: req.body.latitude
    };

    if (tools.isEmpty(req.body.rooms)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var apartment = new Apartment();

    for (var key in reqData) {
        apartment[key] = reqData[key];
    }

    var rooms = [];

    for (var i = 0; i < req.body.rooms.length; i++) {

        var room = {
            type: req.body.rooms[i].type,
            price: req.body.rooms[i].price,
            bathroom: req.body.rooms[i].bathroom,
            closet: req.body.rooms[i].closet,
            walkInCloset: req.body.rooms[i].walkInCloset,
            beginDate: req.body.rooms[i].beginDate,
            endDate: req.body.rooms[i].endDate
        }

        if (tools.hasNull(room)) {
            res.json(Results.ERR_PARAM_ERR);
            return;
        }
        rooms.push(room);
    }

    reqData.rooms = rooms;

    if (tools.hasNull(reqData)) {

        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    apartment.save(function(err, apartment) {

        if (err) {
            console.log(err);
            return next();
        } else {

            var ep = new EventProxy();
            for (var i = 0; i < reqData.rooms.length; i++) {

                var room = new Room();

                for (var key in reqData.rooms[i]) {
                    room[key] = reqData.rooms[i][key];
                }

                room.save(function(err, room) {

                    if (err) {
                        console.log(err);
                        return next();
                    } else {
                        ep.emit("insertRoom", room)
                    }

                });

            }

            ep.after("insertRoom", reqData.rooms.length, function(roomList) {

                for (var i = 0; i < roomList.length; i++) {
                    apartment.rooms.push(roomList[i].id);
                }

                apartment.save(function(err, apartment) {

                    if (err) {
                        console.log(err);
                        return next();
                    } else {
                        res.json({
                            result: true,
                            data: apartment
                        });
                    }
                });
            });

        }
    });
}



exports.updateApartmentById = function(req, res, next) {

    var apartmentId = req.param('id');

    var reqData = {
        schoolId: req.body.schoolId,
        title: req.body.title,
        description: req.body.description,
        cover: req.body.cover,
        images: req.body.images,
        type: req.body.type,
        fees: req.body.fees,
        facilities: req.body.facilities,
        address: req.body.address,
        longitude: req.body.longitude,
        latitude: req.body.latitude
    };

    if (tools.isEmpty(req.body.rooms)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var apartment = new Apartment();

    for (var key in reqData) {
        apartment[key] = reqData[key];
    }

    var rooms = [];

    for (var i = 0; i < req.body.rooms.length; i++) {

        var room = {
            type: req.body.rooms[i].type,
            price: req.body.rooms[i].price,
            bathroom: req.body.rooms[i].bathroom,
            closet: req.body.rooms[i].closet,
            walkInCloset: req.body.rooms[i].walkInCloset,
            beginDate: req.body.rooms[i].beginDate,
            endDate: req.body.rooms[i].endDate
        }

        if (tools.hasNull(room)) {
            res.json(Results.ERR_PARAM_ERR);
            return;
        }
        rooms.push(room);
    }

    if (tools.hasNull(reqData)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }


    var ep = new EventProxy();


    var newRoomLength = rooms.length;
    var oldRoomLength = 0;

    Apartment.findById(apartmentId, function(err, apartment) {
        if (err) {
            console.log(err);
            res.json(Results.ERR_DB_ERR);
            return;
        } else if (!apartment) {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        } else {
            oldRoomLength = apartment.rooms.length;
            ep.emit('findApartment', apartment);
        }

    });


    ep.after("findApartment", 1, function(apartment) {

        for (var i = 0; i < oldRoomLength; i++) {

            Room.findById(apartment[0].rooms[i], function(err, room) {
                if (err) {
                    console.log(err);
                    res.json(Results.ERR_DB_ERR);
                    return;
                } else if (!room) {
                    res.json(Results.ERR_NOTFOUND_ERR);
                    return;
                } else {
                    ep.emit('findOldRoom', room);
                }
            });
        }

        for (var i = 0; i < newRoomLength; i++) {
            var room = new Room();

            for (var key in rooms[i]) {
                room[key] = rooms[i][key];
            }

            room.save(function(err, room) {
                if (err) {
                    console.log(err);
                    return next();
                } else {
                    ep.emit("insertNewRoom", room);
                }

            });
        }

        ep.after("findOldRoom", oldRoomLength, function(oldRoomList) {
            ep.emit("findOldRoomsDone", oldRoomList);
        });

        ep.after("insertNewRoom", newRoomLength, function(newRoomList) {
            ep.emit("insertNewRoomsDone", newRoomList);
        });

    });



    ep.all("findApartment", "findOldRoomsDone", "insertNewRoomsDone", function(apartment, oldRoomList, newRoomList) {

        for (var i = 0; i < newRoomLength; i++) {
            apartment.rooms.push(newRoomList[i].id);
        }

        apartment.update_at = new Date();
        for (var key in reqData) {
            apartment[key] = reqData[key];
        }

        apartment.save(function(err, apartment) {
            if (err) {
                console.log(err);
                return next();
            } else {
                ep.emit("saveNewRoomToApartment");
            }
        });

        for (var i = 0; i < oldRoomLength; i++) {
            oldRoomList[i].status = -1;
            oldRoomList[i].save(function(err, oldRoom) {
                if (err) {
                    console.log(err);
                    return next();
                } else {
                    ep.emit("setStatus");
                }
            });
        }

        ep.after("setStatus", oldRoomLength, function() {
            ep.emit("oldRoomStatusDone");
        });
    });


    ep.all("oldRoomStatusDone", "saveNewRoomToApartment", function() {

        res.json({
            result: true,
            data: {}
        });

    });

    ep.fail(function(err) {
        res.json({
            result: false,
            err: err
        });
    });


};