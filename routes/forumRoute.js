var EventProxy = require('eventproxy');
var User = require('../models').User;
var Results = require('./commonResult');
var tools = require('../common/tools');
var Thread = require('../models').Thread;
var School = require('../models').School;
var Thread = require('../models').Thread;
var Comment = require('../models').Comment;



exports.getThreadById = function(req, res, next) {
	var threadId = req.param('id');

	if (tools.isEmpty(threadId)) {
		res.json(Results.ERR_PARAM_ERR);
		return;
	}

	var query = {
		'_id': threadId,
		'status': 1
	};

	Thread.findOne(query,
		'userId username userAvatar schoolId title content createAt',
		function(err, thread) {
			if (err) {
				res.json(Results.ERR_DB_ERR);
				return;
			} else if (thread == null) {
				res.json(Results.ERR_NOTFOUND_ERR);
				return;
			} else {
				res.json({
					result: true,
					data: thread
				});
				return;
			}
		});

};

exports.getThreadsBySchoolId = function(req, res, next) {
	var schoolId = req.param('id');

	if (tools.isEmpty(schoolId)) {
		res.json(Results.ERR_PARAM_ERR);
		return;
	}
	var pagination = {};
	var currentPage = 1;
	var totalPage;
	var pageSize = 20;

	if (req.query.pageSize > 0 && req.query.page > 0) {
		pageSize = req.query.pageSize;
		currentPage = parseInt(req.query.page, 10);

		if (!tools.checkPositiveNumber(currentPage)) {
			currentPage = 1;
		}
	}

	pagination['skip'] = (currentPage - 1) * pageSize;
	pagination['limit'] = pageSize;

	var query = {
		'schoolId': schoolId,
		'status': 1
	};


	Thread.find(query,
		'userId username userAvatar schoolId title preview createAt lastReplayUserId replayCount updateAt', pagination).sort({
		updateAt: 'desc'
	}).populate('lastReplayUserId', 'username').exec(function(err, threads) {

		if (err) {
			res.json(Results.ERR_DB_ERR);
			return;
		} else {
			res.json({
				result: true,
				data: {
					threads: threads
				}
			});
			return;
		}
	});

};


exports.getCommentsByThreadId = function(req, res, next) {
	var threadId = req.param('id');

	if (tools.isEmpty(threadId)) {
		res.json(Results.ERR_PARAM_ERR);
		return;
	}

	var ep = new EventProxy();

	ep.all("findThread", function(thread) {

		var commentQuery = {
			'threadId': thread.id,
			'status': 1
		}

		Comment.find(commentQuery, "userId username userAvatar content createAt").sort({
			createAt: 'asc'
		}).exec(function(err, comments) {

			if (err) {
				res.json(Results.ERR_DB_ERR);
				return;
			} else {
				res.json({
					result: true,
					data: {
						comments: comments
					}
				});
				return;
			}
		});
	});

	var query = {
		'threadId': threadId,
		'status': 1
	};

	Thread.findById(threadId,
		function(err, thread) {
			if (err) {
				res.json(Results.ERR_DB_ERR);
				return;
			} else if (thread == null) {
				res.json(Results.ERR_NOTFOUND_ERR);
				return;
			} else {
				ep.emit("findThread", thread);
			}
		});

};

exports.createThread = function(req, res, next) {
	var epUser = new EventProxy();

	epUser.all("findUser", function(user) {
		//execute after "findUser" is emited
		var reqData = {
			userId: user.id,
			username: user.username,
			userAvatar: user.avatar,
			schoolId: req.body.schoolId,
			title: req.body.title,
			content: req.body.content,
			lastReplayUserId: user.id
		};
		if (tools.hasNull(reqData)) {
			res.json(Results.ERR_PARAM_ERR);
			return;
		}
		var thread = new Thread();
		for (var key in reqData) {
			thread[key] = reqData[key];
		}

		var sanitizeHtml = require('sanitize-html');
		var dirty = reqData.content;
		var clean = sanitizeHtml(dirty);
		clean = tools.replaceAll(clean, '<p>', '');
		clean = tools.replaceAll(clean, '</p>', '');
		clean = tools.replaceAll(clean, '<br />', '');

		clean = clean.substring(0, 70);
		clean = clean + " ...";
		thread["preview"] = clean;

		thread.save(function(err, thread) {
			if (err) {
				console.log(err);
				return next();
			} else {
				res.json({
					result: true,
					data: {
						id: thread.id
					}
				});
			}
		});
	});

	User.findById(req.user.id, function(err, user) {
		if (err) {
			res.json(Results.ERR_DB_ERR);
			return;
		} else if (user == null) {
			res.json(Results.ERR_NOTFOUND_ERR);
			return;
		} else if (user.status != 1 || user.verified != true) {
			res.json(Results.ERR_PERMISSION_ERR);
			return;
		} else
			epUser.emit("findUser", user);
	});
};


exports.createComment = function(req, res, next) {
	var ep = new EventProxy();

	if (tools.isEmpty(req.body.threadId)) {
		res.json(Results.ERR_PARAM_ERR);
		return;
	}

	ep.all("findUser", "findThread", function(user, thread) {
		//execute after "findUser" is emited
		var reqData = {
			userId: user.id,
			username: user.username,
			userAvatar: user.avatar,
			schoolId: req.body.schoolId,
			threadId: thread.id,
			content: req.body.content
		};
		if (tools.hasNull(reqData)) {
			res.json(Results.ERR_PARAM_ERR);
			return;
		}
		var comment = new Comment();
		for (var key in reqData) {
			comment[key] = reqData[key];
		}

		comment.save(function(err, comment) {
			if (err) {
				console.log(err);
				return next();
			} else {

				thread.lastReplayUserId = user.id;
				thread.replayCount = thread.replayCount + 1;
				thread.updateAt = new Date();

				thread.save(function(err, thread) {
					if (err)
						console.log(err);
				});

				res.json({
					result: true,
					data: {
						id: comment.id,
						threadId: thread.id
					}
				});
				return;
			}
		});

	});

	User.findById(req.user.id, function(err, user) {
		if (err) {
			res.json(Results.ERR_DB_ERR);
			return;
		} else if (user == null) {
			res.json(Results.ERR_NOTFOUND_ERR);
			return;
		} else if (user.status != 1 || user.verified != true) {
			res.json(Results.ERR_PERMISSION_ERR);
			return;
		} else
			ep.emit("findUser", user);
	});

	Thread.findById(req.body.threadId, function(err, thread) {
		if (err) {
			res.json(Results.ERR_DB_ERR);
			return;
		} else if (thread == null) {
			res.json(Results.ERR_NOTFOUND_ERR);
			return;
		} else if (thread.status != 1) {
			res.json(Results.ERR_PERMISSION_ERR);
			return;
		} else
			ep.emit("findThread", thread);
	});
};