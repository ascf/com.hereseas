var EventProxy = require('eventproxy');
var User = require('../models').User;
var Results = require('./commonResult');
var tools = require('../common/tools');
var Item = require('../models').Item;
var School = require('../models').School;

exports.createItem = function(req, res, next) {
	var epUser = new EventProxy();

	epUser.all("findUser", function(user) {
		//execute after "findUser" is emited
		console.log(user);
		var reqData = {
			userId: user.id,
			username: user.username,
			userAvatar: user.avatar,
			schoolId: req.body.schoolId,
		};
		console.log(reqData);

		if (tools.hasNull(reqData)) {
			res.json(Results.ERR_PARAM_ERR);
			return;
		}
		var item = new Item();
		for (var key in reqData) {
			item[key] = reqData[key];
		}
		item['status'] = 2;
		item.save(function(err, item) {
			if (err) {
				console.log(err);
				return next();
			} else {
				res.json({
					result: true,
					data: item
				});
			}
		});
	});

	User.findById(req.user.id, function(err, user) {
		if (err) {
			res.json(Results.ERR_DB_ERR);
			return;
		} else {
			if (user.status != 1) {
				res.json(Results.ERR_PERMISSION_ERR);
				return;
			}
			epUser.emit("findUser", user);
		}
	});
}