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



exports.getApartmentList = function(req, res, next) {


    var query = {};
    if (req.query.gender)
        query.gender = req.query.gender;

    Apartment.find(
            query,
            'id user_id user_name user_avatar title content cover images type rooms description location create_at update_at')
        .sort({
            create_at: 'desc'
        }).
    limit(3).populate('rooms', null, {
        'is_active': true
    }).
    exec(function(err, apartments) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                result: true,
                data: apartments
            });
        }
    })
};


//     Apartment.find(
//         query,
//         'id user_id user_name user_avatar title cover location create_at update_at',
//         function(err, apartments) {
//             if (err) {
//                 res.json(Results.ERR_DB_ERR);
//             } else {
//                 res.json({
//                     result: true,
//                     data: apartments
//                 });
//             }
//         });
// };


exports.addApartment = function(req, res, next) {

    var data = {
        user_id: req.body.user_id,
        user_name: req.body.user_name,
        user_avatar: req.body.user_avatar,
        title: req.body.title,
        content: req.body.content,
        cover: req.body.cover,
        location: req.body.location,
        rooms: req.body.rooms
    };


    data.user_id = '55a5c6e1c748b9cd0e3733ad';
    data.favorite = '55a5c6e1c748b9cd0e3733ad';
    //data.rooms = '55a5c6e1c748b9cd0e3733ad';

    if (tools.hasNull(data)) {

        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    // console.log(data);
    var apartment = new Apartment();

    apartment.user_id = data.user_id;
    apartment.user_name = data.user_name;
    apartment.user_avatar = data.user_avatar;
    apartment.title = data.title;
    apartment.content = data.content;
    apartment.cover = data.cover;
    apartment.location = data.location;


    apartment.save(function(err, apartment) {

        if (err) {
            console.log(err);
            return next();
        } else {

            var ep = new EventProxy();
            for (var i = 0; i < data.rooms.length; i++) {

                var room = new Room();
                room.apartment_id = apartment.id;
                room.type = data.rooms[i].type;
                room.bathroom = data.rooms[i].bathroom;

                room.save(function(err, room) {

                    if (err) {
                        console.log(err);
                        return next();
                    } else {
                        ep.emit("insertRoom",room)
                    }

                });

            }

            ep.after("insertRoom", data.rooms.length, function(roomList) {



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

    console.log("update apartment!");

    var apartmentId = req.body.id;

    var data = {
        title: req.body.title,
        rooms: req.body.rooms,
        favorite: req.body.favorite,
        available: req.body.available,
        contact: req.body.contact,
        location: req.body.location
    };


    if (tools.hasNull(data)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    console.log("update test!");

    var ep = new EventProxy();
    var apartment = new Apartment();


    console.log(data.id);

    Apartment.findById(apartmentId, function(err, apartment) {
        if (err) {
            console.log(err);
            res.json(Results.ERR_DB_ERR);
            return;
        } else {
            // for (var key in data) {
            //     apartment[key] = data[key];

            //     console.log(key + " " + data[key]);

            console.log("t!!");
            console.log(apartment);

            apartment.update_at = new Date();

            // data.id = '55a80b81bda8264e1178d9ab';
            // data.user_id = '55a5c6e1c748b9cd0e3733ad';
            // data.favorite = '55a5c6e1c748b9cd0e3733ad';
            // data.rooms = '55a5c6e1c748b9cd0e3733ad';

            ep.emit('findApartment');
        }

    });


    ep.all('findApartment', function() {

        apartment.save(function(err, apartment) {

            if (err) {
                console.log(err);
                return next();
            } else
                res.json({
                    result: true,
                    id: apartment.id
                });
        });
    });



    ep.fail(function(err) {
        res.json({
            result: false,
            err: err
        });
    });



};