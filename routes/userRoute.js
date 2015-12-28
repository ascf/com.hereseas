var flash = require('connect-flash'),
    express = require('express'),
    passport = require('passport'),
    util = require('util'),
    LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var EventProxy = require('eventproxy');
var tools = require('../common/tools');
var Message = require('../models').Message;
var Results = require('./commonResult');
var Apartment = require('../models').Apartment;
var User = require('../models').User;
var adminRoute = require('./adminRoute');
var fs = require('fs');
var School = require('../models').School;
var Car = require('../models').Car;
var Apartment = require('../models').Apartment;
var Item = require('../models').Item;
var Thread = require('../models').Thread;
var Comment = require('../models').Comment;


var passport = require('passport');

var md5 = require('MD5');
var AWS = require('aws-sdk');

var APIHOST = "http://www.hereseas.com/#";
//var APIHOST = "http://52.25.82.212:8080/#";
var emailService = require('../common/email');


exports.test = function(req, res, next) {
    res.json(Results.ERR_DB_ERR);
};

exports.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.json({
        result: false,
        err: 'ERR_NOT_ALLOWED'
    });

};

exports.login = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.jsonp({
                result: false,
                err: info
            });
            //return res.redirect('/m_login_failure?callback='+req.body.callback);
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }

            var user = {};
            user.id = req.user._id;
            user.username = req.user.username;
            user.gender = req.user.gender;
            user.avatar = req.user.avatar;

            return res.json({
                id: user.id,
                result: true
            });

        });
    })(req, res, next);
};


/**
 * check email & password
 * @param req
 * @param res
 * @param next
 */
exports.createUser = function(req, res, next) {


    var user = new User();
    user.email = req.body.email.toLowerCase();

    var validator = require("email-validator");
    if (!validator.validate(user.email)) {
        return res.json(Results.ERR_DATAFORMAT_ERR);
    }

    if (user.email != "hhz1992@gmail.com")
        if (!eduChecker(user.email)) {
            res.json({
                result: false,
                err: 'ERR_NOT_EDUEMAIL_ERR'
            });
            return;
        }

    user.username = req.body.username;
    user.password = req.body.password;

    var randomstring = require("randomstring");
    user.activecode = randomstring.generate();



    if (tools.isEmpty(user.email) || tools.isEmpty(user.password) || tools.isEmpty(user.username)) {
        return res.json(Results.ERR_PARAM_ERR);
    }

    user.password = md5(user.password);


    var ep = new EventProxy();
    ep.all('checkEmail', function() {

        user.save(function(err, user) {

            if (err) {
                console.log(err);
                return next();
            } else {
                var url = APIHOST + '/verify' + '?uid=' + user.id + '&action=activate&code=' + user.activecode;
                sendEmail(user.email, url);

                res.json({
                    result: true,
                    id: user.id
                });

                user.chats.addToSet(user.id);
                user.save(function(err, user) {})

            }
        });
    });

    ep.fail(function(err) {
        res.json({
            result: false,
            err: err
        });
    });

    User.findOne({
        email: user.email
    }, function(err, item) {
        if (item != null) {
            ep.emit("error", 'ERR_EXISTED_EMAIL ');
        } else {
            ep.emit('checkEmail');
        }
    });
};

exports.getUserList = function(req, res, next) {

    var query = {};
    if (req.query.gender)
        query.gender = req.query.gender;

    User.find(
        query,
        'username email schoolId avatar description tags last_login',
        function(err, users) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
            } else {
                res.json({
                    result: true,
                    data: users
                });
            }
        });
};

exports.getUser = function(req, res, next) {
    var userId = req.param('id');
    if (userId) {
        User.findById(userId,
            function(err, user) {
                if (err) {
                    res.json(Results.ERR_DB_ERR);
                    return;
                } else if (user == null) {
                    res.json(Results.ERR_NOTFOUND_ERR);
                    return;
                } else {
                    res.json({
                        result: true,
                        data: {
                            id: user.id,
                            //email: user.email,
                            username: user.username,
                            schoolId: user.schoolId,
                            avatar: user.avatar,
                            description: user.description,
                            tags: user.tags,
                            favorite: user.favorite
                        }
                    });
                    return;
                }
            });
    } else {
        res.json(Results.ERR_REQUIRELOGIN_ERR);
        return;
    }
};


