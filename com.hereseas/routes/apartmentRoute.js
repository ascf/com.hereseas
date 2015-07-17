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


var fs = require('fs');



exports.getApartmentList = function(req, res, next) {


    var query = {};
    if (req.query.gender)
        query.gender = req.query.gender;


    Apartment.find(
        query,
        'user_id user_name user_avatar title content rooms favorite available contact location create_at update_at',
        function(err, apartments) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
            } else {
                res.json({
                    result: true,
                    data: apartments
                });
            }
        });
};


exports.addApartment = function(req, res, next) {

    var data = {
        user_id: req.body.user_id,
        user_name: req.body.user_name,
        user_avatar: req.body.user_avatar,
        title: req.body.title,
        content: req.body.content,
        rooms: req.body.rooms,
        favorite: req.body.favorite,
        available: req.body.available,
        contact: req.body.contact,
        location: req.body.location

    };


    data.user_id = '55a5c6e1c748b9cd0e3733ad';
    data.favorite = '55a5c6e1c748b9cd0e3733ad';
    data.rooms = '55a5c6e1c748b9cd0e3733ad';

    if (tools.hasNull(data)) {

        res.json(Results.ERR_PARAM_ERR);
        return;
    }



    var ep = new EventProxy();
    ep.all('checkSomeThing', function() {

        // console.log(data);
        console.log("test1");
        var apartment = new Apartment();


        //user.username = data.username;
        apartment.user_id = data.user_id;
        console.log("test2");

        apartment.user_name = data.user_name;
        apartment.user_avatar = data.user_avatar;
        apartment.title = data.title;


        console.log("test");


        apartment.content = data.content;
        apartment.rooms = data.rooms;
        apartment.favorite = data.favorite;
        apartment.available = data.available;
        apartment.contact = data.contact;
        apartment.location = data.location;


        console.log("test");


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



    ep.emit('checkSomeThing');
};



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