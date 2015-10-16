var commonResponseHandler = function (res) {
    return res.data;
};

var errResponseHandler = function (res) {
    return {
        result: false,
        err: 'Server error:' + res.status
    };
};

hereseasApp.factory('alertService', function ($http,$mdDialog) {



    return {
        alert: function (msg, $event) {
            console.log("$event",$event);
            var mAlert = $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('This is an alert title')
                .content(msg)
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!');

            if($event){
                mAlert.targetEvent($event);
            }

            return $mdDialog.show(mAlert);
        }
    };
});


hereseasApp.factory('requestService', ['$resource', function($resource){
    var host = "http://52.25.82.212:8080/";
    
    return $resource(host+':dir/:action/:id/:search', {dir: "@dir", id: "@id", action:"@action"}, {
        GetInit: { method: "GET", params: { dir: "init" } }, 
        LogOut: { method: "GET", params: { dir: "logout" } },
        GetSchool: { method: "GET", params: { dir: "school" } },
        GetSchools: { method: "GET", params: { dir: "schools" } },
        DoLogin:  { method: "POST", params: { dir: "login" } },
        DoRegister:  { method: "POST", params: { dir: "user" } },
        StartRoompost: { method: "POST", params: { dir: "apartment" } },
        StartCarpost: { method: "POST", params: { dir: "car" } },
        EndRoompost: { method: "PUT", params: { dir: "apartment", action:"post" } },
        EndCarpost: { method: "PUT", params: { dir: "car", action:"post" } },
        GetApt: { method: "GET", params: { dir: "apartment"}},
        GetApts: { method: "GET", params: { dir: "apartments"}},
        GetUser: { method:"GET", params:{dir:"user"}},
        GetUserSelf: { method:"GET", params:{dir:"userself"}},
        StepPost:{method:"PUT", params:{dir:"apartment"}},
        CarStepPost:{method:"PUT", params:{dir:"car"}},
        GetAptsBySchool: {method:"GET", params:{dir:"apartments", search:"search"}},
        ChangeProfile: {method:"PUT", params:{dir:"user"}},
        GetDrafts:{ method: "GET", params: { dir: "apartments", action:"draft"}},
        GetDraft:{ method: "GET", params: { dir: "apartment", action:"draft"}},
        GetThreeSchools:{ method: "GET", params: { dir: "schools", action:"three"}},
        GetThreeApts:{ method: "GET", params: { dir: "apartments", action:"three"}},
        DeleteApt:{ method: "DELETE", params: { dir: "apartment"}},
        CreateForgetter:{ method: "POST", params: { dir: "beforereset"}},
        SendMsg:{ method: "POST", params: { dir: "sendmessage"}}
    });
}]);

hereseasApp.factory('languageService',function () {
    var chn_eng_map = {
            gym:          '健身房',
            swimmingPool: '游泳池',
            laundry:      '洗衣房',
            petsAllowed:  '允许宠物',
            partyRoom:     '娱乐室',
            businessRoom: '商务中心',
            elevator:     '电梯',
            frontDesk:     '前台',
            freeParking:  '免费停车位',
            roof:         '天台',
            yard:         '庭院',
            wheelchairAccessible: '无障碍设施',
            bbq:        '烧烤设施',
            safetySystem:    '门禁系统',
            refrigerator:      '冰箱',
            washer:            '洗衣机',
            dryer:             '烘干机',
            microwave:         '微波炉',
            airCondition:      '空调',
            balcony:           '阳台',
            furnitures:        '家具',
            smokeDetector:     '烟雾报警器',
            extinguisher:      '灭火器',
            heater:            '暖器',
            oven:              '烤箱',
            dishwasher:        '洗碗机',
            deposit:            '押金',                     
            leasing:           '合约费用',
            park:              '停车费',
            utilities:         '水电气费',
            insurance:         '保险',
            network:           '网费',
            clean:             '清洁费',
            month:             '每月',
            elec_lock:         '电子锁',
            elec_start:        '电子点火',
            cruise:            '自动巡航',
            elec_window:       '电动车窗',
            navi:              '导航系统',
            backup_supp:       '倒车辅助',
            CD:                'CD',
            DVD:               'DVD',
            bluetooth:         '蓝牙',
            USB:               'USB',
            sun_roof:          '天窗'
        };
    
    var service = {
        getChineseName : getChineseName
    };
    return service;
    
    function getChineseName(eng){
        return chn_eng_map[eng];
    };
});


hereseasApp.factory('fileReader',function($q) {

    var onLoad = function(reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };
    
    var getReader = function(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);         
        reader.readAsDataURL(file);

        return deferred.promise;
    };
    

    return {
        readAsDataUrl: readAsDataURL  
    };

});


