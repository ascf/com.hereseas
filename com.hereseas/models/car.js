var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');

var CarSchema = new Schema({
	userId: {type:Schema.ObjectId, ref: 'User' },
	
	userFirstName: {
		type: String
	},

	userLastName: {
		type: String
	},

	userAvatar: {
		type: String
	},

	schoolId: {type:Schema.ObjectId, ref: 'School' },

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
	basicInfo: [{
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

		available: {
			type: Boolean,
			default: true
		},

		status:{
			type: Number,
			default : 1
		},

		create_at: {
			type: Date,
			default: Date.now
		},
		update_at: {
			type: Date,
			default: Date.now
		}
	}],
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
	breakType: {
		type: String
	},
	//安全
	security: {
		type: String
	},
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
CarSchema.virtual('avatar_url').get(function() {
	return 'http://www.gravatar.com/avatar/' + utility.md5(this.email.toLowerCase()) + '?size=48';
});
mongoose.model('Car', CarSchema);
exports.Car = mongoose.model('Car');