exports.getSelfInfo = function(req, res, next) {
    var userId = req.user.id;
    if (userId) {
        User.findById(userId,
            function(err, user) {
                if (err) {
                    res.json(Results.ERR_DB_ERR);
                    return;
                } else {
                    res.json({
                        result: true,
                        data: {
                            id: user.id,
                            email: user.email,
                            username: user.username,
                            schoolId: user.schoolId,
                            avatar: user.avatar,
                            description: user.description,
                            enrollYear: user.enrollYear,
                            enrollSeason: user.enrollSeason,
                            tags: user.tags,
                            verified: user.verified,
                            lastLocation: user.lastLocation,
                            address: user.address
                        }
                    });
                    return;
                }
            });
    } else {
        res.json(Results.ERR_REQUIRELOGIN_ERR);
        return;
    }
};


exports.getFavoriteList = function(req, res, next) {
    var userId = req.user.id;
    if (userId) {
        User.findById(userId,
            function(err, user) {
                if (err) {
                    res.json(Results.ERR_DB_ERR);
                    return;
                } else {
                    res.json({
                        result: true,
                        data: user.favorite
                    });
                    return;
                }
            });
    } else {
        res.json(Results.ERR_REQUIRELOGIN_ERR);
        return;
    }
};


exports.getFavorite = function(req, res, next) {

    var userId = req.user.id;
    var ep = new EventProxy();

    if (!userId) {
        res.json(Results.ERR_REQUIRELOGIN_ERR);
        return;
    }

    User.findById(userId, function(err, user) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
            return;
        } else {

            var apartmentCount = user.favorite.apartments.length;
            var carCount = user.favorite.cars.length;
            var itemCount = user.favorite.items.length;

            ep.all("ApartmentDone", "CarDone", "ItemDone", function(apartmentList, carList, itemList) {
                res.json({
                    result: true,
                    data: {
                        "apartments": apartmentList,
                        "cars": carList,
                        "items": itemList
                    }
                });
                return;

            });

            ep.after("findApartments", apartmentCount, function(apartments) {

                var apartmentList = [];
                for (var i = 0; i < apartments.length; i++) {

                    if (apartments[i] != null && apartments[i].status != null && apartments[i].status == 1) {
                        apartmentList.push(apartments[i]);
                    }
                }
                ep.emit("ApartmentDone", apartmentList);
            });

            for (var i = 0; i < apartmentCount; i++) {

                Apartment.findById(user.favorite.apartments[i], '_id userId username userAvatar rooms schoolId title cover longitude latitude createAt available status', function(err, apartment) {
                    if (err) {
                        res.json(Results.ERR_DB_ERR);
                        return;
                    } else {

                        var price = {
                            maxPrice: calculatePrice(apartment.rooms).maxPrice,
                            minPrice: calculatePrice(apartment.rooms).minPrice
                        }
                        var type = getType(apartment.rooms);

                        var apartmentOne = {
                            "id": apartment.id,
                            "schoolId": apartment.schoolId,
                            "username": apartment.username,
                            "userAvatar": apartment.userAvatar,
                            "latitude": apartment.latitude,
                            "longitude": apartment.longitude,
                            "cover": apartment.cover,
                            "price": price,
                            "type": type,
                            "status": apartment.status
                        };

                        ep.emit("findApartments", apartmentOne);
                    }
                });
            }

            ep.after("findCars", carCount, function(cars) {

                var carList = [];
                for (var i = 0; i < cars.length; i++) {

                    if (cars[i] != null && cars[i].status != null && cars[i].status == 1) {
                        carList.push(cars[i]);
                    }
                }
                ep.emit("CarDone", carList);
            });

            for (var i = 0; i < carCount; i++) {

                Car.findById(user.favorite.cars[i], '_id userId username userAvatar schoolId title cover price category longitude latitude createAt available status', function(err, car) {
                    if (err) {
                        res.json(Results.ERR_DB_ERR);
                        return;
                    } else {

                        ep.emit("findCars", car);
                    }
                });
            }


            ep.after("findItems", itemCount, function(items) {

                var itemList = [];
                for (var i = 0; i < items.length; i++) {

                    if (items[i] != null && items[i].status != null && items[i].status == 1) {
                        itemList.push(items[i]);
                    }
                }
                ep.emit("ItemDone", itemList);
            });

            for (var i = 0; i < itemCount; i++) {

                Item.findById(user.favorite.items[i], '_id userId username userAvatar schoolId itemName cover price category longitude latitude createAt available status', function(err, item) {
                    if (err) {
                        res.json(Results.ERR_DB_ERR);
                        return;
                    } else {

                        ep.emit("findItems", item);
                    }
                });
            }



        }
    });
};


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



