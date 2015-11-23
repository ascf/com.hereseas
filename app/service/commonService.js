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
            //console.log("$event",$event);
            var mAlert = $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('hereseas')
                .content(msg)
                .ariaLabel('Alert Dialog Demo')
                .clickOutsideToClose(true)
                .ok('转到');

            if($event){
                mAlert.targetEvent($event);
            }

            return $mdDialog.show(mAlert);
        }
    };
});


hereseasApp.factory('requestService', ['$resource','userService', function($resource,userService){
    var host = userService.getHost()+'/';
    
    return $resource(host+':dir/:action/:id/:search', {dir: "@dir", id: "@id", action:"@action"}, {
        GetInit: { method: "GET", params: { dir: "init" } }, 
        LogOut: { method: "GET", params: { dir: "logout" } },
        GetSchool: { method: "GET", params: { dir: "school" } },
        GetSchools: { method: "GET", params: { dir: "schools" } },
        DoLogin:  { method: "POST", params: { dir: "login" } },
        DoRegister:  { method: "POST", params: { dir: "user" } },
        StartRoompost: { method: "POST", params: { dir: "apartment" } },
        StartCarpost: { method: "POST", params: { dir: "car" } },
        StartItempost: { method: "POST", params: { dir: "item" } },
        EndRoompost: { method: "PUT", params: { dir: "apartment", action:"post" } },
        EndCarpost: { method: "PUT", params: { dir: "car", action:"post" } },
        EndItempost: { method: "PUT", params: { dir: "item", action:"post" } },
        GetApt: { method: "GET", params: { dir: "apartment"}},
        GetCar: { method: "GET", params: { dir: "car"}},
        GetItem: { method: "GET", params: { dir: "item"}},
        GetApts: { method: "GET", params: { dir: "apartments"}},
        GetCars: { method: "GET", params: { dir: "cars"}},
        GetItems: { method: "GET", params: { dir: "items"}},
        GetOtherItems: { method: "GET", params: { dir: "items",action: "other"}},
        GetUser: { method:"GET", params:{dir:"user"}},
        GetUserAllPost: { method:"GET",params:{dir:"user", action:"allpost"}},
        GetSchoolMates: {method:"GET", params:{dir:"school", search:"students"}},
        GetNewSchoolMates: {method:"GET", params:{dir:"school", search:"newstudents"}},
        GetUserSelf: { method:"GET", params:{dir:"userself"}},
        StepPost:{method:"PUT", params:{dir:"apartment"}},
        CarStepPost:{method:"PUT", params:{dir:"car"}},
        ItemStepPost:{method:"PUT", params:{dir:"item"}},
        GetAptsBySchool: {method:"GET", params:{dir:"apartments", search:"search"}},
        GetCarsBySchool: {method:"GET", params:{dir:"cars", search:"search"}},
        GetItemsBySchool: {method:"GET", params:{dir:"items", search:"search"}},
        GetForumBySchool: {method:"GET", params:{dir:"forum", search:"threads"}},
        GetCommentsByForum: {method:"GET", params:{dir:"items", search:"search"}},
        ChangeProfile: {method:"PUT", params:{dir:"user"}},
        GetAptDrafts:{ method: "GET", params: { dir: "apartments", action:"draft"}},
        GetAptDraft:{ method: "GET", params: { dir: "apartment", action:"draft"}},
        GetCarDrafts:{ method: "GET", params: { dir: "cars", action:"draft"}},
        GetCarDraft:{ method: "GET", params: { dir: "car", action:"draft"}},
        GetItemDrafts:{ method: "GET", params: { dir: "items", action:"draft"}},
        GetItemDraft:{ method: "GET", params: { dir: "item", action:"draft"}},
        GetThreeSchools:{ method: "GET", params: { dir: "schools", action:"three"}},
        GetThreeApts:{ method: "GET", params: { dir: "apartments", action:"three"}},
        GetThreeCars:{ method: "GET", params: { dir: "cars", action:"three"}},
        GetThreeItems:{ method: "GET", params: { dir: "items", action:"three"}},
        DeleteApt:{ method: "DELETE", params: { dir: "apartment"}},
        DeleteCar:{ method: "DELETE", params: { dir: "car"}},
        DeleteItem:{ method: "DELETE", params: { dir: "item"}},
        CreateForgetter:{ method: "POST", params: { dir: "beforereset"}},
        SendMsg:{ method: "POST", params: { dir: "sendmessage"}},
        GetContact:{method: "GET", params: { dir: "contact"}},
        GetMsgs:{method: "GET", params: { dir: "message"}},
        GetFavList:{method: "GET", params: { dir: "favorite", action:"list"}},
        AdminGetUserInfo:{method: "GET", params: { dir: "admin", action:"users"}},
        GetForumThreads:{method: "GET", params: { dir: "forum", search:"threads"}},
        GetForumThreadById:{method: "GET", params: { dir: "forum", action:"thread"}},
        GetForumCommentsById:{method: "GET", params: { dir: "forum", action:"thread" ,search:"comments"}},
        PostForumThread:{method: "POST", params: { dir: "forum", action:"thread"}},
        PostForumComment:{method: "POST", params: { dir: "forum", action:"comment"}},
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
            day:               '每天',
            double_airbag:     '双安全气囊',
            side_airbag:      '侧安全气囊',
            curtain:            '安全气帘',
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
            sun_roof:          '天窗',
            ABS:               'ABS',
            ESC:               'ESC',
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