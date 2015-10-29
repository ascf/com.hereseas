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
		var reqData = {
			userId: user.id,
			username: user.username,
			userAvatar: user.avatar,
			schoolId: req.body.schoolId,
		};
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
};

exports.editItemById = function(req, res, next) {
	var itemId = req.param('id');
	var userId = req.user.id;
	var reqData = {};
	if (!req.query.step) {
		res.json(Results.ERR_PARAM_ERR);
		return;
	}
	if (req.query.step == 1) {
		reqData = {
			expireAt: req.body.expireAt,
			itemName: req.body.itemName,
			category: req.body.category,
			price: req.body.price,
			description: req.body.description,
			cover: req.body.cover,
			images: req.body.images
		}
	} else if (req.query.step == 2) {
		reqData = {
			address: req.body.address,
            longitude: req.body.longitude,
            latitude: req.body.latitude
		}
	} else {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }
	if (tools.hasNull(reqData)) {
		res.json(Results.ERR_PARAM_ERR);
		return;
	}
	Item.findById(itemId, function(err, item) {
		if (err) {
			res.json(Results.ERR_DB_ERR);
			return;
		} else if (!item) {
			res.json(Results.ERR_NOTFOUND_ERR);
			return;
		} else {
			if (item.userId != userId) {
				res.json(Results.ERR_PERMISSION_ERR);
                return;
			}
			for (var key in reqData) {
				item[key] = reqData[key];
			}
			item.updateAt = new Date();
			item.save(function(err, item) {
				if (err) {
					return next();
				} else {
					res.json({
						result: true,
						data: {}
					});
				}
			});
		}
	});
};

exports.getItemById = function(req, res, next) {
    var itemId = req.param('id');

    var query = {
        '_id': itemId,
        'status': 1,
        'available': true
    };

    Item.find(query,
            'userId username userAvatar schoolId expireAt itemName category price description cover images address longitude latitude createAt updateAt')
        .sort({
            createAt: 'desc'
        }).exec(function(err, items) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                return;
            } else if (!items.length) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                res.json({
                    result: true,
                    data: items
                });
                return;
            }
        })
};

exports.getThreeItems = function(req, res, next) {

    schoolId = req.query.schoolId

    if (!schoolId) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var connection;
    var ep = new EventProxy();

    ep.all('findSchoolConnection', function() {

        var subQuery = {};
        subQuery['$in'] = connection;

        var query = {
            'status': 1,
            'available': true,
            'schoolId': subQuery
        };

        Item.find(query, 'id userId username userAvatar schoolId cover').sort({
                createAt: 'desc'
            }).limit(3).exec(function(err, items) {
	            if (err) {
	                res.json(Results.ERR_DB_ERR);
	                return;
	            } else if (!items.length) {
	                res.json(Results.ERR_NOTFOUND_ERR);
	                return;
	            } else {
	                res.json({
	                    result: true,
	                    data: items
	                });
	                return;
	            }
        });
    });

    School.findById(schoolId, function(err, school) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
            return;
        } else if (school) {
            if (school.status == 1) {
                connection = school.connection;
                ep.emit('findSchoolConnection');
            } else {
                res.json(Results.ERR_ACTIVATED_ERR);
                return;
            }
        } else {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        }

    });

};

exports.getItemList = function(req, res, next) {

    var userId = req.user.id;

    if (!userId) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var query = {
        'status': 1,
        'userId': userId,
        'available': true
    };

    Item.find(query, 'id schoolId itemName cover expireAt longitude latitude createAt updateAt')
        .sort({
            createAt: 'desc'
        }).exec(function(err, items) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                return;
            } else if (!items.length) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                res.json({
                    result: true,
                    data: items
                });
                return;
            }
        })
};

exports.postItemById = function(req, res, next) {
	var itemId = req.param('id');
	var reqData = {};
	var userId = req.user.id;
	var epUser = new EventProxy();
	epUser.all("findUser", function(user) {
		Item.findById(itemId, function(err, item) {
			if (err) {
				//console.log(err);
				res.json(Results.ERR_DB_ERR);
				return;
			} else if (!item) {
				res.json(Results.ERR_NOTFOUND_ERR);
				return;
			} else {
				if (item.userId != userId || item.status != 2){
					res.json(Results.ERR_PERMISSION_ERR);
					return;
				}
				var reqData = {
					userId: item.userId,
                    username: item.username,
                    userAvatar: item.userAvatar,
                    schoolId: item.schoolId,
                   	expireAt: item.expireAt,
                   	itemName: item.itemName,
                   	category: item.category,
                   	price: item.price,
                    description: item.description,
                    cover: item.cover,
                    images: item.images,
                    address: item.address,
                    longitude: item.longitude,
                    latitude: item.latitude
                   
				};
				//console.log(reqData);
				if (tools.isEmpty(reqData.images)) {
					res.json(Results.ERR_NOTFINISHED_ERR);
					return;
				}
				if (tools.hasNull(reqData)) {
					res.json(Results.ERR_NOTFINISHED_ERR);
					return;
				}
				item['status'] = 1;
				item.updateAt = new Date();
				item.save(function(err, item) {
					if (err) {
						//consolo.log(err);
						return next();
					} else {
						res.json({
							result: true,
							data: {
								"_id": item.id,
                                "schoolId": item.schoolId
							}
						});
					}
				});
			}
		});
	});

	User.findById(req.user.id, function(err, user) {
		if (err) {
			res.json(Results.ERR_DB_ERR);
			return;
		} else {
			epUser.emit("findUser", user);
		}
	});

};