exports.addFavorite = function(req, res, next) {
    var userId = req.user.id;
    var reqData = {};

    reqData = {
        id: req.body.id,
        category: req.body.category
    }

    if (tools.hasNull(reqData)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    if (reqData.category != "apartments" && reqData.category != "cars" && reqData.category != "items" && reqData.category != "activities") {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    if (userId) {
        User.findById(userId,
            function(err, user) {
                if (err) {
                    res.json(Results.ERR_DB_ERR);
                    return;
                } else {
                    user.favorite[reqData.category].addToSet(reqData.id);
                    user.save(function(err, user) {

                        if (err) {
                            console.log(err);
                            return next();
                        } else {
                            res.json({
                                result: true,
                                data: user.favorite
                            });

                        }
                    });


                }
            });
    } else {
        res.json(Results.ERR_REQUIRELOGIN_ERR);
        return;
    }
};



exports.deleteFavorite = function(req, res, next) {
    var userId = req.user.id;
    var reqData = {};

    reqData = {
        id: req.body.id,
        category: req.body.category
    }

    if (tools.hasNull(reqData)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    if (reqData.category != "apartments" && reqData.category != "cars" && reqData.category != "items" && reqData.category != "activities") {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    if (userId) {
        User.findById(userId,
            function(err, user) {
                if (err) {
                    res.json(Results.ERR_DB_ERR);
                    return;
                } else {

                    var index = user.favorite[reqData.category].indexOf(reqData.id);

                    if (index > -1) {
                        user.favorite[reqData.category].splice(index, 1);
                    } else {
                        res.json({
                            result: false,
                            err: Results.ERR_NOTFOUND_ERR
                        });
                        return;
                    }

                    user.save(function(err, user) {

                        if (err) {
                            console.log(err);
                            return next();
                        } else {
                            res.json({
                                result: true,
                                data: user.favorite
                            });
                            return;

                        }
                    });

                }
            });
    } else {
        res.json(Results.ERR_REQUIRELOGIN_ERR);
        return;
    }
};



exports.editUser = function(req, res, next) {

    var epUser = new EventProxy();


    if (!req.query.step) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    if (req.query.step == 1) {
        reqData = {
            username: req.body.username,
            schoolId: req.body.schoolId,
            enrollYear: req.body.enrollYear,
            enrollSeason: req.body.enrollSeason
        }

        if (reqData.schoolId == "") {
            delete reqData.schoolId;
        }

        if (tools.isEmpty(reqData.username)) {
            res.json(Results.ERR_PARAM_ERR);
            return;
        }

    } else if (req.query.step == 2) {
        reqData = {
            address: req.body.address
        }
    } else if (req.query.step == 3) {
        reqData = {
            avatar: req.body.avatar
        }
    } else {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }


    // if (tools.hasNull(reqData)) {

    //     res.json(Results.ERR_PARAM_ERR);
    //     return;
    // }


    User.findById(req.user.id,
        function(err, user) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                return;
            } else if (user == null) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                epUser.emit("findUser", user);
            }
        });

    epUser.all("findUser", function(user) {

        previousSchoolId = user.schoolId;

        for (var key in reqData) {
            user[key] = reqData[key];
        }

        user.save(function(err, user) {

            if (err) {
                console.log(err);
                return next();
            } else {
                if (req.query.step == 1 || req.query.step == 3) {
                    updateUserApartments(user.id);
                    updateUserCars(user.id);
                    updateUserItems(user.id);
                    updateUserThreads(user.id);
                    updateUserComments(user.id);
                }

                if (req.query.step == 1)
                    updateSchoolUser(user.id, previousSchoolId, reqData.schoolId);

                res.json({
                    result: true,
                    data: {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        schoolId: user.schoolId,
                        avatar: user.avatar,
                        description: user.description,
                        tags: user.tags,
                        favorite: user.favorite,
                        enrollYear: user.enrollYear,
                        enrollSeason: user.enrollSeason,
                        address: user.address
                    }
                });


            }
        });
    });


};

function updateSchoolUser(userId, previousSchoolId, schoolId) {

    if (previousSchoolId != schoolId) {

        School.findById(schoolId, function(err, school) {
            if (err) {
                console.log(err);
                return;
            } else if (school == null) {
                console.log("school is null");
                return;
            } else {
                school.users.addToSet(userId);
                school.userCount = school.userCount + 1;
                school.save(function() {});
            }
        });


        if (previousSchoolId != null) {

            School.findById(previousSchoolId, function(err, school) {
                if (err) {
                    console.log(err);
                    return;
                } else if (school == null) {
                    console.log("school is null");
                    return;
                } else {
                    var index = school.users.indexOf(userId);

                    if (index > -1) {
                        console.log(index);
                        school.users.splice(index, 1);
                        school.userCount = school.userCount - 1;
                        school.save(function() {});
                    }
                }

            });

        }
    }
}


//update user avatar and username 
function updateUserApartments(userId) {
    var epUser = new EventProxy();

    epUser.all("findUser", function(user) {
        for (var i = 0; i < user.apartments.length; i++) {
            Apartment.findById(user.apartments[i], function(err, apartment) {
                if (err) {
                    console.log(err);
                    return false;
                } else {
                    apartment.username = user.username;
                    apartment.userAvatar = user.avatar;
                    apartment.save(function() {});
                }
            });
        }
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


function updateUserCars(userId) {
    var epUser = new EventProxy();

    epUser.all("findUser", function(user) {
        for (var i = 0; i < user.cars.length; i++) {
            Car.findById(user.cars[i], function(err, car) {
                if (err) {
                    console.log(err);
                    return false;
                } else {
                    car.username = user.username;
                    car.userAvatar = user.avatar;
                    car.save(function() {});
                }
            });
        }
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

function updateUserItems(userId) {
    var epUser = new EventProxy();

    epUser.all("findUser", function(user) {
        for (var i = 0; i < user.items.length; i++) {
            Item.findById(user.items[i], function(err, item) {
                if (err) {
                    console.log(err);
                    return false;
                } else {
                    item.username = user.username;
                    item.userAvatar = user.avatar;
                    item.save(function() {});
                }
            });
        }
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

function updateUserThreads(userId) {
    var epUser = new EventProxy();

    epUser.all("findUser", function(user) {
        for (var i = 0; i < user.threads.length; i++) {
            Thread.findById(user.threads[i], function(err, thread) {
                if (err) {
                    console.log(err);
                    return false;
                } else {
                    thread.username = user.username;
                    thread.userAvatar = user.avatar;
                    thread.save(function() {});
                }
            });
        }
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

function updateUserComments(userId) {
    var epUser = new EventProxy();

    epUser.all("findUser", function(user) {
        for (var i = 0; i < user.comments.length; i++) {
            Comment.findById(user.comments[i], function(err, comment) {
                if (err) {
                    console.log(err);
                    return false;
                } else {
                    comment.username = user.username;
                    comment.userAvatar = user.avatar;
                    comment.save(function() {});
                }
            });
        }
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



exports.activeUserSendEmail = function(req, res, next) {

    eduEmail = req.body.eduEmail.toLowerCase();

    console.log(eduEmail)

    if (!eduChecker(eduEmail)) {
        res.json({
            result: false,
            err: 'ERR_NOT_EDUEMAIL_ERR'
        });
        return;
    }

    User.findOne({
        email: eduEmail
    }, function(err, user) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
            return;
        } else if (user == null) {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        } else if (user.verified) {
            res.json(Results.ERR_ALREADYVERIFIED_ERR);
            return;
        } else {
            var url = APIHOST + '/verify' + '?uid=' + user.id + '&action=activate&code=' + user.activecode;
            sendEmail(eduEmail, url);

            res.json({
                result: true,
            });
        }
    });



};


exports.activeUserVerifyLink = function(req, res, next) {

    var reqData = {
        uid: req.body.uid,
        code: req.body.code
    };

    if (tools.hasNull(reqData)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    User.findById(reqData.uid, function(err, user) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
            return;
        } else if (user == null) {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;

        } else if (user.verified == true) {
            res.json(Results.ERR_ALREADYVERIFIED_ERR);
            return;
        } else if (user.activecode != reqData.code) {
            res.json(Results.ERR_ACTIVATED_ERR);
            return;
        } else {
            user.activecode = "";
            user.verified = true;
            user.save(function(err, user) {

                if (err) {
                    console.log(err);
                    return next();
                } else
                    res.json({
                        result: true,
                        id: user.id,
                        email: user.email
                    });
            });
        }

    });

};



function sendEmail(email, url) {

    var ses = new AWS.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-1'
    });

    var emailHereseas = "no-reply@hereseas.com";

    var emailTO = email;

    var ses_mail = "From: 'Hereseas.com' <" + emailHereseas + ">\n";
    ses_mail = ses_mail + "To: " + emailTO + "\n";
    ses_mail = ses_mail + "Subject: Hereseas account activation\n";
    ses_mail = ses_mail + "MIME-Version: 1.0\n";
    ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
    ses_mail = ses_mail + "--NextPart\n";
    ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
    ses_mail = ses_mail + "Thank you for joining Hereseas community ! Please click the link below to verify your email address: " + url + '\n\n';
    // ses_mail = url + "\n\n";


    var params = {
        RawMessage: {
            Data: new Buffer(ses_mail)
        },
        Destinations: [emailTO],
        Source: "'Hereseas account activation' <" + emailHereseas + ">'"
    };


    ses.sendRawEmail(params, function(err, data) {
        if (err) {
            throw (err);
            console.log(err)
            return false;
        } else {
            console.log(email + " true");
            return true;
        }
    });


}


exports.sendMessage = function(req, res, next) {
    var sender = req.user.id;
    var receiver = req.body.id;

    if (tools.isEmpty(sender) || tools.isEmpty(receiver)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }
    /*
    if (sender == receiver) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }
    */
    var ep = new EventProxy();
    var message = new Message();
    User.findById(sender, function(err, user) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
            return;
        } else if (user == null) {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        } else {
            if (user.chats == undefined) {
                res.json(Results.ERR_PARAM_ERR);
                return;
            }
            user.chats.addToSet(receiver);

            var indexR = user.chats.indexOf(receiver);
            //console.log(index);
            //console.log(user.chats);
            user.chats.splice(indexR, 1);
            //console.log(user.chats);
            user.chats.push(receiver);
            //console.log(user.chats);

            message.senderUsername = user.username;
            message.senderSchool = user.schoolId;
            user.save(function(err, userS) {
                if (err) {
                    console.log("sender");
                    console.log(err);
                    return next();
                } else {
                    ep.emit("findSender", userS);
                }
            });
        }
    });

    ep.after("findSender", 1, function(userS) {

        User.findById(receiver, function(err, user) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                return;
            } else if (user == null) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                user.chats.addToSet(sender);

                var indexS = user.chats.indexOf(sender);

                user.chats.splice(indexS, 1);

                user.chats.push(sender);

                message.receiverUsername = user.username;
                message.receiverSchool = user.schoolId;
                user.save(function(err, userR) {
                    if (err) {
                        console.log("receiver");
                        console.log(err);
                        return next();
                    } else {
                        ep.emit("findReceiver", userR);
                    }
                });
            }
        });
    });

    ep.all("findSender", "findReceiver", function(userS, userR) {
        message.sender = sender;
        message.receiver = receiver;
        message.read = false;
        message.content = req.body.content;
        message.save(function(err, message) {
            if (err) {
                console.log(message);
                console.log(err);
                return next();
            } else {
                res.json({
                    result: true,
                    id: message.id
                });
                return;
            }
        });
    });

}


exports.getUserContact = function(req, res, next) {
    var userId = req.user.id;
    var contacts = [];
    User.findById(userId, function(err, user) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
            return;
        } else {
            if (user == null) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            }

            for (var i = 0; i < user.chats.length; i++) {
                contacts.push(user.chats[i]);
            }
            res.json({
                result: true,
                contacts: contacts
            });
            return;
        }
    });
}

exports.getUserMessage = function(req, res, next) {
    var contact = req.query.userid;
    var user = req.user.id;
    var userMessages = [];
    var query = {};
    var ep = new EventProxy();
    query.sender = user;
    query.receiver = contact;

    if (tools.hasNull(query)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    ep.all('Finish', function() {
        //sort userMessages by createAt in ascending order
        userMessages.sort(function(a, b) {
            return a.createAt.valueOf() - b.createAt.valueOf();
        });
        res.json({
            result: true,
            data: userMessages
        });
        return;
    });

    ep.all('findMessage', function() {
        query.sender = contact;
        query.receiver = user;
        Message.find(query, function(err, messages) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                return;
            } else {
                for (var i = 0; i < messages.length; i++) {
                    userMessages.push(messages[i]);
                }
                ep.emit('Finish');
            }
        });
    });

    Message.find(query, function(err, messages) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
            return;
        } else {
            for (var i = 0; i < messages.length; i++) {
                userMessages.push(messages[i]);
            }
            ep.emit('findMessage')
        }
    });

}


