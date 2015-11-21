hereseasApp.controller('AllCarsController',function($scope,$stateParams,requestService,userService){
    
    var cur_page = 1;
    var max_page = 1;

    $scope.min_price = 2000;
    $scope.max_price = 40000;
    
    $("#price-slider").on("slideStop", function(slideEvt) {
        //console.log(slideEvt);
        $scope.selectData.startPrice = slideEvt.value[0];
        $scope.selectData.endPrice = slideEvt.value[1];
        updatePage();
    });
    
    $scope.selectData = {
        id : $stateParams.schoolId, 
        page : cur_page, 
        pageSize : 6,
        startPrice:'',
        endPrice:'',
        category:''
    };
    
    $scope.schoolId = $stateParams.schoolId;
    
    
    function updatePage(){
        requestService.GetCarsBySchool($scope.selectData,
        function(res){
            console.log(res);
            if(res.result){
                //console.log(res.data);
                var cars = res.data.cars;
                $scope.carsResult = cars;
                
                // store number of max pages
                max_page = res.data.totalPage;
                $scope.pages = [];
                for(var i=0; i<max_page; i++){
                    $scope.pages[i] = {};
                    $scope.pages[i].id = i+1;             
                }

                // initial map
                var myLatLng=[];
                for(var i=0; i<cars.length; i++){
                    myLatLng[i]={};
                    myLatLng[i].lat = parseFloat(cars[i].latitude);
                    myLatLng[i].lng = parseFloat(cars[i].longitude);             
                }

                // Create a map object and specify the DOM element for display.
                var map = new google.maps.Map(document.getElementById('carsMap'), {
                    center: myLatLng[0],
                    scrollwheel: true,
                    zoom: 12,
                    scrollwheel: false
                });

                // Origins, anchor positions and coordinates of the marker increase in the X
                // direction to the right and in the Y direction down.
                var image = {
                    url: '/app/view/img/apts/marker.png',
                    // This marker is 58 pixels wide by 24 pixels high.
                    size: new google.maps.Size(58, 24),
                    // The origin for this image is (0, 0).
                    origin: new google.maps.Point(0, 0),
                    // The anchor for this image is the base of the flagpole at (0, 24).
                    anchor: new google.maps.Point(36, 24)
                };
                // Shapes define the clickable region of the icon. The type defines an HTML
                // <area> element 'poly' which traces out a polygon as a series of X,Y points.
                // The final coordinate closes the poly by connecting to the first coordinate.
                var shape = {
                    coords: [0, 0, 0, 24, 58, 24, 58, 0],
                    type: 'poly'
                };

                var curPrice;
                for(var i=0; i<cars.length; i++){
                    // Create a marker and set its position.
                    if (typeof cars[i].price == "undefined"){
                        curPrice = 'No Price';
                    }else{
                        curPrice = cars[i].price;
                    }
                    var marker = new MarkerWithLabel({
                        map: map,
                        position: myLatLng[i],
                        icon: image,
                        shape: shape,
                        labelContent: curPrice,
                        draggable: false,
                        labelClass: "labels",
                        labelAnchor: new google.maps.Point(30, 22)
                    });   
                }
            }else{
                $scope.carsResult = []; 
            }
        });
    };
    updatePage();
    
    $scope.setStyle = function(style){
        $scope.selectData.category = style;
        updatePage();
    };
    
    $scope.setPage = function(pg){
        cur_page = pg+1;
        $scope.selectData.page = cur_page;
        updatePage();
    };
    
    $scope.previous = function(){
        if(cur_page - 1 > 0){
            cur_page = cur_page - 1;
        }
        $scope.selectData.page = cur_page;
        updatePage();
    };
    
    $scope.next = function(){
        if(cur_page + 1 <= max_page){
            cur_page = cur_page + 1;
        }
        $scope.selectData.page = cur_page;
        updatePage();
    };
    
    $scope.changeSearch = function() {
        console.log($scope.selectData.hasPark);
        updatePage();
    }

});

