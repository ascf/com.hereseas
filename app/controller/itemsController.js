hereseasApp.controller('ItemsController',function($stateParams,$scope,requestService,userService){
    
    var cur_page = 1;
    var max_page = 1;
    
    $scope.selectData = {
        id : $stateParams.schoolId, 
        page:cur_page,
        pageSize:6,
        category:'',
        startPrice:'',
        endPrice:'',
    };
    
    $scope.schoolId = $stateParams.schoolId;
    
    function updatePage(){
        requestService.GetItemsBySchool($scope.selectData,
        function(res){
            //console.log(res);
            if(res.result){
                //console.log(res.data);
                var items = res.data.items;
                $scope.itemsResult = items;
                
                // store number of max pages
                max_page = res.data.totalPage;
                $scope.pages = [];
                $scope.pages_pre_dot = false;
                $scope.pages_end_dot = false;
                for(var i=0; i<max_page; i++){
                    $scope.pages[i] = {};
                    $scope.pages[i].id = i+1;
                    
                    if(i == cur_page-1){
                        $scope.pages[i].selected = true;
                        $scope.pages[i].show = true;
                    }else{
                        $scope.pages[i].selected = false;
                    }
                    
                    if(i < cur_page -1){
                        if(i > cur_page-4){
                            $scope.pages[i].show = true;
                        }else{
                            $scope.pages[i].show = false;
                            $scope.pages_pre_dot = true;
                        }
                    }
                    
                    if(i > cur_page -1){
                        if(i < cur_page+2){
                            $scope.pages[i].show = true;
                        }else{
                            $scope.pages[i].show = false;
                            $scope.pages_end_dot = true;
                        }
                    }
                }

                // initial map
                var myLatLng=[];
                //var apts = res.data.apartments;
                for(var i=0; i < items.length; i++){
                    myLatLng[i]={};
                    myLatLng[i].lat = parseFloat(items[i].latitude);
                    myLatLng[i].lng = parseFloat(items[i].longitude);
                    myLatLng[i].price = items[i].price;
                }
                cluster_ll = {};
                for(var i=0; i < items.length; i++){
                    if(cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng]!=undefined){
                        cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].length++;
                        cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].text += '$'+myLatLng[i].price+';';
                        if(cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].length==3){
                            cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].text += '</br>';
                        }
                    }else{
                        cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng] = {};
                        cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].text = '';
                        cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].text += '$'+myLatLng[i].price+'; ';
                        cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].ll = {};
                        cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].length = 1;
                        cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].ll.lat = myLatLng[i].lat;
                        cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].ll.lng = myLatLng[i].lng;
                    }
                }

                // Create a map object and specify the DOM element for display.
                var map = new google.maps.Map(document.getElementById('itemsMap'), {
                    center: cluster_ll[myLatLng[0].lat+','+myLatLng[0].lng].ll,
                    scrollwheel: false,
                    zoom: 12,
                });

                // Origins, anchor positions and coordinates of the marker increase in the X
                // direction to the right and in the Y direction down.
//                var image = {
//                    url: '/app/view/img/apts/marker_big.png',
//                    // This marker is 58 pixels wide by 24 pixels high.
//                    size: new google.maps.Size(116, 48),
//                    // The origin for this image is (0, 0).
//                    origin: new google.maps.Point(0, 0),
//                    // The anchor for this image is the base of the flagpole at (0, 24).
//                    anchor: new google.maps.Point(70, 48)
//                };
                // Shapes define the clickable region of the icon. The type defines an HTML
                // <area> element 'poly' which traces out a polygon as a series of X,Y points.
                // The final coordinate closes the poly by connecting to the first coordinate.
//                var shape = {
//                    coords: [0, 0, 0, 48, 116, 48, 116, 0],
//                    type: 'poly'
//                };

                var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                var labelIndex = 0;
                
                for(var cll in cluster_ll){
                    var marker = new google.maps.Marker({
                        map: map,
                        position: cluster_ll[cll].ll,
                        label: labels[labelIndex++ % labels.length],
                        draggable: false,
        
                    });
                }
            }else{
                $scope.itemsResult = [];
            }
        });
    };
    updatePage();
    
    $scope.setCategory = function(category){
        $scope.selectData.category = category;
        $scope.setPage(0);
        
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
        //console.log($scope.selectData.hasPark);
        updatePage();
    }
    
});

