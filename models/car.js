var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');

var CarSchema = new Schema({
	userId: {
		type: Schema.ObjectId,
		ref: 'User'
	},


	username: {
		type: String
	},

	userAvatar: {
		type: String
	},

	schoolId: {
		type: Schema.ObjectId,
		ref: 'School'
	},

	title: {
		type: String
	},

	description: {
		type: String
	},

	cover: {
		type: String
	},

	images: [String],
	/*
	type: {
		type: String
	},*/
	//车辆信息

	//年份
	year: {
		type: String
	},
	//制造商
	make: {
		type: String
	},
	//里程
	totalMiles: {
		type: Number
	},
	//型号
	style: {
		type: String
	},
	//车型
	category: {
		type: String
	},
	//车系
	model: {
		type: String
	},
	//价格
	price: {
		type: Number
	},
	//购买日期
	boughtDate: {
		type: Date
	},

	//颜色
	color: {
		type: String
	},
	//无事故
	noAccident: {
		type: Boolean
	},
	//驱动系统
	driveSystem: {
		type: String
	},
	//传动系统
	transSystem: {
		type: String
	},
	//排量
	output: {
		type: String
	},
	//刹车
	breakType: Schema.Types.Mixed,
	//安全
	security: Schema.Types.Mixed,
	//舒适
	comfort: Schema.Types.Mixed,
	/*
		favorite: [{type:Schema.ObjectId, ref: 'User'}],

		available: {
			type: Boolean,
			default: true
		},

		fees: Schema.Types.Mixed,

		facilities: Schema.Types.Mixed,
	*/
	address: Schema.Types.Mixed,

	longitude: {
		type: String
	},

	latitude: {
		type: String
	},

	available: {
		type: Boolean,
		default: true
	},

	status: {
		type: Number,
		default: 2
	},

	createAt: {
		type: Date,
		default: Date.now
	},

	updateAt: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Car', CarSchema);
exports.Car = mongoose.model('Car');