hereseasApp.controller('CarDisplayController', function ($state, $scope, $stateParams, languageService, requestService,$mdDialog,userService,alertService) {         
    requestService.GetCar({id: $stateParams.carId}, function(res){
        
        if(res.result){
            console.log(res);
            $scope.data = res.data[0];
            $scope.addFav = addFav;
            $scope.delFav = delFav;
            $scope.sendMessage = sendMessage;
            var car = $scope.data;
            
            //set map
            myLatLng={};
            myLatLng.lat = parseFloat(car.latitude);
            myLatLng.lng = parseFloat(car.longitude);             

            // Create a map object and specify the DOM element for display.
            var map = new google.maps.Map(document.getElementById('carMap'), {
                center: myLatLng,
                scrollwheel: true,
                zoom: 12,
                scrollwheel: false
            });

            // Origins, anchor positions and coordinates of the marker increase in the X
            // direction to the right and in the Y direction down.
            var image = {
                url: '/app/view/img/apts/marker.png',
                    // This marker is 58 pixels wide by 24 pixels high.
                size: new google.maps.Size(58, 24),
                    // The origin for this image is (0, 0).
                origin: new google.maps.Point(0, 0),
                    // The anchor for this image is the base of the flagpole at (0, 24).
                anchor: new google.maps.Point(36, 24)
            };
                // Shapes define the clickable region of the icon. The type defines an HTML
                // <area> element 'poly' which traces out a polygon as a series of X,Y points.
                // The final coordinate closes the poly by connecting to the first coordinate.
            var shape = {
                coords: [0, 0, 0, 24, 58, 24, 58, 0],
                type: 'poly'
            };

            var price;
                // Create a marker and set its position.
            price = car.price;
            var marker = new MarkerWithLabel({
                map: map,
                position: myLatLng,
                icon: image,
                shape: shape,
                labelContent: price,
                draggable: false,
                labelClass: "labels",
                labelAnchor: new google.maps.Point(18, 22)
            });
            
            
            function delFav(){
               
                userService.deleteFavorite({
                    id:$stateParams.carId,
                    category:"cars"
                }).then(function (res) {
                    //console.log(res);
                    if (res.result) {
                        //alert("Message has been sent");
                        $scope.isFav = false;
                    } else {
                        //alert("err");
                    }
                });

            };
            
            function addFav(){
                if($scope.logged){
                    userService.postFavorite({
                        id: $stateParams.carId,
                        category: "cars"
                    }).then(function (res) {
                        //console.log(res);
                        if (res.result) {
                            $scope.isFav = true;
                            //alert("Message has been sent");
                        } else {
                            //alert("err");
                        }
                    });
                }else{
                    alertService.alert("请登录").then(function() {
                        $scope.$broadcast('login', '1');
                    });
                }
            }

//                {
//                userId: '56147dee8eecbd0d06c8970b',
//	           username: 'abc', 
//	           userAvatar:'/app/view/img/user/img1.JPG',
//	           schoolId:'56147f7aef6d2a2806532536',
//                title: '最便宜',
//                description: '再也找不到更便宜的了',
//                cover: '/app/view/img/car/car_temp.jpg',
//                images: ['/app/view/img/car/car_temp.jpg','/app/view/img/car/car_temp.jpg','/app/view/img/car/car_temp.jpg'],
//                   basicInfo: {
//                      year: '2014',
//                      make: 'lexus',
//                      totalMiles: '8000mile',
//                      style: 'IS250',
//                      category: 'Sedan',
//                      model: 'IS',
//                        price: '15000',
//                      boughtDate: new Date(),
//                        available: true,
//                       status: 1,
//                       create_at: new Date(),
//                      update_at: new Date(),
//                   },
//                color: 'white',
//	           noAccident: true,
//	           driveSystem: 'FWD',
//	           transSystem: '自动',
//	           output: '2.0',
//	           breakType: {
//                    ABS:true,
//                    ESC:true
//               },
//               security: {
//                    double_airbag:true,
//                    slide_airbag:true,
//                    airbag:true
//	           },
//               comfort:{
//                    elec_lock:true,
//                    elec_start: true,
//                    cruise: true,
//                    elec_window: true,
//                    navi: true,
//                    backup_supp: true,
//                    CD: true,
//                    DVD: true,
//                    bluetooth:true,
//                    USB:true,
//                    sun_roof: true
//               },
//                address:{
//                    apt: '',
//                    city: 'Arlington',
//                    full: '2000 S Eads St, Arlington, VA, United States',
//                    state: 'VA',
//                    street: '2000 South Eads Street',
//                    zipcode: '22202'
//                },
//                latitude:'38.9131296',
//                longitude:'-77.00652760000003'
//            }
            $scope.images = [];
            for(var i=0; i<$scope.data.images.length; i++)
                $scope.images.push({thumb:$scope.data.images[i], img: $scope.data.images[i]});
            //console.log($scope.images);
            
            requestService.GetUserSelf(function(res){
                if(res.result){
                    $scope.logged = true;
                    requestService.GetFavList(function(res){
                        console.log(res);
                        if(res.data.cars !== null)
                            $scope.favoriteCars = res.data.cars;
                        else $scope.favoriteCars = [];

                        $scope.isFav = $scope.favoriteCars.indexOf($stateParams.carId) !== -1;
                    });
                }
            });
            
            
            
            $scope.showImgs = function(ev, images, index){
                $mdDialog.show({
                    controller:function ($scope){
                        $scope.images = images;
                        $scope.index = index;
                    },
                    templateUrl: '/app/view/partials/_image-display.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true
                });
            };

            
            function sendMessage(ev) {
                if($scope.logged){
                    $mdDialog.show({
                        controller:['$scope', 'recvId', function($scope, recvId) { 
                            $scope.content = '';
                            $scope.sendmessage = function() {
                                console.log($scope.content);
                                
                                userService.sendmessage({
                                    id: recvId,
                                    content: $scope.content
                                }).then(function (res) {
                                    if (res.result) {
                                        alert("Message has been sent");
                                    } else {
                                        alert("err");
                                    }
                                });
                            }
                        }],
                        templateUrl: '/app/view/message.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true,
                        locals : {
                            recvId : $scope.data.userId
                        }
                        
                    });
                }else{
                    alertService.alert("请登录").then(function() {
                        $scope.$broadcast('login', '1');
                    });
                }
            };

            /*$scope.aprPowIcons = [
                '/app/view/img/icon/bbq.svg',
                '/app/view/img/icon/businessRoom.svg',
                '/app/view/img/icon/elevator.svg',
                '/app/view/img/icon/freeParking.svg',
                '/app/view/img/icon/frontDesk.svg',
                '/app/view/img/icon/gym.svg',
                '/app/view/img/icon/laundry.svg',
                '/app/view/img/icon/partyRoom.svg',
                '/app/view/img/icon/petsAllowed.svg',
                '/app/view/img/icon/roof.svg',
                '/app/view/img/icon/safetySystem.svg',
                '/app/view/img/icon/swimmingPool.svg',
                '/app/view/img/icon/wheelchairAccessible.svg',
                '/app/view/img/icon/yard.svg'
            ];
            $scope.confParamIcons = [
                '/app/view/img/icon/airCondition.svg',
                '/app/view/img/icon/balcony.svg',
                '/app/view/img/icon/dishwasher.svg',
                '/app/view/img/icon/dryer.svg',
                '/app/view/img/icon/extinguisher.svg',
                '/app/view/img/icon/furnitures.svg',
                '/app/view/img/icon/heater.svg',
                '/app/view/img/icon/microwave.svg',
                '/app/view/img/icon/oven.svg',
                '/app/view/img/icon/refrigerator.svg',
                '/app/view/img/icon/smokeDetector.svg',
                '/app/view/img/icon/washer.svg'
            ];
            $scope.data = $scope.carResult;
            console.log($scope.data);*/
            requestService.GetUser({id: $scope.data.userId},function(res){
                console.log(res.data)
                $scope.username = res.data.username;
                $scope.avatar = res.data.avatar;
            });
            
            /*
            console.log($scope.data);
            $scope.add_apt = $scope.data.address.full;
            
            $scope.rooms = $scope.data.rooms;
            $scope.theRoom = $scope.rooms[1];
            */
            requestService.GetSchool({id: $scope.data.schoolId}, function(res) {
                if (res.result) {
                    //console.log(res.data);
                    $scope.schoolName = res.data.name;
                    
                } else {
                    //http get school id error
                }
            });
    
            $scope.name = name;
            /*
            $scope.ShowAllApt = ShowAllApt;
            $scope.ShowAllRoom = ShowAllRoom;
            $scope.ShowAllFees = ShowAllFees;
            $scope.SetMethod = SetMethod;
            
            $scope.count = count;
            $scope.has_all_facilities = has_all_facilities;
            $scope.has_all_room_facilities = has_all_room_facilities;
            $scope.has_all_fees = has_all_fees;
            
            $scope.numAptFacilitiesType =0;
            $scope.numRoomFacilitiesType =0;
            $scope.numFeesType =0;
            
            count();

            function count() {
                //统计拥有的公寓设施的数量
                for (var key in $scope.data.facilities.apt)
                {                  
                    $scope.numAptFacilitiesType++;
                    if($scope.data.facilities.apt[key] == true)
                        $scope.apt_true++;
                };
                //统计拥有的房间设施的数量
                for(var key in $scope.data.facilities.room)
                {
                    $scope.numRoomFacilitiesType++;
                    if($scope.data.facilities.room[key] == true)
                        $scope.room_true++;
                };
                //统计拥有的费用的数量
                for(var key in $scope.data.fees)
                {
                    $scope.numFeesType++;
                    if(!($scope.data.fees[key] == null))
                        $scope.fees_true++;
                };
            };

            function ShowAllApt() {
                $scope.show_all_apt = !$scope.show_all_apt;  
            };

            function ShowAllRoom() {
                $scope.show_all_room = !$scope.show_all_room;
            };

            function ShowAllFees() {
                $scope.show_all_fees = !$scope.show_all_fees;
            };

            function SetMethod(method) {
                roomService.setDisplay(method);
            };
            */
            function name(name) {
                return languageService.getChineseName(name);
            };
            /*
            function has_all_facilities() {
                return $scope.apt_true == $scope.numAptFacilitiesType;
            };

            function has_all_room_facilities() {
                return $scope.room_true == $scope.numRoomFacilitiesType;
            };

            function has_all_fees() {
                return $scope.fees_true == $scope.numFeesType;
            };*/
        }else{
            $state.go('home');
        }
    });
});