hereseasApp.controller('ItemsPostController', function ($scope, $location, languageService, userService, alertService, $state, $mdDialog, Upload, fileReader, requestService,$filter,$cookies) {
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
                            schoolId :$cookies['schoolId'],
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
                //console.log($scope.files);
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
                            //console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                            
                            $scope.shared.latitude = results[0].geometry.location.lat();
                            $scope.shared.longitude = results[0].geometry.location.lng();
                            //console.log($scope.shared);
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
                    //console.log($scope.items.uploadList);
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
                                url: userService.getHost()+'/item/m_upload_image',
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
                                //console.log('error status: ' + status);
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
                            schoolId :$cookies['schoolId'],
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
                 
                
                //test if all tables are filled
                if(!$scope.tableFilled[0].filled && !$scope.tableFilled[1].filled){$scope.sn = 2;}
                else if($scope.tableFilled[0].filled && $scope.tableFilled[1].filled){$scope.sn = 0;}
                else $scope.sn = 1;
                if($scope.sn == 0){
                    $scope.canPost = true;
                }else{
                    $scope.canPost = false;
                }
            }, true);
            
            
            function doPost() {//
                $scope.postedNum = 0;
                angular.forEach($scope.items, function(item){
                    item.steps[0].expireAt = $scope.shared.expireAt;
                    item.steps[1].address = $scope.shared.address;
                    item.steps[1].longitude = $scope.shared.longitude;
                    item.steps[1].latitude = $scope.shared.latitude;
                    
                    
                    requestService.StartItempost(item.steps[0], function(res){
                        console.log(item.steps[0],res);
                        var draftId = res.data._id;
                        requestService.ItemStepPost({id:draftId , step:2}, item.steps[1], function(res){
                            console.log("step2",res);
                            requestService.EndItempost({id:draftId}, function(res){
                                console.log("final", res);
                                if(res.result){
                                    $scope.postedNum = $scope.postedNum + 1;
                                    if($scope.postedNum == $scope.items.length){
                                        $mdDialog.hide();
                                        $location.path('/items/'+res.data._id);
                                    } 
                                }else{
                                    alert('发布失败');                       
                                }
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
                
                $scope.activePage = page;
            };

            function name(name) {
                return languageService.getChineseName(name);
            };

});

hereseasApp.controller('ItemsDisplayController', function ($state, $scope, roomService, $stateParams, languageService, requestService,$mdDialog,userService,alertService,$cookies) {
    
    $scope.addFav = addFav;
    $scope.delFav = delFav;
    $scope.sendMessage = sendMessage;
    $scope.hasMore = false;

    if($cookies.login == 'true'){
        requestService.GetFavList(function(res){
            //console.log(res);
            if(res.data.items !== null)
                $scope.favoriteItems = res.data.items;
            else $scope.favoriteItems = [];

            $scope.isFav = $scope.favoriteItems.indexOf($stateParams.itemId) !== -1;
        });
    }
    
    function delFav(){ 
        userService.deleteFavorite({
            id:$stateParams.itemId,
            category:"items"
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
        if($cookies.login == 'true'){
            userService.postFavorite({
                id: $stateParams.itemId,
                category: "items"
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
    
    function sendMessage(ev) {
        if($cookies.login == 'true'){
            $mdDialog.show({
                controller:['$scope', 'recvId', function($scope, recvId) { 
                    $scope.content = '';
                    $scope.sendmessage = function() {
                        //console.log($scope.content);

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
                    recvId : $scope.item.userId
                }

            });
        }else{
            alertService.alert("请登录").then(function() {
                $scope.$broadcast('login', '1');
            });
        }
    };
    // display single old stuff 
    $scope.goToEach = function(index){
        //console.log(index);
        switch($scope.otherItems[index].identity){
            case 1:$state.go('rooms',{aptId:$scope.otherItems[index].content._id});break;
            case 2:$state.go('cars',{carId:$scope.otherItems[index].content._id});break;
            case 3:$state.go('items',{itemId:$scope.otherItems[index].content._id});break;
        }
    };
    
    function itemSetMap(){
        requestService.GetItem({id: $stateParams.itemId}, function(res) {
            if (res.result) {
                //console.log(res.data);
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
                        //console.log(res.data);
                        $scope.otherItems = res.data;
                        if($scope.otherItems.length>9){
                            $scope.hasMore = true;
                        }
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
                 $state.go('home');      
            } 
        });   
    };
    itemSetMap();
    
    $scope.showOtherUserInfo = function(othersId){
        $state.go('othersProfile',{schoolId:$scope.item.schoolId,othersId:othersId}); 
    }
});