exports.readMessage = function(req, res, next) {

    if (tools.isEmpty(req.body.id)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    Message.findById(req.body.id, function(err, message) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
            return;
        } else if (message == null) {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        } else {

            message.read = true;
            message.save(function(err, message) {
                if (err) {
                    console.log(err);
                    return next();
                } else {
                    res.json({
                        result: true,
                        id: message.id
                    });
                    return;
                }
            });
        }
    });
}

exports.getUserUnreadMessage = function(req, res, next) {
    var userId = req.user.id;
    var userUnreadMessages = [];
    var query = {};
    var ep = new EventProxy();
    query.receiver = userId;
    query.read = false;

    if (tools.hasNull(query)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    ep.all('findMessage', function() {
        //sort userMessages by createAt in ascending order
        userUnreadMessages.sort(function(a, b) {
            return a.createAt.valueOf() - b.createAt.valueOf();
        });
        res.json({
            result: true,
            data: userUnreadMessages
        });
        return;
    });

    Message.find(query, function(err, messages) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
            return;
        } else {
            for (var i = 0; i < messages.length; i++) {
                userUnreadMessages.push(messages[i]);
            }
            ep.emit('findMessage');
        }
    });

}


exports.getUserAllPost = function(req, res, next) {
    var userId = req.param('id');

    if (!userId) {
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

        res.json({
            result: true,
            data: resData
        });
        return;


    });


    ep.all('findCars', function() {
        Item.find(query, 'id title cover createAt updateAt')
            .sort({
                updateAt: 'desc'
            }).exec(function(err, items) {
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
            }).exec(function(err, cars) {
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
        }).exec(function(err, apartments) {
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

exports.sendMilkEmail = function(req, res, next) {
    var userEmail = req.body.email;
    User.findOne({email: req.body.email}, function(err, user) {
        if (user != null) {
            emailService.sendMilkEmail(userEmail);
            res.json({
                result: true
            });
        } else {
            res.json({
                result: false,
                err: 'ERR_NOTFOUND_ERR'
            });
        }
    });
}


//admin functions

exports.adminActiveUser = function(req, res, next) {


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

        var userId = req.param('id');

        if (userId) {
            User.findById(userId,
                function(err, user) {
                    if (err) {
                        res.json(Results.ERR_DB_ERR);
                    } else {
                        user.verified = true;
                        user['status'] = 1;
                        user.save(function(err, user) {

                            if (err) {
                                console.log(err);
                                return next();
                            } else {

                                res.json({
                                    result: true,
                                    data: user
                                });


                            }
                        });



                    }
                });
        } else {
            res.json(Results.ERR_REQUIRELOGIN_ERR);
        }

    });

};


exports.adminGetUserId = function(req, res, next) {
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
        User.find(query, 'id', function(err, userIds) {
            if (err) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                res.json({
                    result: true,
                    data: userIds
                });
                return;
            }
        });
    });
};

