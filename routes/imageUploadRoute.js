var flash = require('connect-flash'),
    express = require('express'),
    passport = require('passport'),
    util = require('util'),
    LocalStrategy = require('passport-local').Strategy;

var tools = require('../common/tools');
var fs = require('fs');
var uuid = require('node-uuid');
var easyimg = require('easyimage');
var AWS = require('aws-sdk');
var EventProxy = require('eventproxy');
var Results = require('./commonResult');
var User = require('../models').User;

var photoType = ["bmp", "jpg", "jpeg", "png", "psd"];
var photoTypeForum = ["bmp", "jpg", "jpeg", "png", "psd", "gif"];


exports.image_upload = function(req, res, next) {

    var category = req.files[0].fieldname;
    var tmp_path = req.files[0].path;
    var fileNameJpeg = uuid.v4() + '.jpeg';

    if (tools.isEmpty(category) || tools.isEmpty(tmp_path)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var epUser = new EventProxy();

    User.findById(req.user.id,
        function(err, user) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                deleteTempImage(tmp_path);
                return;
            } else {

                if (user.status != 1) {
                    res.json(Results.ERR_PERMISSION_ERR);
                    deleteTempImage(tmp_path);
                    return;
                }

                epUser.emit("findUser", user);
            }
        });


    epUser.all("findUser", function(user) {
        easyimg.info(tmp_path).then(

            // function(err) {
            //     console.log(err);

            //     res.json({
            //         result: false,
            //         err: err
            //     });

            // },
            function(file) {

                console.log(tmp_path);
                if (category == "forum" && photoTypeForum.indexOf(file.type.toLowerCase()) <= -1) {
                    deleteTempImage(tmp_path);
                    res.json({
                        result: false,
                        err: "ERR_TYPE_ERR"
                    });
                    return;
                } else if (category != "forum" && photoType.indexOf(file.type.toLowerCase()) <= -1) {
                    deleteTempImage(tmp_path);
                    res.json({
                        result: false,
                        err: "ERR_TYPE_ERR"
                    });
                    return;
                } else {

                    if (category != "forum") {

                        convertImageToJpeg(tmp_path, fileNameJpeg, function(file) {

                            deleteTempImage(tmp_path);

                            if (file.type != 'jpeg' || file.path == undefined) {
                                res.json({
                                    result: false
                                });
                                return;
                            }



                            uploadImageToS3(file, file.name, category, function(err, data) {

                                deleteTempImage(file.path);

                                if (err) {
                                    console.log(err)
                                    res.json({
                                        result: false
                                    });
                                    return;
                                } else {
                                    res.json({
                                        data: category + '/' + file.name,
                                        result: true
                                    });
                                    return;
                                }
                            });
                        });
                    } else {

                        var fileName = uuid.v4() + "." + file.type.toLowerCase();

                        uploadImageToS3(file, fileName, category, function(err, data) {

                            deleteTempImage(file.path);

                            if (err) {
                                console.log(err)
                                res.json({
                                    result: false
                                });
                                return;
                            } else {
                                res.json({
                                    data: category + '/' + fileName,
                                    result: true
                                });
                                return;
                            }
                        });
                    }

                }
            }
        );
    });

};



function uploadImageToS3(file, fileName, category, callback) {

    var s3 = new AWS.S3();
    var image = require('fs').createReadStream(file.path);

    var contentType = "image/jpeg";
    if (category == "forum") {
        contentType = "image/" + file.type.toLowerCase();
    }

    var params = {
        Bucket: 'hereseas-public-images',
        Key: category + '/' + fileName,
        Body: image,
        ACL: "public-read",
        ContentType: contentType
    };

    console.log(params);
    s3.putObject(params, callback);

}

function convertImageToJpeg(tmp_path, fileName, callback) {
    easyimg.convert({
        src: tmp_path,
        dst: './convert/' + fileName,
        quality: 100
    }).then(callback);

}



function deleteTempImage(path) {

    fs.unlink(path, function(err) {
        if (err) {
            console.log(err);
            throw err;
        } else {

        }

    });
};