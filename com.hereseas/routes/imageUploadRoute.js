var flash = require('connect-flash'),
    express = require('express'),
    passport = require('passport'),
    util = require('util'),
    LocalStrategy = require('passport-local').Strategy;


var fs = require('fs');
var uuid = require('node-uuid');
var easyimg = require('easyimage');
var AWS = require('aws-sdk');

exports.image_upload = function(req, res, next) {

    console.log(req.files)
    var category = req.files[0].fieldname;
    var tmp_path = req.files[0].path;
    var fileName = uuid.v4() + '.jpeg';

    easyimg.convert({
        src: tmp_path,
        dst: './convert/' + fileName,
        quality: 100
    }).then(function(file) {

        deleteTempImage(tmp_path);

        if (file.type != 'jpeg' || file.path == undefined) {
            res.json({
                result: false
            });
        }
        var s3 = new AWS.S3();

        var image = require('fs').createReadStream(file.path);

        var params = {
            Bucket: 'hereseas-public-images',
            Key: category + '/' + file.name,
            Body: image,
            ACL: "public-read",
            ContentType: "image/jpeg"
        };

        s3.putObject(params, function(err, data) {

            deleteTempImage(file.path);

            if (err) {
                console.log(err)
                res.json({
                    result: false
                });

            } else {

                res.json({
                    data: category + '/' + file.name,
                    result: true
                });
            }
        });
    });


};


function deleteTempImage(path) {


    fs.unlink(path, function(err) {

        if (err) {
            console.log(err);
            throw err;
        } else {

        }

    });



};