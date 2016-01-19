var AWS = require('aws-sdk');

exports.sendEmail = function(email, url) {
    var ses = new AWS.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-1'
    });

    var emailHereseas = "no-reply@hereseas.com";

    var emailTO = email;

    var ses_mail = "From: 'Hereseas.com' <" + emailHereseas + ">\n";
    ses_mail = ses_mail + "To: " + emailTO + "\n";
    ses_mail = ses_mail + "Subject: Hereseas Password Reset\n";
    ses_mail = ses_mail + "MIME-Version: 1.0\n";
    ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
    ses_mail = ses_mail + "--NextPart\n";
    ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
    ses_mail = ses_mail + "Please click the link below to reset your password：" + url + '\n\n';
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
            console.log("xxxx");
            throw (err);
            console.log(err)
            return false;
        } else {
            return true;
        }
    });
};


exports.sendCrashEmail = function(email, err) {
    var ses = new AWS.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-1'
    });

    var emailHereseas = "no-reply@hereseas.com";

    var emailTO = email;

    var ses_mail = "From: 'Hereseas.com' <" + emailHereseas + ">\n";
    ses_mail = ses_mail + "To: " + emailTO + "\n";
    ses_mail = ses_mail + "Subject: Hereseas crash report\n";
    ses_mail = ses_mail + "MIME-Version: 1.0\n";
    ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
    ses_mail = ses_mail + "--NextPart\n";
    ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
    ses_mail = ses_mail + "ERR：" + err + '\n\n';
    // ses_mail = url + "\n\n";


    var params = {
        RawMessage: {
            Data: new Buffer(ses_mail)
        },
        Destinations: [emailTO],
        Source: "'Hereseas crash report' <" + emailHereseas + ">'"
    };


    ses.sendRawEmail(params, function(err, data) {
        if (err) {
            console.log("xxxx");
            throw (err);
            console.log(err)
            return false;
        } else {
            return true;
        }
    });
};

exports.sendMilkEmail = function(email) {
    var ses = new AWS.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-1'
    });
    var useremail = email;
    var emailHereseas = "no-reply@hereseas.com";
    var emailList = [];
    emailList.push(useremail);
    var params = {
        Destination: { /* required */
            /*
            BccAddresses: [
              '@'
            ],
            CcAddresses: [
              '@'
            ],*/
            ToAddresses: emailList
        },
        Message: { /* required */
            Body: { /* required */
                Html: {
                    //Data: '<html><head></head><body><div><p>Hello world!</p></div></body></html>'
                    Data: '<html><head></head><title>hereseas.com</title><body><div style="text-align:center"><img src="https://s3.amazonaws.com/hereseas-public-images/email/milktea.jpg"/></div></body></html>'
                }
            },
            Subject: { /* required */
                Data: 'Hereseas Notification'
            }
        },
        Source: "'Hereseas Community' <" + emailHereseas + ">'",
        /* required */
        ReplyToAddresses: [
            'hereseas@gmail.com'
        ]
    };

    //console.log(params);
    ses.sendEmail(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            return false;
        } else {
            return true;
            //console.log(data);           // successful response
        }
    });
}


exports.sendEventEmail = function(email, name) {
    var ses = new AWS.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-1'
    });
    var emailList = [];
    emailList.push(email);
    var emailHereseas = "no-reply@hereseas.com";
    var params = {
        Destination: { /* required */
            /*
            BccAddresses: [
              '@'
            ],
            CcAddresses: [
              '@'
            ],*/
            ToAddresses: emailList
        },
        Message: { /* required */
            Body: { /* required */
                Html: {
                    //Data: '<html><head></head><body><div><p>Hello world!</p></div></body></html>'
                    Data: '<html><head><title>hereseas-event</title><style type="text/css">body {width: 860px;margin:0 auto;padding:0;background: white;}</style></head><body><p><strong>Welcome to Hereseas!</strong></p><p>Hereseas致力于打造北美校园生活线上社区，立足于留学生并服务于留学生。我们希望每一位用户可以在这里找到归属感，丰富留学生活。在这里，您可以寻找租房，匹配室友，还可以淘货，寻车，关注校内外活动，甚至评价教授！现在就开始吧！<br><a href="http://www.hereseas.com">www.hereseas.com</a></p><p><strong>最新活动</strong></p><p><strong>Right Here Night<br>“不一样的社交平台，不寻常的联谊方式，hereseas在2月13号之夜，集结华府各路精英，给你一个不一样的情人节联谊PA。”</strong></p><p><strong>活动详情<br>http://www.hereseas.com/#/event<br>购票链接<br><a href="https://hereseas.eventbrite.com">https://hereseas.eventbrite.com</a></strong></p><p><strong>活动优惠券<br>使用方法：在手机上展示此邮件，获得免费special drink一杯，每位会员只可领取一次</strong></p><p><img src="https://s3.amazonaws.com/hereseas-public-images/email/drink pic.jpg"/></p><p>hereseas.com<br>此处即海外, 他乡即故乡</p><p>关注我们的微信公号</p><p><img src="https://s3.amazonaws.com/hereseas-public-images/email/wechat pic.jpg"/></p><p>&nbsp;</p></body></html>'
                }
            },
            Subject: { /* required */
                Data: 'Hereseas 213 Event'
            }
        },
        Source: "'Hereseas Community' <" + emailHereseas + ">'",
        /* required */
        ReplyToAddresses: [
            'hereseas@gmail.com'
        ]
    };

    //console.log(params);
    ses.sendEmail(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            return false;
        } else {
            return true;
            //console.log(data);           // successful response
        }
    });
}