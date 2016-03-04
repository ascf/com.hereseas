var EventProxy = require('eventproxy');
var User = require('../models').User;
var Results = require('./commonResult');
var tools = require('../common/tools');
var Thread = require('../models').Thread;
var School = require('../models').School;
var Thread = require('../models').Thread;
var Comment = require('../models').Comment;

var adminRoute = require('./adminRoute');
var recentRoute = require('./recentRoute');


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

	var query = {
		'schoolId': schoolId,
		'status': 1
	};

	var option = {
		'columns': 'userId username userAvatar schoolId title preview createAt lastReplayUserId replayCount updateAt',
		'page': currentPage,
		'limit': pageSize,
		'sortBy': {
			'updateAt': -1
		},
		populate: [{
			path: 'lastReplayUserId',
			select: 'username'
		}]
	}

	Thread.paginate(query, option, function(err, results, pageCount, itemCount) {
		if (err) {
			res.json(Results.ERR_DB_ERR);
			return;
		} else {
			res.json({
				result: true,
				data: {
					threads: results,
					currentPage: currentPage,
					totalPage: pageCount
				}
			});
			return;
		}

	});


	// Thread.find(query,
	// 	'userId username userAvatar schoolId title preview createAt lastReplayUserId replayCount updateAt', pagination).sort({
	// 	updateAt: 'desc'
	// }).populate('lastReplayUserId', 'username').exec(function(err, threads) {

	// 	if (err) {
	// 		res.json(Results.ERR_DB_ERR);
	// 		return;
	// 	} else {
	// 		res.json({
	// 			result: true,
	// 			data: {
	// 				threads: threads
	// 			}
	// 		});
	// 		return;
	// 	}
	// });

};


exports.getCommentsByThreadId = function(req, res, next) {
	var threadId = req.param('id');
	var currentPage = 1;

	if (tools.isEmpty(threadId)) {
		res.json(Results.ERR_PARAM_ERR);
		return;
	}

	if (req.query.page > 0) {
		currentPage = parseInt(req.query.page, 10);

		if (!tools.checkPositiveNumber(currentPage)) {
			currentPage = 1;
		}
	}

	var ep = new EventProxy();

	ep.all("findThread", function(thread) {

		var option = {
			'columns': 'userId username userAvatar content createAt',
			'page': currentPage,
			'limit': 100,
			'sortBy': {
				'createAt': 1
			}
		}

		var commentQuery = {
			'threadId': thread.id,
			'status': 1,
		};

		Comment.paginate(commentQuery, option, function(err, results, pageCount, itemCount) {
			if (err) {
				res.json(Results.ERR_DB_ERR);
				return;
			} else {

				console.log(pageCount, itemCount);

				res.json({
					result: true,
					data: {
						comments: results,
						currentPage: currentPage,
						totalPage: pageCount
					}
				});
				return;
			}
		});


	});


	// 	Comment.find(commentQuery, "userId username userAvatar content createAt").sort({
	// 		createAt: 'asc'
	// 	}).exec(function(err, comments) {

	// 		if (err) {
	// 			res.json(Results.ERR_DB_ERR);
	// 			return;
	// 		} else {
	// 			res.json({
	// 				result: true,
	// 				data: {
	// 					comments: comments
	// 				}
	// 			});
	// 			return;
	// 		}
	// 	});
	// });

	var query = {
		'threadId': threadId,
		'status': 1
	};

	Thread.findById(threadId,
		function(err, thread) {
			if (err) {
				res.json(Results.ERR_DB_ERR);
				return;
			} else if (thread == null || thread.status != 1) {
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
		var clean = sanitizeHtml(dirty, {
			allowedTags: [],
			allowedAttributes: []
		});

		clean = clean.substring(0, 140);
		clean = clean + " ...";
		thread["preview"] = clean;

		thread.save(function(err, thread) {
			if (err) {
				console.log(err);
				return next();
			} else {
                updateUserThreads(thread._id, req.user.id);
                recentRoute.updateRecentList(thread, 4);
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

function updateUserThreads(threadId, userId) {
	var epUser = new EventProxy();
	epUser.all("findUser", function(user) {

		user.threads.addToSet(threadId);
		user.save(function() {});
		return;
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

				updateUserComments(comment._id, req.user.id);

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



function updateUserComments(commentId, userId) {
	var epUser = new EventProxy();
	epUser.all("findUser", function(user) {

		user.comments.addToSet(commentId);
		user.save(function() {});
		return;
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



exports.adminEditThreadStatus = function(req, res, next) {
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
		var threadId = req.param('id');
		var reqData = {
			status: req.body.status
		};
		if (tools.isEmpty(threadId)) {
			res.json(Results.ERR_PARAM_ERR);
			return;
		}
		if (tools.hasNull(reqData)) {
			res.json(Results.ERR_PARAM_ERR);
			return;
		}
		var query = {
			id: threadId
		};
		Thread.findById(threadId, function(err, thread) {
			if (err) {
				console.log(err);
				return next();
			} else if (!thread) {
				res.json(Results.ERR_NOTFOUND_ERR);
				return;
			} else {
				for (var key in reqData) {
					thread[key] = reqData[key];
				}
				thread.save(function(err, threadSave) {
					if (err) {
						console.log(err);
						return next();
					} else {
						res.json({
							result: true,
							data: {
								'id': threadSave.id,
								'username': threadSave.username,
								'status': threadSave.status
							}
						});
					}
				});

			}

		});
	});
};

exports.adminEditCommentStatus = function(req, res, next) {
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
		var commentId = req.param('id');
		var reqData = {
			status: req.body.status
		};
		if (tools.isEmpty(commentId)) {
			res.json(Results.ERR_PARAM_ERR);
			return;
		}
		if (tools.hasNull(reqData)) {
			res.json(Results.ERR_PARAM_ERR);
			return;
		}
		var query = {
			id: commentId
		};
		Comment.findById(commentId, function(err, comment) {
			if (err) {
				console.log(err);
				return next();
			} else if (!comment) {
				res.json(Results.ERR_NOTFOUND_ERR);
				return;
			} else {
				for (var key in reqData) {
					comment[key] = reqData[key];
				}
				comment.save(function(err, commentSave) {
					if (err) {
						console.log(err);
						return next();
					} else {
						res.json({
							result: true,
							data: {
								'id': commentSave.id,
								'username': commentSave.username,
								'status': commentSave.status
							}
						});
					}
				});

			}

		});
	});
};