hereseasApp.controller('CarPostController', function($scope, $location, languageService, userService, alertService, $state, $mdDialog, Upload, fileReader, requestService,$filter){
    
            var geocoder = new google.maps.Geocoder();
            //地址自动完成相关变量
            $scope.options1 = null;
            $scope.details1 = '';
            $scope.addresses = [];
            $scope.addressGot = false;        //控制页面上是否显示解析后地址  
            $scope.addressCorrect = false;     //判断地址是否正确
            $scope.validAddress = validAddress; //判断地址是否合法
            $scope.mUnits = 'miles';        
    
            $scope.activePage = 1;
            $scope.lastPage = lastPage; 
            $scope.nextPage = nextPage;
            $scope.setActivePage = setActivePage;
            
            //$scope.beginDate = new Date(),
            //$scope.endDate = $scope.beginDate,
            
            $scope.name = name;  //获取中午名称函数
            $scope.doPost = doPost;
            $scope.canPost = false; //检测所有表格是否填完
            $scope.arrUploads = [];
            //表格是否填完变量
            $scope.tableFilled = [
                {filled: false},
                {filled: false},
                {filled: true},
                {filled: false},
                {filled: false},
                {filled: false}
            ];
    
            $scope.hide = function() {
                userService.setCarDraft({});
                $mdDialog.hide();
            };
    
            //details1 is the detail address provided by google address autocomplete 
            $scope.$watch('details1', function(newValue){  //在地址合法之后的操作
                if(newValue && $scope.validAddress(newValue)){//set the model 
                    $scope.addressGot = true;
                    $scope.addresses = [];
                    //console.log( newValue);
                    var componentForm = {
                      street_number: 'short_name',
                      route: 'long_name',
                      locality: 'long_name',
                      administrative_area_level_1: 'short_name',
                      postal_code: 'short_name'
                    };

                    for (var i = 0; i < $scope.details1.address_components.length; i++) {
                        var addressType = $scope.details1.address_components[i].types[0];
                        if (componentForm[addressType]) {
                          var val = $scope.details1.address_components[i][componentForm[addressType]];
                          $scope.addresses.push(val);
                        }
                    }
                    
                    $scope.steps[4].address.street = $scope.addresses[0]+" "+$scope.addresses[1];
                    $scope.steps[4].address.city = $scope.addresses[2];
                    $scope.steps[4].address.state = $scope.addresses[3];
                    $scope.steps[4].address.zipcode = $scope.addresses[4];
                    console.log($scope.steps[4].address.zipcode);
                    geocoder.geocode({ 'address' : $scope.steps[4].address.full}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                            
                            $scope.steps[4].latitude = results[0].geometry.location.lat();
                            $scope.steps[4].longitude = results[0].geometry.location.lng();
                            console.log($scope.steps[4]);
                        } else {}
                    });
                }
            });
            
            
            function validAddress(value) {
                var num = 0;
                angular.forEach( value, function() {
                    num++;
                });
                return num==1 ? false : true;
            };
            
            $scope.removeImage = function(url){
                if(userService.getCarDraft().state == 'update'){
                    requestService.GetCar({id:userService.getCarDraft().id},function(res){
                        $scope.steps[5].images = res.data[0].images;
                        var index = $scope.steps[5].images.indexOf(url);
                        $scope.steps[5].images.splice(index, 1);
                        if($scope.steps[5].images.length == 0)
                            $scope.steps[5].cover = '';
                        else
                            $scope.steps[5].cover = $scope.steps[5].images[0];

                        requestService.CarStepPost({id:userService.getCarDraft().id , step:6}, $scope.steps[5], function(res){
                            console.log(res);
                            requestService.GetCar({id:userService.getCarDraft().id},function(res){
                                $scope.steps[5].images = res.data[0].images;
                                $scope.steps[5].cover = res.data[0].cover;
                            });
                        });
                    });
                }else{
                    requestService.GetCarDraft({id:userService.getCarDraft().id},function(res){

                        $scope.steps[5].images = res.data[0].images;
                        console.log(res, $scope.steps[5].images,url);
                        var index = $scope.steps[5].images.indexOf(url);
                        $scope.steps[5].images.splice(index, 1);
                        if($scope.steps[5].images.length == 0)
                            $scope.steps[5].cover = '';
                        else
                            $scope.steps[5].cover = $scope.steps[5].images[0];

                        requestService.CarStepPost({id:userService.getCarDraft().id , step:6}, $scope.steps[5], function(res){
                            console.log(res);
                            requestService.GetCarDraft({id:userService.getCarDraft().id},function(res){
                                $scope.steps[5].images = res.data[0].images;
                                $scope.steps[5].cover = res.data[0].cover;
                            });
                        });
                    });
                }
            };
            $scope.$watch('files', function (newValue, oldValue) {
                //files:image upload model
                if(!angular.equals(newValue, oldValue)&& newValue !== [])
                    $scope.upload($scope.files);
            });
            
            $scope.upload = function (files) {
                if (files && files.length && (files.length<(11-$scope.arrUploads.length))) {
                    //console.log(files);
                    for (var i = $scope.arrUploads.length; i < files.length; i++) {  //ngf-keep为false时从0开始, false时处理重复图片较麻烦
                        $scope.arrUploads.push({file: files[i], prog: 0, content: "default.png", saved : false, cancel: "", id:""});
                    }                   
                    angular.forEach($scope.arrUploads, function(key){
                        if(key.saved == false)
                        {
                            fileReader.readAsDataUrl(key.file, $scope).then(function(result) {
                                key.content = result;
                            });
                            var up = Upload.upload({
                                url: 'http://52.25.82.212:8080/car/m_upload_image',
                                file: key.file,
                                fileFormDataName: 'car'
                            }).progress(function (evt) {
                                key.prog = parseInt(100.0 * evt.loaded / evt.total);
                            }).success(function (data, status, headers, config) {
                                //console.log('file ' + config.file.name + 'uploaded. Response: ');
                                console.log($scope.arrUploads);
                                key.saved = true;
                                key.id = 'https://s3.amazonaws.com/hereseas-public-images/'+data.data;
                                console.log(key.id);
                                
                                $scope.steps[5].images.push(key.id);
                                if($scope.steps[5].images.length == 1)
                                    $scope.steps[5].cover = $scope.steps[5].images[0];
                                $scope.arrUploads.splice($scope.arrUploads.indexOf(key), 1);
                                $scope.files.splice($scope.files.indexOf(key.file), 1);

                                requestService.CarStepPost({id:userService.getCarDraft().id , step:6}, $scope.steps[5], function(res){
                                    console.log(res);
                                });
                                
                            }).error(function (data, status, headers, config) {
                                console.log('error status: ' + status);
                            })
                            
                            key.cancel = function(){
                                up.abort();     
                                $scope.arrUploads.splice($scope.arrUploads.indexOf(key), 1);
                                $scope.files.splice($scope.files.indexOf(key.file), 1);
                                console.log("cancel during upload", $scope.files, $scope.arrUploads);
                            }
                        }
                    });  
                }
            };

            
            //the main model 
	       $scope.steps = [
                {
                   // schoolId : '',
                    year : '',
                    make : '',
                    totalMiles : '',
                    category : 'Sedan',
                    model : '',
                    style:'',
                    price : '',
                    boughtDate : undefined,
                 // available : true
                       
                },
                {
                    color : '',
                    noAccident : false,
                    driveSystem : '',
                    transSystem : '',
                    output: ''
                },
                {
                    breakType:{
                        ABS : false,
                        ESC : false,
                    },
                    security:{
                        double_airbag : false,
                        side_airbag : false,
                        curtain : false,
                    },
                    comfort:{
                        elec_lock : false,
                        elec_start : false,
                        cruise : false,
                        elec_window : false,
                        navi : false,
                        backup_supp : false,
                        CD : false,
                        DVD : false,
                        bluetooth : false,
                        USB : false,
                        sun_roof : false
                    }
                    
                },
                {
                    title :  '',
                    description : ''
                },
                {
                    address : {
                         street :  '',
                         apt :       '',
                         city :     '',
                         state :    '',
                         zipcode :  '',
                         full:   ''
                    },
                    latitude : '',
                    longitude : ''
                },
                {
                    cover : '',
                    images : []
                }
            ];
    

    
            $scope.setEditModel = function(data){
                $scope.steps[0].basicInfo = data.basicInfo;
                $scope.steps[0].basicInfo[0].boughtDate = new Date(data.basicInfo[0].boughtDate);
                
                
                
                
                
                if(data.color !== undefined)
                    $scope.steps[1].color = data.color;
                
                if(data.driveSystem !== undefined)
                    $scope.steps[1].driveSystem = data.driveSystem;
                
                if(data.noAccident !== undefined)
                    $scope.steps[1].noAccident = data.noAccident;
                
                if(data.output !== undefined)
                    $scope.steps[1].output = data.output;
                
                if(data.transSystem !== undefined)
                    $scope.steps[1].transSystem = data.transSystem;
                
                if(data.breakType !== undefined)
                    $scope.steps[2].breakType = data.breakType;
                
                if(data.comfort !== undefined)
                    $scope.steps[2].comfort = data.comfort;
                
                if(data.security !== undefined)
                    $scope.steps[2].security = data.security;
                
                if(data.description !== undefined)
                    $scope.steps[3].description = data.description;
                
                if(data.title !== undefined)
                    $scope.steps[3].title = data.title;

                if(data.address !== undefined)
                {
                    $scope.steps[4].address = data.address;
                    console.log($scope.steps[4].address);
                    $scope.addressGot = true;
                    $scope.addresses[0] = $scope.steps[4].address.street.split(' ')[0];
                    $scope.addresses[1] = $scope.steps[4].address.street.split(' ')[1];
                    $scope.addresses[2] = $scope.steps[4].address.city;
                    $scope.addresses[3] = $scope.steps[4].address.state;
                    $scope.addresses[4] = $scope.steps[4].address.zipcode;

                }

                if(data.cover !== undefined){
                    $scope.steps[5].cover = data.cover;
                    $scope.steps[5].images = data.images;
                    console.log($scope.steps[5].images);
                }
            };
    
            
            if(!angular.equals(userService.getCarDraft(),{})){
                if(userService.getCarDraft().state == 'edit'){
                    requestService.GetCarDraft({id:userService.getCarDraft().id}, function(res){
                        console.log("EDIT", res);

                        $scope.setEditModel(res.data[0]);                
                    })
                }
                else if(userService.getCarDraft().state == 'update'){
                    requestService.GetCar({id:userService.getCarDraft().id}, function(res){
                        console.log("UPDATE", res);
                        
                        $scope.setEditModel(res.data[0]);                
                    })
                }
            }
            

            
            //表格是否填完显示变化函数
            $scope.$watch('steps', function(){
                console.log($scope.steps);
                var s0 = 0; //initial step page 1
                var s2 = 0; //initial step page 3
                $scope.sn = 0; //initial whole pages
                //test if step page 0 is filled
                if($scope.steps[0].year == '' || $scope.steps[0].category == '' || $scope.steps[0].make ==
                   ''||$scope.steps[0].totalMiles == ''||$scope.steps[0].boughtDate ==
                   undefined||$scope.steps[0].price == ''){
                    $scope.tableFilled[0].filled = false;
                }else{
                    $scope.tableFilled[0].filled = true; 
                }
                
                if($scope.steps[1].color == '' || $scope.steps[1].driveSystem ==
                   ''||$scope.steps[1].transSystem == ''||$scope.steps[1].output == ''){
                    $scope.tableFilled[1].filled = false;
                }else{
                    $scope.tableFilled[1].filled = true; 
                }
                
                if($scope.steps[3].title != '' && $scope.steps[3].description != ''){
                    $scope.tableFilled[3].filled = true;
                }else{
                    $scope.tableFilled[3].filled = false;
                }
                //test if step page 5 is filled
                if($scope.steps[4].address.zipcode != '' && $scope.steps[4].address.zipcode != undefined){
                    $scope.tableFilled[4].filled = true;
                }else{
                    $scope.tableFilled[4].filled = false;
                }
                //test if step page 6 is filled  
                if($scope.steps[5].cover !== '')
                {
                    $scope.tableFilled[5].filled = true;
                }else{
                    $scope.tableFilled[5].filled = false;
                }
                //test if all tables are filled
                for(var i = 0; i < 6; i++){
                    if(!$scope.tableFilled[i].filled){$scope.sn = $scope.sn + 1;}
                }
                if($scope.sn == 0){
                    $scope.canPost = true;
                }else{
                    $scope.canPost = false;
                }
                if($scope.steps[4].address.zipcode != undefined) $scope.addressCorrect = true;
                else $scope.addressCorrect = false;
            }, true);
            
            
            function doPost() {//
                requestService.CarStepPost({id:userService.getCarDraft().id , step:6}, $scope.steps[5], function(res){
                    console.log("step6",res);
                    requestService.EndCarpost({id:userService.getCarDraft().id}, function(res){
                        console.log("final", res);
                        if(res.result){
                            userService.setCarDraft({});
                            $mdDialog.hide();
                            $location.path('/cars/'+res.data._id);
                        }else{
                            alert('发布失败');
                        }
                    });
                });  
            };
            
            //Room Post页切换功能
            function lastPage() {
                setActivePage($scope.activePage-1);
            };  
            function nextPage() {
                setActivePage($scope.activePage+1);
            };

            function setActivePage(page) {
                if($scope.activePage == page){
                    
                } else{
                    console.log($scope.activePage);
                    if($scope.activePage == 1){
                        var schoolId = {schoolId: userService.getUser().schoolId};
                        //$scope.steps[0].totalMiles = $scope.mileage + $scope.mUnits;
                        if(angular.equals(userService.getCarDraft(), {})){
                            requestService.StartCarpost(schoolId, function(res){
                                console.log(res);
                                userService.setCarDraft({id:res.data._id, state:"post"});
                                requestService.CarStepPost({id:userService.getCarDraft().id , step:1}, $scope.steps[0], function(res){
                                    console.log(res);
                                });
                            });
                            
                        }else{
                            requestService.CarStepPost({id:userService.getCarDraft().id , step:1}, $scope.steps[0], function(res){
                                console.log(res);
                            });
                        }
                    }else if($scope.activePage == 3){
                        console.log($scope.steps[$scope.activePage-1], $scope.activePage);
                        requestService.CarStepPost({id:userService.getCarDraft().id , step:$scope.activePage}, $scope.steps[$scope.activePage-1], function(res){
                            console.log(res);
                        });
                    }else{
                        if(!angular.equals(userService.getCarDraft(),{}) && $scope.tableFilled[$scope.activePage-1].filled){
                            console.log($scope.steps[$scope.activePage-1], $scope.activePage);
                            requestService.CarStepPost({id:userService.getCarDraft().id , step:$scope.activePage}, $scope.steps[$scope.activePage-1], function(res){
                                console.log(res);
                            });
                        }
                    }
                }
                $scope.activePage = page;
            };

            function name(name) {
                return languageService.getChineseName(name);
            };

});