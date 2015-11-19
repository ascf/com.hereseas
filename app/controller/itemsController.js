hereseasApp.controller('ItemsController',function($stateParams,$scope,requestService,userService){
    
    var cur_page = 1;
    var max_page = 1;
    
    $scope.selectData = {
        id : $stateParams.schoolId, 
        page:1,
        pageSize:4,
        category:'',
        startPrice:'',
        endPrice:'',
    };
    
    
    
    function updatePage(){
        requestService.GetItemsBySchool($scope.selectData,
        function(res){
            console.log(res);
            if(res.result){
                console.log(res.data);
                var items = res.data.items;
                $scope.itemsResult = items;
                
                // store number of max pages
                max_page = res.data.totalPage;
                $scope.pages = [];
                for(var i=0; i<max_page; i++){
                    $scope.pages[i] = {};
                    $scope.pages[i].id = i+1;             
                }

                // initial map
                var myLatLng=[];
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
                    var marker = new MarkerWithLabel({
                        map: map,
                        position: myLatLng[i],
                        icon: image,
                        shape: shape,
                        labelContent: items[i].price,
                        draggable: false,
                        labelClass: "labels",
                        labelAnchor: new google.maps.Point(30, 22)
                    });   
                }
            }else{
                $scope.favsItems = [];
                $scope.notFavsItems = []; 
            }
        });
    };
    updatePage();
    
    $scope.setCategory = function(category){
        $scope.selectData.category = category;
        updatePage();
    };
    
});

