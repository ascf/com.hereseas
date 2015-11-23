var AWS = require('aws-sdk');

exports.sendEmail = function(email, url){
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


exports.sendCrashEmail = function(email, err){
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
