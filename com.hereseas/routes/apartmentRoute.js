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




exports.getApartmentList = function (req, res, next) {


    var query = {};
    if (req.query.gender)
        query.gender = req.query.gender;


    Apartment.find(
        query,
        'user_id user_name user_avatar title content rooms favorite available contact location create_at update_at',
        function (err, apartments) {
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


exports.addApartment = function (req, res, next) {

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
        location: req.body.location,
        update_at: req.body.update_at
        
    };
    console.log(data);

    var ep = new EventProxy();
    ep.all('checkSomeThing', function () {
        var apartment = new Apartment();
        //user.username = data.username;
        apartment.user_id = data.user_id;
        apartment.user_name = data.user_name;
        apartment.user_avatar = data.user_avatar;
        apartment.title = data.title;
        apartment.content = data.content;
        apartment.rooms = data.rooms;
        apartment.favorite = data.favorite;
        apartment.available = data.available;
        apartment.contact = data.contact;
        apartment.location = data.location;
        apartment.update_at = data.update_at;

        apartment.save(function (err, apartment) {

            if (err)
                return next();
            else
                res.json({
                    result: true,
                    id: apartment.id
                });
        });
    });

    ep.fail(function (err) {
        res.json({
            result: false,
            err: err
        });
    });




     ep.emit('checkSomeThing');
};