hereseasApp.controller('ItemsPostController', function ($scope, languageService, userService, alertService, $state, $mdDialog, Upload, fileReader, requestService,$filter) {
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
            //表格是否填完变量
            $scope.tableFilled = [
                {filled: false},
                {filled: false}
            ];
    
            $scope.hide = function() {
                //userService.setItemDraft([{}]);
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
    
            $scope.add_img = function(){
                for(var i = 0; i<$scope.ready_upload_img.length; i++)
                    $scope.ready_upload_img[i] = true;
                console.log($scope.files);
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
//                if(userService.getItemDraft().state == 'update'){
//                    requestService.GetItem({id:userService.getItemDraft()[0].id},function(res){
//                        $scope.items[num].steps[0].images = res.data[0].images;
//                        var index =$scope.items[num].steps[0].images.indexOf(url);
//                        $scope.items[num].steps[0].images.splice(index, 1);
//                        if($scope.items[num].steps[0].images.length == 0)
//                            $scope.items[num].steps[0].cover = '';
//                        else
//                            $scope.items[num].steps[0].cover = $scope.items[num].steps[0].images[0];
//
//                        requestService.ItemStepPost({id:userService.getItemDraft()[0].id , step:1}, $scope.items[num].steps[0], function(res){
//                            console.log(res);
//                            requestService.GetItem({id:userService.getItemDraft()[0].id},function(res){
//                                $scope.items[num].steps[0].images = res.data[0].images;
//                                $scope.items[num].steps[0].cover = res.data[0].cover;
//                            });
//                        });
//                    });
//                }else{
//                    requestService.GetItemDraft({id:userService.getItemDraft()[0].id},function(res){
//
//                        $scope.items[num].steps[0].images = res.data[num].steps[0].images;
//                        console.log(res, $scope.steps[0].items[0].images,url);
//                        var index = $scope.items[num].steps[0].images.indexOf(url);
//                        $scope.items[num].steps[0].images.splice(index, 1);
//                        if($scope.items[num].steps[0].images.length == 0)
//                            $scope.items[num].steps[0].cover = '';
//                        else
//                            $scope.items[num].steps[0].cover = $scope.items[num].steps[0].images[0];
//
//                        requestService.StepPost({id:userService.getItemDraft()[0].id , step:1}, $scope.items[num].steps[0], function(res){
//                            console.log(res);
//                            requestService.GetAptDraft({id:userService.getItemDraft()[0].id},function(res){
//                                $scope.items[num].steps[0].images = res.data[num].steps[0].images;
//                                $scope.items[num].steps[0].cover = res.data[num].steps[0].cover;
//                            });
//                        });
//                    });
//                }
            };

            /*$scope.$watch(function(){return JSON.stringify($scope.files)}, function (newValue,oldValue) {
                //console.log(newValue);
                if(!angular.equals(newValue, oldValue)&& newValue !== [])
                   $scope.upload($scope.files, $scope.curItemIndex);
            },true);*/
            
            /*$scope.$watch(function(){return $scope.items.map(function(item){return item.files;});}, function (newValue,oldValue) {
                //angular.forEach(newValue, function(key){
                //    if(!angular.equals(key, oldValue[newValue.indexOf(key)])&& key !== [] && key !== null)
                //        console.log(newValue, oldValue );
                //});
                console.log(newValue);
            },true);   */
    
            
    
            $scope.changeFile = function(index){
                if($scope.items.files !== undefined){

                    
                    angular.forEach($scope.items.files, function(file){
                        var flag = true;
                        angular.forEach($scope.items.uploadList, function(upload){
                            if(angular.equals(upload.file, file) && index==upload.index){
                                flag = false;
                            }
                        });
                        if(flag){
                            $scope.items.uploadList.push({file: file, prog: 0,saved : false, cancel: "", url:"", index:index});
                        }
                    });
                    console.log($scope.items.uploadList);
                    $scope.upload($scope.items.uploadList);
                }
            };
    
            $scope.upload = function (files) {
                if (files && files.length) {
                    
                    angular.forEach(files, function(key){
                        if(key.saved == false)
                        {
                            fileReader.readAsDataUrl(key.file, $scope).then(function(result) {
                                key.url = result;
                            });
                            var up = Upload.upload({
                                url: 'http://52.25.82.212:8080/item/m_upload_image',
                                file: key.file,
                                fileFormDataName: 'item'
                            }).progress(function (evt) {
                                key.prog = parseInt(100.0 * evt.loaded / evt.total);
                            }).success(function (data, status, headers, config) {
                                key.saved = true;
                                key.url = 'https://s3.amazonaws.com/hereseas-public-images/'+data.data;

                                $scope.items[key.index].steps[0].images.push(key.url);
                                if($scope.items[key.index].steps[0].images.length == 1)
                                    $scope.items[key.index].steps[0].cover = key.url;
                                
                                key.cancel = function(){
                                    $scope.items.uploadList.splice($scope.items.uploadList.indexOf(key), 1);
                                    $scope.items[key.index].steps[0].images.splice($scope.items[key.index].steps[0].images.indexOf(key.url), 1);
                                    if($scope.items[key.index].steps[0].images.length == 0)
                                        $scope.items[key.index].steps[0].cover = "";
                                    //console.log("cancel after upload");
                                };
                                
                            }).error(function (data, status, headers, config) {
                                console.log('error status: ' + status);
                            })
                            
                            key.cancel = function(){
                                up.abort();     
                                $scope.items.uploadList.splice($scope.items.uploadList.indexOf(key), 1);
                                //console.log("cancel during upload");
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
            
            $scope.items.files = [];
            $scope.items.uploadList = [];
           
            $scope.deleteItem = function(index){
                $scope.items.splice(index,1);
                $scope.ready_upload_img.splice(index,1);
            };
    
    
            
            //表格是否填完显示变化函数
            $scope.$watch(function(){ return{v1:$scope.shared, v2:$scope.items};}, function(newValue){

                angular.forEach($scope.items, function(item){
                    if($scope.shared.expireAt == '' || item.steps[0].itemName == '' || item.steps[0].category == '' || item.steps[0].price == '' || item.steps[0].images.length==0){
                        $scope.tableFilled[0].filled = false; 
                    }else{
                        $scope.tableFilled[0].filled = true;
                    }
                });
              
                if(newValue.v1.address.zipcode == '' || newValue.v1.address.zipcode == undefined){
                    $scope.tableFilled[1].filled = false;
                }else{
                    $scope.tableFilled[1].filled = true;
                }
                 
                if(newValue.v1.address.zipcode != undefined) 
                    $scope.addressCorrect = true;
                else 
                    $scope.addressCorrect = false;
                 
                
                if($scope.tableFilled[0].filled && $scope.tableFilled[1].filled){
                    $scope.canPost = true;
                }else{
                    $scope.canPost = false;
                }
            }, true);
            
            
            function doPost() {//
                angular.forEach($scope.items, function(item){
                    item.steps[0].expireAt = $scope.shared.expireAt;
                    item.steps[1].address = $scope.shared.address;
                    item.steps[1].longitude = $scope.shared.longitude;
                    item.steps[1].latitude = $scope.shared.latitude;
                    
                    
                    requestService.StartItempost({schoolId:userService.getUser().schoolId}, function(res){
                        var draftId = res.data._id;
                        requestService.ItemStepPost({id:draftId , step:1}, item.steps[0], function(res){
                            console.log("step1",res);
                            requestService.ItemStepPost({id:draftId , step:2}, item.steps[1], function(res){
                                console.log("step2",res);
                                requestService.EndItempost({id:draftId}, function(res){
                                    console.log("final", res);
                                   // userService.setItemDraft({});
                                    $mdDialog.hide();
                                });
                            });
                        });
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
                /*if($scope.activePage == page){
                    
                } else{
                    console.log($scope.activePage);
                    if($scope.activePage == 1){
                        if($scope.tableFilled[$scope.activePage-1].filled){
                            var schoolId = {schoolId: userService.getUser().schoolId};
                            //$scope.steps[0].totalMiles = $scope.mileage + $scope.mUnits;
                            angular.forEach($scope.items, function(item){
                                if(angular.equals(item.draftId, '')){
                                    requestService.StartItempost(schoolId, function(res){
                                        console.log(res);
                                        item.draftId = res.data._id;
                                            //userService.setItemDraft({id:item.draftId, state:"post"});
                                        requestService.ItemStepPost({id:item.draftId, step:1}, item.steps[0], function(res){
                                            console.log(res);
                                        });
                                    });
                                }else{
                                    requestService.ItemStepPost({id:item.draftId, step:1}, item.steps[0], function(res){
                                        console.log(res);
                                    });
                                }
                            });
                        }
                    }else{
                        if($scope.tableFilled[$scope.activePage-1].filled){
                            console.log($scope.steps[$scope.activePage-1], $scope.activePage);
                            angular.forEach($scope.items, function(item){
                                requestService.ItemStepPost({id:item.draftId, step:$scope.activePage}, item.steps[$scope.activePage-1], function(res){
                                console.log(res);
                                });
                            });
                        }
                    }
                }*/
                $scope.activePage = page;
            };

            function name(name) {
                return languageService.getChineseName(name);
            };

});

hereseasApp.controller('ItemsDisplayController', function ($state, $scope, roomService, $stateParams, languageService, requestService,$mdDialog) {
    // display single old stuff 
    $scope.goToEach = function(index){
        console.log(index);
        switch($scope.otherItems[index].identity){
            case 1:$state.go('rooms',{aptId:$scope.otherItems[index].content._id});break;
            case 2:$state.go('cars',{carId:$scope.otherItems[index].content._id});break;
            case 3:$state.go('items',{itemId:$scope.otherItems[index].content._id});break;
        }
    };
    
    function itemSetMap(){
        requestService.GetItem({id: $stateParams.itemId}, function(res) {
            if (res.result) {
                console.log(res.data);
                $scope.item = res.data[0];
                var myLatLng = {};
                var item = $scope.item;
                
                requestService.GetSchool({id: item.schoolId}, function(res) {
                    if (res.result) {
                        $scope.schoolName = res.data.name;
                    } else {
                                //http get school id error
                    }
                });
                
                requestService.GetOtherItems({id:item.userId, itemId:item._id}, function(res) {
                    if (res.result) {
                        console.log(res.data);
                        $scope.otherItems = res.data;
                    } else {
                                //http get school id error
                    }
                });
                
                
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
            }else{
                       
            } 
        });   
    };
    itemSetMap();
});