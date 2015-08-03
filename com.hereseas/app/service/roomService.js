hereseasApp.factory('roomService', function ($http, $state) {
        var rentInfos =
        {
            title:  'Columbia plaza looking for roomates',
            //address: '2440 Virginia Ave NW',
            user:{
                id : '01',
                first_name: 'Zhenyu',
                last_name:'Han',
                avatar: '/app/view/img/user/img1.jpg'
                //school:'The George Washington University'
            },
            num_bedrooms:  2,
            num_bathrooms: 2,
            description: '(客廳長期出租)公寓地點: Buchanan (320 23rd St S, Arlington, VA) 屋況:1286 square ft. (需自購家具)入住時間:8/10~明年9/10 lease 13個月每月租金:客廳$630 per month（水電費另計）室友:小臥住一位GW研究所碩二 愛乾淨的女生 大臥是一個活潑也愛乾淨的碩一新生(沒有抽菸,沒有寵物)生活習慣要求:沒有抽菸、寵物 愛乾淨公寓步行至地鐵約10分鐘, 附近有許多餐館 , 生活便利有興趣的朋友可以用email跟我聯繫拉!',
            //rental:   2000,
            date_begin:  Date.now(),
            date_end: Date.now(),
            location : {
                 latitude : 45, //google map定位数据
                 longitude : -73,
                 street :  'Virginia Ave',
                 apt :       'D1006',
                 city :     'Washington',
                 state :    'DC',
                 zipcode :  '20037'
            },
            has_facilities:{
                gym:          true,
                swimming_pool: false,
                laundry:      true,
                pets_allowed:  true,
                party_room:     false,
                business_room: true,
                elevator:     true,
                front_desk:        true,
                free_parking:  false,
                roof:         true,
                yard:         false,
                wheelchair_accessible: true,
                bbq:        true,
                safety_system:    false
            },
            fees:{
                deposit:     2000,                     
                leasing:     150,
                park:        0,
                utilities:   50,
                insurance:   100,
                network:     80,
                clean:       50
            },
            room_facilities:{
                refrigerator:      true,
                washer:            true,
                dryer:             false,
                microwave:         true,
                air_condition:      false,
                balcony:           true,
                furnitures:        false,
                smoke_detector:     true,
                extinguisher:      true,
                heater:            false,
                oven:              true,
                dishwasher:        true
            },   
            rooms:[
                {
                    id:    'Bedroom1',
                    has_bathroom: true,
                    has_walk_in:  true,
                    has_closet:   true,
                    type:         'bedroom',
                    price :       800,
                    price_type :   1,
                },
                {
                    id:    'LivingRoom1',
                    has_bathroom: false,
                    has_walk_in:  false,
                    has_closet:   true,
                    type:         'living',
                    price :       500,
                    price_type :   1,
                }
            ],
            images:[
                {
                    imageId: 'cover',
                    imageUrl: '/app/view/img/room1/IMG_4509.jpg'
                },
                {
                    imageId: 'image01',
                    imageUrl: '/app/view/img/room1/IMG_4510.jpg'
                },
                {
                    imageId: 'image02',
                    imageUrl: '/app/view/img/room1/IMG_4511.jpg'
                },
                {
                    imageId: 'image03',
                    imageUrl: '/app/view/img/room1/IMG_4512.jpg'
                }
            ]
        };
    
    var postData = {};
    
    var coordinate ={
        latitude : 0,
        longitude : 0
    };
    var directionsService;
    var directionsDisplay;
    var durations ={
        driving : '',
        bicycling : '',
        walking : ''
    };
    var response1;
    var response2;
    var response3;
    var aptIds = ["", "", ""];
    
    var service = {
        validAptId : validAptId,
        setAptIds : setAptIds,
        getSchool : getSchool,
        getData : getData,
        getCoordinateByAddress : getCoordinateByAddress,
        setMap : setMap,
        calDurations : calDurations,
        setDisplay : setDisplay,
        postRoom : postRoom
    };
    return service;
    
    
    function postRoom(data){
        console.log(data);
        return $http.post("http://52.25.82.212:8080/apartment/", data)
            .then(function(res){
                
                console.log("res",res);
                if(res.data.result){
                    console.log(res.data);
                }
                
                return commonResponseHandler(res);
            },errResponseHandler);
    
    };
    
    function validAptId (id) {
        console.log(id,aptIds.indexOf(id),aptIds);
        if(aptIds.indexOf(id) == -1) return false;
        else return true;
    };
    
    function setAptIds(id1, id2, id3) {
        aptIds[0] = id1;
        aptIds[1] = id2;
        aptIds[2] = id3;
    };
    
    function getSchool(id) {
        return $http.get("http://52.25.82.212:8080/school/" + id)
            .then(function(res){
                if(res.data.result){
                    //console.log(res.data.data);
                    return {result: true ,data: res.data.data};
                } else{
                    //return {result: false, err: res.err};
                }
            }, errResponseHandler);
    };
    
    function getData(id) {
        return $http({
            method : 'get',
            url : "http://52.25.82.212:8080/apartment/" + id,
            timeout : 1000
            })
            .then(function(res){
                if(res.data.result){
                    //console.log(res.data.data);
                    return {result: true ,data: res.data.data};
                } else{
                    return {result: false, err: res.err};
                }
            }, errResponseHandler);
        
        /*return $http.get("http://52.25.82.212:8080/apartment/" + id)
            .then(function(res){
                if(res.data.result){
                    //console.log(res.data.data);
                    return {result: true ,data: res.data.data};
                } else{
                    return {result: false, err: res.err};
                }
            }, errResponseHandler);*/
    };
    
    function getCoordinateByAddress(address) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address' : address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                coordinate.latitude = results[0].geometry.location.lat();
                coordinate.longitude = results[0].geometry.location.lng();
            } else {}
        });
        return coordinate;
    };
    
    function setMap() {
        directionsService = new google.maps.DirectionsService();
        var manhattan = new google.maps.LatLng(40.7711329, -73.9741874);
        var mapOptions = {
            zoom: 13,
            center: manhattan
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        map.setOptions({scrollwheel: false});

        var rendererOptions = {
            map : map
        };
        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    };
    
    function calDurations(aptAddress, schoolAddress){
        var request1 = {
          origin : aptAddress,
          destination : schoolAddress,
          travelMode: google.maps.TravelMode.DRIVING,
        };
        var request2 = {
          origin : aptAddress,
          destination : schoolAddress,
          travelMode: google.maps.TravelMode.BICYCLING,
        };
        var request3 = {
          origin : aptAddress,
          destination : schoolAddress,
          travelMode: google.maps.TravelMode.WALKING,
        };
        directionsService.route(request1, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                response1 = response;
                durations.driving = response.routes[0].legs[0].duration.text;
            }
        });
        directionsService.route(request2, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                response2 = response;
                durations.bicycling = response.routes[0].legs[0].duration.text;
            }
        });
        directionsService.route(request3, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                response3 = response;
                durations.walking = response.routes[0].legs[0].duration.text;
            }
        });

        return durations;
    };
    
    
    function setDisplay(method){
        if(method == "driving"){
            directionsDisplay.setDirections(response1);
        }else if(method == "bicycling"){
            directionsDisplay.setDirections(response2);
        }
        else directionsDisplay.setDirections(response3);
    };
    
});


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
            clean:             '清洁费'
        };
    
    var service = {
        getChineseName : getChineseName
    };
    return service;
    
    function getChineseName(eng){
        return chn_eng_map[eng];
    };
});
