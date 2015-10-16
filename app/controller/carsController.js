hereseasApp.controller('AllCarsController',function($scope,requestService){
    
    $scope.carMaker = "1";
    $scope.carColor = "1";
    $scope.carPrice = "1";
    $scope.carModel = "1";
    

});

hereseasApp.controller('CarsController',function($scope,requestService){
    
    $scope.carMaker = "1";
    $scope.carColor = "1";
    $scope.carPrice = "1";
    $scope.carModel = "1";
    

});

hereseasApp.controller('CarPostController', function($scope, languageService, userService, alertService, $state, $mdDialog, Upload, fileReader, requestService,$filter){
    
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
            
	        $scope.isStudio = false,
            $scope.numBedrooms = 1,
            $scope.numBathrooms = 1,
            //$scope.beginDate = new Date(),
            //$scope.endDate = $scope.beginDate,
            $scope.AddRoom = AddRoom;
            $scope.RemoveRoom = RemoveRoom;
            
            $scope.name = name;  //获取中午名称函数
            $scope.doPost = doPost;
            $scope.canPost = false; //检测所有表格是否填完
            $scope.arrUploads = [];
            //表格是否填完变量
            $scope.tableFilled = [
                {filled: true},
                {filled: false},
                {filled: true},
                {filled: false},
                {filled: false},
                {filled: false},
                {filled: false}
            ];
    
            $scope.hide = function() {
                userService.setDraft({});
                $mdDialog.hide();
            };
             
            //control the field of bedroom num and bathroom num in case of studio selected
            $scope.$watch(
              function() { return $scope.numBedrooms; },
              // This is the change listener, called when the value returned from the above function changes
              function(newValue, oldValue) {
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
                    console.log($scope.steps[5].address.zipcode);
                    geocoder.geocode({ 'address' : $scope.steps[5].address.full}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                            
                            $scope.steps[5].latitude = results[0].geometry.location.lat();
                            $scope.steps[5].longitude = results[0].geometry.location.lng();
                            console.log($scope.steps[5]);
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
                                fileFormDataName: 'car'
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
                                
                                
                                
                                key.cancel = function(){
                                    var index = $scope.steps[6].images.indexOf(key.id);
                                    $scope.steps[6].images.splice(index,1);
                                    if($scope.steps[6].images.length == 0){ 
                                        $scope.steps[6].cover = '';
                                    }
                                    else if(index == 0) {
                                        $scope.steps[6].cover = $scope.steps[6].images[0];
                                    }
                                    
                                    
                                    $scope.arrUploads.splice($scope.arrUploads.indexOf(key), 1);
                                    $scope.files.splice($scope.files.indexOf(key.file), 1);
                                    console.log("cancel after upload", $scope.files, $scope.arrUploads);
                                    
                                    key.id = "";
                                };
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
                    schoolId : '',
                    year : '',
                    make : '',
                    totalMiles : '',
                    style : '',
                    category : '',
                    model : '',
                    price : '',
                    boughtDate : new Date(),
                    available : true 
                },
                {
                    color : '',
                    noAccident : false,
                    driveSystem : '',
                    transSystem : '',
                    output: ''
                },
                {
                    brake_turn:{
                        ABS : false,
                        ESC : false
                    },
                    safe:{
                        double_airbag : false,
                        side_airbag : false,
                        airbag : false
                    },
                    comft_entn:{
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
                    description : ''
                },
                {
                    address :  '',
                    longitude :  '',
                    latitude :  ''
                },
                {
                    cover : '',
                    images : []
                }
            ];
    
            /*$scope.ifShowSubmit = function(){
                return userService.getDraft().state !== "edit";
            };*/
    
            $scope.setEditModel = function(data){
                console.log(data.beginDate, data.endDate);
                $scope.steps[0].beginDate = new Date(data.beginDate);
                $scope.steps[0].endDate = new Date(data.endDate);
                
                if(data.type == 'Studio'){
                    $scope.isStudio = true;
                }
                else{
                    $scope.numBedrooms = data.type.charAt(0)*1;
                    $scope.numBathrooms = data.type.charAt(2)*1;
                }
                $scope.steps[1].rooms = data.rooms; 

                
                if(data.facilities !== undefined){
                    $scope.steps[2].facilities = data.facilities;
                }

                if(data.fees !== undefined){
                    $scope.steps[3].fees = data.fees;
                }
                
                $scope.steps[4].title = data.title;
                $scope.steps[4].description = data.description;


                if(data.address !== undefined)
                {
                    $scope.steps[5].address = data.address;
                    console.log($scope.steps[5].address);
                    $scope.addressGot = true;
                    $scope.addresses[0] = $scope.steps[5].address.street.split(' ')[0];
                    $scope.addresses[1] = $scope.steps[5].address.street.split(' ')[1];
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
    
            
            if(!angular.equals(userService.getDraft(),{})){
                if(userService.getDraft().state == 'edit'){
                    requestService.GetDraft({id:userService.getDraft().id}, function(res){
                        console.log("EDIT", res);

                        $scope.setEditModel(res.data[0]);                
                    })
                }
                else if(userService.getDraft().state == 'update'){
                    requestService.GetApt({id:userService.getDraft().id}, function(res){
                        console.log("UPDATE", res);
                        
                        $scope.setEditModel(res.data[0]);                
                    })
                }
            }
            
            
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
                //insert image urls to array 'images' 
                /*angular.forEach($scope.arrUploads, function(key) {
                    
                    if($scope.arrUploads.indexOf(key) == 0) $scope.steps[6].cover = key.id;
                    
                   if(key.id !== "") $scope.steps[6].images.push(key.id); 
                });*/
                
                requestService.StepPost({id:userService.getDraft().id , step:7}, $scope.steps[6], function(res){
                    console.log("step6",res);
                    requestService.EndRoompost({id:userService.getDraft().id}, function(res){
                        console.log("final", res);
                        userService.setDraft({});
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
                    if($scope.activePage == 1){
                        $scope.steps[0].schoolId = userService.getUser().schoolId;
                        $scope.steps[0].totalMiles = $scope.mileage + $scope.mUnits;
                        if(angular.equals(userService.getDraft(), {})){
                            requestService.StartCarpost($scope.steps[0], function(res){
                                userService.setDraft({id:res.data._id, state:"post"});
                                console.log(res);
                            });
                        }
                        else{
                            requestService.StepPost({id:userService.getDraft().id , step:1}, $scope.steps[0], function(res){
                                console.log(res);
                            });
                        }
                    }
                    else{
                        if(!angular.equals(userService.getDraft(),{}) && $scope.tableFilled[$scope.activePage-1].filled){
                            console.log($scope.steps[$scope.activePage-1], $scope.activePage);
                            requestService.CarStepPost({id:userService.getDraft().id , step:$scope.activePage}, $scope.steps[$scope.activePage-1], function(res){
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