exports.adminGetUserAllInfo = function(req, res, next) {
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
        var userId = req.param('id');
        if (userId) {
            User.findById(userId,
                function(err, user) {
                    if (err) {
                        res.json(Results.ERR_DB_ERR);
                    } else {
                        res.json({
                            result: true,
                            data: user
                        });
                    }
                });
        } else {
            res.json(Results.ERR_REQUIRELOGIN_ERR);
        }
    });
};


exports.adminGetUsers = function(req, res, next) {
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
        User.find(query, function(err, users){
            if (err) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                res.json({
                    result: true,
                    data: users
                });
                return;
            }
        });
    });
};



exports.adminEditUserStatus = function(req, res, next) {
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
        var userId = req.param('id');
        var reqData = {
            status: req.body.status
        };
        if (tools.isEmpty(userId)) {
            res.json(Results.ERR_PARAM_ERR);
            return;
        }
        if (tools.hasNull(reqData)) {
            res.json(Results.ERR_PARAM_ERR);
            return;
        }
        var query = {
            id: userId
        };
        User.findById(userId, function(err, user) {
            if (err) {
                console.log(err);
                return next();
            } else if (!user) {
                res.json(Results.ERR_NOTFOUND_ERR);
            } else {
                for (var key in reqData) {
                    user[key] = reqData[key];
                }
                user.save(function(err, userSave) {
                    if (err) {
                        console.log(err);
                        return next();
                    } else {
                        console.log(userSave)
                        res.json({
                            result: true,
                            data: {
                                'id': userSave.id,
                                'username': userSave.username,
                                'email': userSave.email,
                                'status': userSave.status
                            }
                        });
                    }
                });

            }

        });
    });
}

function eduChecker(email) {

    var str = email.substring(email.indexOf('@') + 1);

    console.log(str);

    //return str.indexOf(".edu") > -1

    return true;

}