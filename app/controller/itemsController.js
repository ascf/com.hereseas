hereseasApp.controller('ItemsController',function($stateParams,$scope,requestService,roomService){
    
    // store current page number
    var cur_page = 1;
    var max_page = 1;
    $scope.items=[
        {
            cover:'/app/view/img/items/items_favor.png',
            isfavor: true,
            price:'250',
            userAvatar:'/app/view/img/user/img1.JPG',
            latitude:'38.9131296',
            longitude:'-77.00652760000003'
        },
        {
            cover:'/app/view/img/items/items_favor.png',
            isfavor: true,
            price:'250',
            userAvatar:'/app/view/img/user/img1.JPG',
            latitude:'38.9131296',
            longitude:'-77.00652760000003'
        },
        {
            cover:'/app/view/img/items/items_favor.png',
            isfavor: false,
            price:'250',
            userAvatar:'/app/view/img/user/img1.JPG',
            latitude:'38.9131296',
            longitude:'-77.00652760000003'
        },
        {
            cover:'/app/view/img/items/items_favor.png',
            isfavor: false,
            price:'250',
            userAvatar:'/app/view/img/user/img1.JPG',
            latitude:'38.9131296',
            longitude:'-77.00652760000003'
        },
        {
            cover:'/app/view/img/items/items_favor.png',
            isfavor: false,
            price:'250',
            userAvatar:'/app/view/img/user/img1.JPG',
            latitude:'38.9131296',
            longitude:'-77.00652760000003'
        },
        {
            cover:'/app/view/img/items/items_favor.png',
            isfavor: true,
            price:'250',
            userAvatar:'/app/view/img/user/img1.JPG',
            latitude:'38.9131296',
            longitude:'-77.00652760000003'
        },
        {
            cover:'/app/view/img/items/items_favor.png',
            isfavor: false,
            price:'250',
            userAvatar:'/app/view/img/user/img1.JPG',
            latitude:'38.9131296',
            longitude:'-77.00652760000003'
        },
    ];

    // display all old stuffs on map
    function itemsSetMap(){
        // initial map
                var myLatLng=[];
                var items = $scope.items;
                for(var i=0; i<items.length; i++){
                    myLatLng[i]={};
                    myLatLng[i].lat = parseFloat(items[i].latitude);
                    myLatLng[i].lng = parseFloat(items[i].longitude);             
                }

                // Create a map object and specify the DOM element for display.
                var map = new google.maps.Map(document.getElementById('itemsMap'), {
                    center: myLatLng[0],
                    scrollwheel: true,
                    zoom: 12
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
                for(var i=0; i<items.length; i++){
                    // Create a marker and set its position.
                    price = items[i].price;
                    var marker = new MarkerWithLabel({
                        map: map,
                        position: myLatLng[i],
                        icon: image,
                        shape: shape,
                        labelContent: price,
                        draggable: false,
                        labelClass: "labels",
                        labelAnchor: new google.maps.Point(18, 22)
                    });   
                }
    }
    
    
    
    itemsSetMap();
    
});

hereseasApp.controller('ItemsPostController', function ($state, $scope, userService, $stateParams, languageService, requestService,$mdDialog) {
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
            
            $scope.name = name;  //获取中午名称函数
            $scope.doPost = doPost;
            $scope.canPost = false; //检测所有表格是否填完
            $scope.arrUploads = [];
            //表格是否填完变量
            $scope.tableFilled = [
                {filled: false},
                {filled: false}
            ];
    
            $scope.hide = function() {
                userService.setItemDraft([{}]);
                $mdDialog.hide();
            };
            
            $scope.add_item = function(){
                var val = {
                    steps:[{
                            expireAt : '',
                            itemName: '',
                            category: '',
                             price: '',
                            description: '',
                            cover: '',
                            images : []
                            
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
                            longitude :  '',
                            latitude :  ''
                        }]
                };
                $scope.items.push(val);
                $scope.ready_upload_img.push(false);
            }
            
            $scope.ready_upload_img = [false];
            $scope.add_img = function(num){
                console.log(num);
                $scope.ready_upload_img[num] = true;
            }
    
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
                    
                    $scope.shared.address.street = $scope.addresses[0]+" "+$scope.addresses[1];
                    $scope.shared.address.city = $scope.addresses[2];
                    $scope.shared.address.state = $scope.addresses[3];
                    $scope.shared.address.zipcode = $scope.addresses[4];
                    
                   // console.log($scope.steps[1].address.zipcode);
                    geocoder.geocode({ 'address' : $scope.shared.address.full}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                            
                            $scope.shared.latitude = results[0].geometry.location.lat();
                            $scope.shared.longitude = results[0].geometry.location.lng();
                            console.log($scope.shared);
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
            
            $scope.removeImage = function(url,num){
                if(userService.getItemDraft().state == 'update'){
                    requestService.GetItem({id:userService.getItemDraft()[0].id},function(res){
                        $scope.items[num].steps[0].images = res.data[0].images;
                        var index =$scope.items[num].steps[0].images.indexOf(url);
                        $scope.items[num].steps[0].images.splice(index, 1);
                        if($scope.items[num].steps[0].images.length == 0)
                            $scope.items[num].steps[0].cover = '';
                        else
                            $scope.items[num].steps[0].cover = $scope.items[num].steps[0].images[0];

                        requestService.ItemStepPost({id:userService.getItemDraft()[0].id , step:1}, $scope.items[num].steps[0], function(res){
                            console.log(res);
                            requestService.GetItem({id:userService.getItemDraft()[0].id},function(res){
                                $scope.items[num].steps[0].images = res.data[0].images;
                                $scope.items[num].steps[0].cover = res.data[0].cover;
                            });
                        });
                    });
                }else{
                    requestService.GetItemDraft({id:userService.getItemDraft()[0].id},function(res){

                        $scope.items[num].steps[0].images = res.data[num].steps[0].images;
                        console.log(res, $scope.steps[0].items[0].images,url);
                        var index = $scope.items[num].steps[0].images.indexOf(url);
                        $scope.items[num].steps[0].images.splice(index, 1);
                        if($scope.items[num].steps[0].images.length == 0)
                            $scope.items[num].steps[0].cover = '';
                        else
                            $scope.items[num].steps[0].cover = $scope.items[num].steps[0].images[0];

                        requestService.StepPost({id:userService.getItemDraft()[0].id , step:1}, $scope.items[num].steps[0], function(res){
                            console.log(res);
                            requestService.GetAptDraft({id:userService.getItemDraft()[0].id},function(res){
                                $scope.items[num].steps[0].images = res.data[num].steps[0].images;
                                $scope.items[num].steps[0].cover = res.data[num].steps[0].cover;
                            });
                        });
                    });
                }
            };
    
            $scope.$watch('files', function (newValue, oldValue) {
                //files:image upload model
                //if(!angular.equals(newValue, oldValue)&& newValue !== [])
                //    console.log(newValue);
                console.log($scope.files);
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
                                url: 'http://52.25.82.212:8080/item/m_upload_image',
                                file: key.file,
                                fileFormDataName: 'item'
                            }).progress(function (evt) {
                                key.prog = parseInt(100.0 * evt.loaded / evt.total);
                            }).success(function (data, status, headers, config) {
                                //console.log('file ' + config.file.name + 'uploaded. Response: ');
                                console.log($scope.arrUploads);
                                key.saved = true;
                                key.id = 'https://s3.amazonaws.com/hereseas-public-images/'+data.data;
                                console.log(key.id);
                                
                                $scope.steps[0].images.push(key.id);
                                if($scope.steps[0].images.length == 1)
                                    $scope.steps[0].cover = $scope.steps[0].images[0];
                                $scope.arrUploads.splice($scope.arrUploads.indexOf(key), 1);
                                $scope.files.splice($scope.files.indexOf(key.file), 1);

                                requestService.ItemStepPost({id:userService.getItemDraft().id , step:1}, $scope.steps[0], function(res){
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

            $scope.shared = {
                expireAt : '',
                address : {
                    street :  '',
                    apt :       '',
                    city :     '',
                    state :    '',
                    zipcode :  '',
                    full:   ''
                },
                longitude :  '',
                latitude :  ''
            }
            
            //the main model 
	       $scope.items = [{
                steps:[{
                            expireAt : '',
                            itemName: '',
                            category: '',
                             price: '',
                            description: '',
                            cover: '',
                            images : []
                            
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
                            longitude :  '',
                            latitude :  ''
                        }]
            }];
    
            /*$scope.ifShowSubmit = function(){
                return userService.getDraft().state !== "edit";
            };
    
            $scope.setEditModel = function(data){
                $scope.steps[0].beginDate = new Date(data.beginDate);
                $scope.steps[0].endDate = new Date(data.endDate);
                
                
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
                    $scope.steps[5].cover = data.cover;
                    $scope.steps[5].images = data.images;
                    console.log($scope.steps[5].images);
                }
            };
    
            
            if(!angular.equals(userService.getItemDraft(),[{}])){
                if(userService.getItemDraft().state == 'edit'){
                    requestService.getItemDraft({id:userService.getItemDraft().id}, function(res){
                        console.log("EDIT", res);

                        $scope.setEditModel(res.data[0]);                
                    })
                }
                else if(userService.getItemDraft().state == 'update'){
                    requestService.GetItem({id:userService.getItemDraft().id}, function(res){
                        console.log("UPDATE", res);
                        
                        $scope.setEditModel(res.data[0]);                
                    })
                }
            }*/
            
            //表格是否填完显示变化函数
            $scope.$watch('steps', function(){
                var s0 = 0; //initial step page 1
                var s2 = 0; //initial step page 3
                $scope.sn = 0; //initial whole pages
                //test if step page 0 is filled
                angular.forEach($scope.items, function(item){
                    if(item.steps[0].expireAt == '' || item.steps[0].itemName == null || item.steps[0].category == '' || item.steps[0].price == ''){
                        $scope.tableFilled[0].filled = false; 
                    }else{
                        $scope.tableFilled[0].filled = true;
                    }
                });
 
                //test if step page 1 is filled
                if($scope.shared.address.zipcode != '' && $scope.shared.address.zipcode != undefined){
                    $scope.tableFilled[1].filled = true;
                }else{
                    $scope.tableFilled[1].filled = false;
                }
         
              
                if($scope.sn == 0){
                    $scope.canPost = true;
                }else{
                    $scope.canPost = false;
                }
                if($scope.shared.address.zipcode != undefined) $scope.addressCorrect = true;
                else $scope.addressCorrect = false;
            }, true);
            
            
            function doPost() {//
                requestService.ItemStepPost({id:userService.getItemDraft().id , step:2}, $scope.steps[1], function(res){
                    console.log("step2",res);
                    requestService.EndItempost({id:userService.getItemDraft().id}, function(res){
                        console.log("final", res);
                        userService.setItemDraft({});
                        $mdDialog.hide();
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
                        if($scope.tableFilled[$scope.activePage-1].filled){
                            var schoolId = {schoolId: userService.getUser().schoolId};
                            //$scope.steps[0].totalMiles = $scope.mileage + $scope.mUnits;
                            if(angular.equals(userService.getItemDraft(), {})){
                                requestService.StartItempost(schoolId, function(res){
                                    console.log(res);
                                    userService.setItemDraft({id:res.data._id, state:"post"});
                                    requestService.ItemStepPost({id:userService.getItemDraft().id , step:1}, $scope.steps[0], function(res){
                                        console.log(res);
                                    });
                                });

                            }else{
                                requestService.ItemStepPost({id:userService.getItemDraft().id , step:1}, $scope.steps[0], function(res){
                                    console.log(res);
                                });
                            }
                        }
                    }else{
                        if(!angular.equals(userService.getItemDraft(),{}) && $scope.tableFilled[$scope.activePage-1].filled){
                            console.log($scope.steps[$scope.activePage-1], $scope.activePage);
                            requestService.ItemStepPost({id:userService.getItemDraft().id , step:$scope.activePage}, $scope.steps[$scope.activePage-1], function(res){
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

hereseasApp.controller('ItemsDisplayController', function ($state, $scope, roomService, $stateParams, languageService, requestService,$mdDialog) {
    console.log($stateParams.itemId);
    // display single old stuff
    function itemSetMap(){
        // initial map
                var myLatLng = {};
                var item = {
                    cover:'/app/view/img/items/items_favor.png',
                    isfavor: true,
                    price:'250',
                    userAvatar:'/app/view/img/user/img1.JPG',
                    latitude:'38.9131296',
                    longitude:'-77.00652760000003'
                };
                myLatLng.lat = parseFloat(item.latitude);
                myLatLng.lng = parseFloat(item.longitude);             

                // Create a map object and specify the DOM element for display.
                var map = new google.maps.Map(document.getElementById('itemMap'), {
                    center: myLatLng,
                    scrollwheel: true,
                    zoom: 12
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
                price = item.price;
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
    };
    itemSetMap();
});