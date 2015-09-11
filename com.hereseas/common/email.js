/*
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'barondance@gmail.com',
		pass: 'userpass'
	}
});
var mailOptions = {
	from: '',
	to: '',
	subject: 'hello',
	text: 'helloworld',
	html: '<b>helloworld</b>'
};
transporter.sendMail(mailOptions, function(error, info){
	if (error) {
		console.log(error);
	} else {
		console.log('Message sent' + info.response);
	}
});
*/