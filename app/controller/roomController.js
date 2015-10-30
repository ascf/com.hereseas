hereseasApp.controller('RoomPostController', function ($scope, languageService, userService, alertService, $state, $mdDialog, roomService, Upload, fileReader, requestService, $filter) {
    
    var geocoder = new google.maps.Geocoder();
    //地址自动完成相关变量
    $scope.options1 = null;
    $scope.details1 = '';
    $scope.addresses = [];
    $scope.addressGot = false;        //控制页面上是否显示解析后地址  
    $scope.addressCorrect = false;     //判断地址是否正确
    $scope.validAddress = validAddress; //判断地址是否合法

    $scope.activePage = 1;
    $scope.lastPage = lastPage;
    $scope.nextPage = nextPage;
    $scope.setActivePage = setActivePage;

    $scope.isStudio = false;
    $scope.numBedrooms = null;
    $scope.numBathrooms = null;
    $scope.AddRoom = AddRoom;
    $scope.RemoveRoom = RemoveRoom;

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
        {filled: false},
        {filled: false}
    ];

    $scope.hide = function () {
        userService.setDraft({});
        $mdDialog.hide();
    };

    //control the field of bedroom num and bathroom num in case of studio selected
    $scope.$watch(
        function () { return $scope.numBedrooms; },
        // This is the change listener, called when the value returned from the above function changes
        function (newValue, oldValue) {
            if ( newValue !== oldValue ) {
                if(newValue == 0){ 
                    $scope.isStudio = true;
                    $scope.numBathrooms = 0;
                }
                else {
                    $scope.isStudio = false;
                    $scope.numBathrooms = 1;
                }
            }
        }
    );


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

            $scope.steps[5].address.street = $scope.addresses[0]+" "+$scope.addresses[1];
            $scope.steps[5].address.city = $scope.addresses[2];
            $scope.steps[5].address.state = $scope.addresses[3];
            $scope.steps[5].address.zipcode = $scope.addresses[4];
            geocoder.geocode({ 'address' : $scope.steps[5].address.full}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    //console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                    $scope.steps[5].latitude = results[0].geometry.location.lat();
                    $scope.steps[5].longitude = results[0].geometry.location.lng();
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
        if(userService.getDraft().state == 'update'){
            requestService.GetApt({id:userService.getDraft().id},function(res){
                $scope.steps[6].images = res.data[0].images;
                var index = $scope.steps[6].images.indexOf(url);
                $scope.steps[6].images.splice(index, 1);
                if($scope.steps[6].images.length == 0)
                    $scope.steps[6].cover = '';
                else
                    $scope.steps[6].cover = $scope.steps[6].images[0];

                requestService.StepPost({id:userService.getDraft().id , step:7}, $scope.steps[6], function(res){
                    console.log(res);
                    requestService.GetApt({id:userService.getDraft().id},function(res){
                        $scope.steps[6].images = res.data[0].images;
                        $scope.steps[6].cover = res.data[0].cover;
                    });
                });
            });
        }else{
            requestService.GetAptDraft({id:userService.getDraft().id},function(res){

                $scope.steps[6].images = res.data[0].images;
                console.log(res, $scope.steps[6].images,url);
                var index = $scope.steps[6].images.indexOf(url);
                $scope.steps[6].images.splice(index, 1);
                if($scope.steps[6].images.length == 0)
                    $scope.steps[6].cover = '';
                else
                    $scope.steps[6].cover = $scope.steps[6].images[0];

                requestService.StepPost({id:userService.getDraft().id , step:7}, $scope.steps[6], function(res){
                    console.log(res);
                    requestService.GetAptDraft({id:userService.getDraft().id},function(res){
                        $scope.steps[6].images = res.data[0].images;
                        $scope.steps[6].cover = res.data[0].cover;
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
                        url: 'http://52.25.82.212:8080/apartment/m_upload_image',
                        file: key.file,
                        fileFormDataName: 'apartment'
                    }).progress(function (evt) {
                        key.prog = parseInt(100.0 * evt.loaded / evt.total);
                    }).success(function (data, status, headers, config) {
                        //console.log('file ' + config.file.name + 'uploaded. Response: ');
                        console.log($scope.arrUploads);
                        key.saved = true;
                        key.id = 'https://s3.amazonaws.com/hereseas-public-images/'+data.data;
                        console.log(key.id);
                        
                        $scope.steps[6].images.push(key.id);
                        if($scope.steps[6].images.length == 1)
                            $scope.steps[6].cover = $scope.steps[6].images[0];
                        $scope.arrUploads.splice($scope.arrUploads.indexOf(key), 1);
                        $scope.files.splice($scope.files.indexOf(key.file), 1);

                        requestService.StepPost({id:userService.getDraft().id , step:7}, $scope.steps[6], function(res){
                            console.log(res);
                        });

                    }).error(function (data, status, headers, config) {
                        console.log('error status: ' + status);
                    })
                    //cancel while uploading
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
            type : undefined,
            beginDate:undefined,
            endDate :undefined,
            schoolId : userService.getUser().schoolId
        },
        {
            rooms:[
                {
                    share: null,
                    type :    '',
                    price :       '',
                    priceType :   '',
                    bathroom: false,
                    walkInCloset:  false,
                    closet:   false
                }
            ]
        },
        {
            facilities:{
                apt:{
                    gym: false, 
                    swimmingPool: false, 
                    laundry : false,
                    petsAllowed : false,
                    partyRoom : false,
                    businessRoom : false,
                    elevator : false,
                    frontDesk : false,
                    freeParking : false,
                    roof : false,
                    yard : false,
                    wheelchairAccessible : false,
                    bbq : false,
                    safetySystem : false
                },
                room:{
                    refrigerator: false,
                    washer: false,
                    dryer: false,
                    microwave: false,
                    airCondition: false,
                    balcony: false,
                    furnitures: false,
                    smokeDetector: false,
                    extinguisher: false,
                    heater: false,
                    oven: false,
                    dishwasher:false
                }
            }
        },
        {
            fees:{
                deposit: null,
                leasing: null,
                park: null,
                utilities: null,
                insurance: null,
                network: null,
                clean: null
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

    //set model when edit clicked 
    $scope.setEditModel = function(data){
        $scope.steps[0].beginDate = new Date(data.beginDate);
        $scope.steps[0].endDate = new Date(data.endDate);

        if(data.type == 'Studio'){
            $scope.isStudio = true;
        }
        else{
            $scope.numBedrooms = data.type.charAt(0)*1;
            $scope.numBathrooms = data.type.charAt(2)*1;
        }
        if(data.rooms.length!==0)
            $scope.steps[1].rooms = data.rooms;
        else
            $scope.steps[1].rooms= [{
                share: null,
                type :    '',
                price :       '',
                priceType :   '',
                bathroom: false,
                walkInCloset:  false,
                closet:   false
            }];


        if(data.facilities !== undefined){
            $scope.steps[2].facilities = data.facilities;
        }

        if(data.fees !== undefined){
            $scope.steps[3].fees = data.fees;
        }

        if(data.title !== undefined && data.description !== undefined){
            $scope.steps[4].title = data.title;
            $scope.steps[4].description = data.description;
        }


        if(data.address !== undefined)
        {
            $scope.steps[5].address = data.address;
            console.log($scope.steps[5].address);
            $scope.addressGot = true;
            var temp = $scope.steps[5].address.street.split(' ');
            $scope.addresses[0] = temp[0];
            $scope.addresses[1] = '';
            for(var i=1; i<temp.length; i++){
                if(i !==1 )  $scope.addresses[1] += ' ';
                $scope.addresses[1] += temp[i];
            }

            $scope.addresses[2] = $scope.steps[5].address.city;
            $scope.addresses[3] = $scope.steps[5].address.state;
            $scope.addresses[4] = $scope.steps[5].address.zipcode;
        }

        if(data.cover !== undefined){
            $scope.steps[6].cover = data.cover;
            $scope.steps[6].images = data.images;
            console.log($scope.steps[6].images);
        }
    };


    if(!angular.equals(userService.getDraft(),{})){//has a statue of edit
        if(userService.getDraft().state == 'edit'){//unposted apt edit
            requestService.GetAptDraft({id:userService.getDraft().id}, function(res){
                console.log("EDIT", res);

                $scope.setEditModel(res.data[0]);                
            })
        }
        else if(userService.getDraft().state == 'update'){//posted apt edit
            requestService.GetApt({id:userService.getDraft().id}, function(res){
                console.log("UPDATE", res);

                $scope.setEditModel(res.data[0]);                
            })
        }
    }
    
    $scope.$watch(function(){return $scope.steps[0];}, function(newValue){
        if(newValue.type == undefined || newValue.beginDate == null || newValue.endDate == null)
            $scope.tableFilled[0].filled = false; 
        else{
            $scope.tableFilled[0].filled = true; 
            if(angular.equals(userService.getDraft(), {})){
                requestService.StartRoompost($scope.steps[0], function(res){
                    userService.setDraft({id:res.data._id, state:"post"});
                    console.log(res);
                });
            }else{
                requestService.StepPost({id:userService.getDraft().id , step:1}, $scope.steps[0], function(res){
                    console.log(res);
                });
            }
        }
    }, true);


    //表格是否填完显示变化函数
    $scope.$watch('steps', function(){
        var s0 = 0; //initial step page 1
        var s2 = 0; //initial step page 3
        $scope.sn = 0; //initial whole pages
        //test if step page 1 is filled
        angular.forEach($scope.steps[1].rooms, function(room){
            if(room.type == '' || room.share == null || room.price == '' || room.priceType == ''){
                $scope.tableFilled[1].filled = false; 
            }else{
                $scope.tableFilled[1].filled = true;
            }
        });
        //test if step page 3 is filled
        /*for(var i = 0; i < 7; i++){
            if($scope.steps[3].fees[i].price == null){s2 = s2 + 1;}
        }*/
        angular.forEach($scope.steps[3].fees, function(key,value){
            //console.log(key, value);
            if(key==null) {s2 = s2 + 1;}
        });
        if(s2 == 0){
            $scope.tableFilled[3].filled = true;
        }else{
            $scope.tableFilled[3].filled = false;
        }
        //test if step page 4 is filled
        if($scope.steps[4].title != '' && $scope.steps[4].description != ''){
            $scope.tableFilled[4].filled = true;
        }else{
            $scope.tableFilled[4].filled = false;
        }
        //test if step page 5 is filled
        if($scope.steps[5].address.zipcode != '' && $scope.steps[5].address.zipcode != undefined){
            $scope.tableFilled[5].filled = true;
        }else{
            $scope.tableFilled[5].filled = false;
        }
        //test if step page 6 is filled  
        if($scope.steps[6].cover !== '')
        {
            $scope.tableFilled[6].filled = true;
        }else{
            $scope.tableFilled[6].filled = false;
        }
        //test if all tables are filled
        for(var i = 0; i < 7; i++){
            if(!$scope.tableFilled[i].filled){$scope.sn = $scope.sn + 1;}
        }
        if($scope.sn == 0){
            $scope.canPost = true;
        }else{
            $scope.canPost = false;
        }
        //test if address is valid
        if($scope.steps[5].address.zipcode != undefined) $scope.addressCorrect = true;
        else $scope.addressCorrect = false;
    }, true);


    function doPost() {//
        requestService.StepPost({id:userService.getDraft().id , step:7}, $scope.steps[6], function(res){
            console.log("step6",res);
            requestService.EndRoompost({id:userService.getDraft().id}, function(res){
                console.log("final", res);
                userService.setDraft({});
                $mdDialog.hide();
            });
        });  
    };

    $scope.$watch(function(){return {studio:$scope.isStudio, bed:$scope.numBedrooms, bath:$scope.numBathrooms}}, function(newValue){
        if(newValue.studio){
            $scope.steps[0].type = 'Studio';
        }else{
            $scope.steps[0].type = (newValue.bed==null||newValue.bath==null)?undefined:newValue.bed+'B'+newValue.bath+'B';
        }
        console.log($scope.steps[0].type);
    },true);


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
            if($scope.activePage == 1){
                requestService.StepPost({id:userService.getDraft().id , step:1}, $scope.steps[0], function(res){
                    console.log(res);
                });
            }
            else{
                if(!angular.equals(userService.getDraft(),{}) && $scope.tableFilled[$scope.activePage-1].filled && $scope.activePage!==7){
                    console.log($scope.steps[$scope.activePage-1], $scope.activePage);
                    requestService.StepPost({id:userService.getDraft().id , step:$scope.activePage}, $scope.steps[$scope.activePage-1], function(res){
                        console.log(res);
                    });
                }
            }
        }
        $scope.activePage = page;
    };

    function AddRoom() {
        $scope.steps[1].rooms.push(
            {
                share : null,
                type :    '',
                price :       '',
                priceType :   '',
                bathroom:    false,
                walkInCloset:   false,
                closet:        false
            }
        );
    };

    function RemoveRoom(index) {
        $scope.steps[1].rooms.splice(index,1);
    };


    function name(name) {
        return languageService.getChineseName(name);
    };

});




hereseasApp.controller('RoomDisplayController', function ($state, $scope, roomService, $stateParams, languageService, requestService,$mdDialog) {         
    requestService.GetApt({id: $stateParams.aptId}, function(res){
        if(res.result){
            
            $scope.showImgs = function(ev, images, index){
                $mdDialog.show({
                    controller:function ($scope){
                        $scope.images = images;
                        $scope.index = index;
 
                        $scope.images = [
                            {img: images[0]},
                            {img: images[0]},
                            {img: images[0]},
                            {img: images[0]}
                        ];
                        
                    },
                    templateUrl: '/app/view/partials/_image-display.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true
                });
            };
            
            $scope.sendMsg = function(){
                requestService.SendMsg({id:'56147dee8eecbd0d06c8970b', content:'hahahaha'}, function(res){
                    console.log(res);
                });
            };
            
            
            $scope.sendMessage = function(ev) {
                $mdDialog.show({
                    templateUrl: '/app/view/message.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true
                });
            };
            
            $scope.apt_true = 0;
            $scope.room_true = 0;
            $scope.fees_true = 0;
            $scope.show_all_apt = false;
            $scope.show_all_room = false;
            $scope.show_all_fees = false;
            $scope.roomTypeStyle = 'background-color:red';

            $scope.aptIcons = [
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
            $scope.roomIcons = [
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
            $scope.data = res.data[0];
            console.log($scope.data);
            
            $scope.images = [];
            for(var i=0; i<$scope.data.images.length; i++)
                $scope.images.push({thumb:$scope.data.images[i], img: $scope.data.images[i]});
            console.log($scope.images);
            
            $scope.username = $scope.data.username;
            $scope.avatar = $scope.data.userAvatar;
            
            $scope.add_apt = $scope.data.address.full;
            
            roomService.setMap();
                 
            $scope.rooms = $scope.data.rooms;
            $scope.theRoom = $scope.rooms[1];

            requestService.GetSchool({id: $scope.data.schoolId}, function(res) {
                if (res.result) {
                    console.log(res.data);
                    $scope.schoolName = res.data.name;
                    
                    $scope.add_school = new google.maps.LatLng(res.data.latitude*1,res.data.longitude*1);
                    console.log($scope.add_school);
                    $scope.durations = roomService.calDurations($scope.add_apt, $scope.add_school);    
                    console.log($scope.durations);
                    
                } else {
                    //http get school id error
                }
            });        

            $scope.ShowAllApt = ShowAllApt;
            $scope.ShowAllRoom = ShowAllRoom;
            $scope.ShowAllFees = ShowAllFees;
            $scope.SetMethod = SetMethod;
            $scope.name = name;
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

            function name(name) {
                return languageService.getChineseName(name);
            };

            function has_all_facilities() {
                return $scope.apt_true == $scope.numAptFacilitiesType;
            };

            function has_all_room_facilities() {
                return $scope.room_true == $scope.numRoomFacilitiesType;
            };

            function has_all_fees() {
                return $scope.fees_true == $scope.numFeesType;
            };
        }
        else
        {
            //$state.go('home');
        }
    
    });
});