hereseasApp.service('ScrollSpy', function($window) {
	var rawData= function(w) {
        // Fix for IE browsers
        // See https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY?redirectlocale=en-US&redirectslug=DOM%2Fwindow.scrollY for more info
        var innerWidth = w.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var innerHeight = w.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        var supportPageOffset = w.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

        var scrollX = supportPageOffset ? w.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
        var scrollY= supportPageOffset ? w.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

		// retrieve interesting data
		var raw= {
			width: w.innerWidth,
			height: w.innerHeight,
			maxWidth: w.document.body.scrollWidth,
			maxHeight: w.document.body.scrollHeight,
			posX: w.scrollX || w.pageXOffset || w.document.documentElement.scrollLeft,
			posY: w.scrollY || w.pageYOffset || w.document.documentElement.scrollTop
		};

		// remove but log overscroll
		if(raw.posX < 0) {
			raw.posX= 0;
			raw.overscrollLeft= true;
		} else if(raw.posX + raw.width > raw.maxWidth) {
			raw.posX= raw.maxWidth - raw.width;
			raw.overscrollRight= true;
		}

		if(raw.posY < 0) {
			raw.posY= 0;
			raw.overscrollTop= true;
		} else if(raw.posY + raw.height > raw.maxHeight) {
			raw.posY= raw.maxHeight - raw.height;
			raw.overscrollBottom= true;
		}
		raw.hasOverscroll= raw.overscrollTop || raw.overscrollBottom || raw.overscrollLeft || raw.overscrollRight;

		return raw;
	};

	// calculate difference between last state and current state
	var getDelta= function(state1, state2) {

		// if state1 is undefined, return state2 + isEqual=false and velocity=0 as delta
		if(!state1 || !state2)
			return angular.extend(
				{isEqual: false, velocityX: 0, velocityY: 0},
				state2
			);

		// calculate delta of state1 and state2
		var delta= {
			posX: state2.posX - state1.posX,
			posY: state2.posY - state1.posY,
			width: state2.width - state1.width,
			height: state2.height - state1.height,
			maxWidth: state2.maxWidth - state1.maxWidth,
			maxHeight: state2.maxHeight - state1.maxHeight,
		};

		// add velocity information
		if(state2.width > 0)
			delta.velocityX= delta.posX / state2.width;
		if(state2.height > 0)
			delta.velocityY= delta.posY / state2.height;

		// if any property is not 0, the delta is not zero
		delta.isEqual= !(
			delta.posX !== 0 ||
			delta.posY !== 0 ||
			delta.width !== 0 ||
			delta.height !== 0 ||
			delta.maxWidth !== 0 ||
			delta.maxHeight !== 0
		);

		return delta;
	};

	var handlers= {};
	var lastPos;
	var scrollHandler= function(force) {
		var curPos= rawData($window);
		var delta= getDelta(lastPos, curPos);
		if(!delta.isEqual || curPos.hasOverscroll || force) {
			for(var k in handlers) {
				var cond= handlers[k].cond;
				if(cond(curPos, delta) || force) {
					handlers[k].handler(curPos, delta);
				}
			}
			lastPos= curPos;
		}
	};
	angular.element($window).on('scroll', scrollHandler);

	var self= this;

	// id generator
	var idgen= 0;

	this.trigger= function() {
		this.isForced= true;
		scrollHandler(true);
		this.isForced= false;
	};

	// generic handler, cond() should return true/false based on delta
	this.addHandler= function(cond, handler) {
		handlers[idgen]= {cond: cond, handler: handler};
		idgen++;
		return idgen-1;
	};

	// call this to clean up
	this.removeHandler= function(id) {
		delete handlers[id];
	};

	// add handler for all scroll
	this.onScroll= function(handler) {
		return self.addHandler(
			function() { return true; },
			function(raw, delta) { handler(raw, delta); }
		);
	};

	// add handler for horizontal scroll
	this.onXScroll= function(handler) {
		return self.addHandler(
			function(cur, delta) { return delta.posX !== 0; },
			function(raw, delta) { handler(raw.posX, delta.posX, raw, delta); }
		);
	};

	// add handler for vertical scroll
	this.onYScroll= function(handler) {
		return self.addHandler(
			function(cur, delta) { return delta.posY !== 0; },
			function(raw, delta) { handler(raw.posY, delta.posY, raw, delta); }
		);
	};

	// add handlers for various overscroll events
	this.onOverscrollHorz= function(handler) {
		return self.addHandler(
			function(cur, delta) { return cur.overscrollLeft || cur.overscrollRight; },
			handler
		);
	};

	this.onOverscrollLeft= function(handler) {
		return self.addHandler(
			function(cur, delta) { return cur.overscrollLeft; },
			handler
		);
	};

	this.onOverscrollRight= function(handler) {
		return self.addHandler(
			function(cur, delta) { return cur.overscrollRight; },
			handler
		);
	};

	this.onOverscrollVert= function(handler) {
		return self.addHandler(
			function(cur, delta) { return cur.overscrollTop || cur.overscrollBottom; },
			handler
		);
	};

	this.onOverscrollTop= function(handler) {
		return self.addHandler(
			function(cur, delta) { return cur.overscrollTop; },
			handler
		);
	};

	this.onOverscrollBottom= function(handler) {
		return self.addHandler(
			function(cur, delta) { return cur.overscrollBottom; },
			handler
		);
	};

});

