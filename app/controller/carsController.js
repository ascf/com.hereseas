hereseasApp.controller('AllCarsController',function($scope,$stateParams,requestService,userService){
    
    var cur_page = 1;
    var max_page = 1;

    $scope.min_price = 0;
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
            //console.log(res);
            if(res.result){
                //console.log(res.data);
                var cars = res.data.cars;
                $scope.carsResult = cars;
                
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
                for(var i=0; i<cars.length; i++){
                    myLatLng[i]={};
                    myLatLng[i].lat = parseFloat(cars[i].latitude);
                    myLatLng[i].lng = parseFloat(cars[i].longitude);
                    myLatLng[i].price = cars[i].price;
                }
                cluster_ll = {};
                for(var i=0; i < cars.length; i++){
                    if(cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng]!=undefined){
                        cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].length++;
                        cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].text += '$'+myLatLng[i].price+'; ';
                        if(cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].length==3){
                            cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].text += '</br>';
                        }
                        
                    }else{
                        cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng] = {};
                        cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].text = '';
                        cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].text += '$'+myLatLng[i].price+'; ';
                        cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].ll = {};
                        cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].ll.lat = myLatLng[i].lat;
                        cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].ll.lng = myLatLng[i].lng;
                        cluster_ll[myLatLng[i].lat+','+myLatLng[i].lng].length = 1;

                    }
                }
                // Create a map object and specify the DOM element for display.
                var map = new google.maps.Map(document.getElementById('carsMap'), {
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
                $scope.carsResult = []; 
            }
        });
    };
    updatePage();
    
    $scope.setStyle = function(style){
        $scope.selectData.category = style;
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

hereseasApp.controller('CarDisplayController', function ($state, $scope, $stateParams, languageService, requestService,$mdDialog,userService,alertService,$cookies) {         
    requestService.GetCar({id: $stateParams.carId}, function(res){
        
        if(res.result){
            console.log(res);
            $scope.data = res.data[0];
            $scope.addFav = addFav;
            $scope.delFav = delFav;
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
                if($cookies.login=='true'){
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

        
            $scope.images = [];
            for(var i=0; i<$scope.data.images.length; i++)
                $scope.images.push({thumb:$scope.data.images[i], img: $scope.data.images[i]});
            //console.log($scope.images);
            

            if($cookies.login=='true'){
                requestService.GetFavList(function(res){
                    //console.log(res);
                    if(res.data.cars !== null)
                        $scope.favoriteCars = res.data.cars;
                    else $scope.favoriteCars = [];

                    $scope.isFav = $scope.favoriteCars.indexOf($stateParams.carId) !== -1;
                });
            }
            
            
            
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

            
   

            
            requestService.GetUser({id: $scope.data.userId},function(res){
                //console.log(res.data)
                $scope.seller = res.data;
            });
            

            requestService.GetSchool({id: $scope.data.schoolId}, function(res) {
                if (res.result) {
                    //console.log(res.data);
                    $scope.schoolName = res.data.name;
                    
                } else {
                    //http get school id error
                }
            });
            
            $scope.showOtherUserInfo = function(othersId){
                $state.go('othersProfile',{schoolId:$scope.data.schoolId,othersId:othersId}); 
            }
            
            $scope.name = name;
           
            function name(name) {
                return languageService.getChineseName(name);
            };
            
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
                    //console.log($scope.steps[4].address.zipcode);
                    geocoder.geocode({ 'address' : $scope.steps[4].address.full}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            //console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                            
                            $scope.steps[4].latitude = results[0].geometry.location.lat();
                            $scope.steps[4].longitude = results[0].geometry.location.lng();
                            //console.log($scope.steps[4]);
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
                            //console.log(res);
                            requestService.GetCar({id:userService.getCarDraft().id},function(res){
                                $scope.steps[5].images = res.data[0].images;
                                $scope.steps[5].cover = res.data[0].cover;
                            });
                        });
                    });
                }else{
                    requestService.GetCarDraft({id:userService.getCarDraft().id},function(res){

                        $scope.steps[5].images = res.data[0].images;
                        //console.log(res, $scope.steps[5].images,url);
                        var index = $scope.steps[5].images.indexOf(url);
                        $scope.steps[5].images.splice(index, 1);
                        if($scope.steps[5].images.length == 0)
                            $scope.steps[5].cover = '';
                        else
                            $scope.steps[5].cover = $scope.steps[5].images[0];

                        requestService.CarStepPost({id:userService.getCarDraft().id , step:6}, $scope.steps[5], function(res){
                            //console.log(res);
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
                                url: 'http://54.84.228.184/car/m_upload_image',
                                file: key.file,
                                fileFormDataName: 'car'
                            }).progress(function (evt) {
                                key.prog = parseInt(100.0 * evt.loaded / evt.total);
                            }).success(function (data, status, headers, config) {
                                //console.log('file ' + config.file.name + 'uploaded. Response: ');
                                //console.log($scope.arrUploads);
                                key.saved = true;
                                key.id = 'https://s3.amazonaws.com/hereseas-public-images/'+data.data;
                                //console.log(key.id);
                                
                                $scope.steps[5].images.push(key.id);
                                if($scope.steps[5].images.length == 1)
                                    $scope.steps[5].cover = $scope.steps[5].images[0];
                                $scope.arrUploads.splice($scope.arrUploads.indexOf(key), 1);
                                $scope.files.splice($scope.files.indexOf(key.file), 1);

                                requestService.CarStepPost({id:userService.getCarDraft().id , step:6}, $scope.steps[5], function(res){
                                    //console.log(res);
                                });
                                
                            }).error(function (data, status, headers, config) {
                                alert('上传失败'+data);
                                //console.log('error status: ' + status);
                            })
                            
                            key.cancel = function(){
                                up.abort();     
                                $scope.arrUploads.splice($scope.arrUploads.indexOf(key), 1);
                                $scope.files.splice($scope.files.indexOf(key.file), 1);
                                //console.log("cancel during upload", $scope.files, $scope.arrUploads);
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
                    schoolId : userService.getUser().schoolId
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
               
                
                if(data.year !== undefined)
                    $scope.steps[0].year = data.year;
                if(data.make !== undefined)
                    $scope.steps[0].make = data.make;
                if(data.totalMiles !== undefined)
                    $scope.steps[0].totalMiles = data.totalMiles;
                if(data.category !== undefined)
                    $scope.steps[0].category = data.category;
                if(data.model !== undefined)
                    $scope.steps[0].model = data.model;
                if(data.style !== undefined)
                    $scope.steps[0].style = data.style;
                if(data.price !== undefined)
                    $scope.steps[0].price = data.price;
                if(data.boughtDate !== undefined)
                    $scope.steps[0].boughtDate = new Date(data.boughtDate);
                
                
                
                
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
                    //console.log($scope.steps[4].address);
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
                    //console.log($scope.steps[5].images);
                }
            };
    
            
            if(!angular.equals(userService.getCarDraft(),{})){
                if(userService.getCarDraft().state == 'edit'){
                    requestService.GetCarDraft({id:userService.getCarDraft().id}, function(res){
                        //console.log("EDIT", res);

                        $scope.setEditModel(res.data[0]);                
                    })
                }
                else if(userService.getCarDraft().state == 'update'){
                    requestService.GetCar({id:userService.getCarDraft().id}, function(res){
                        //console.log("UPDATE", res);
                        
                        $scope.setEditModel(res.data[0]);                
                    })
                }
            }
    
            $scope.$watch(function(){return $scope.steps[0];}, function(newValue){
                if(newValue.year == '' || newValue.make == '' || newValue.totalMiles == '' || newValue.category == '' || newValue.model == '' || newValue.price == '' || newValue.boughtDate == undefined)
                    $scope.tableFilled[0].filled = false; 
                else{
                    $scope.tableFilled[0].filled = true; 
                    if(angular.equals(userService.getCarDraft(), {})){
                        requestService.StartCarpost($scope.steps[0], function(res){
                            userService.setCarDraft({id:res.data._id, state:"post"});
                            
                            requestService.CarStepPost({id:userService.getCarDraft().id , step:3}, $scope.steps[2], function(res){
                                //console.log(res);
                            });
                            
                            //console.log(res);
                        });
                    }else{
                        requestService.CarStepPost({id:userService.getCarDraft().id , step:1}, $scope.steps[0], function(res){
                            //console.log(res);
                        });
                    }
                }
            }, true);

            
            //表格是否填完显示变化函数
            $scope.$watch('steps', function(){
                //console.log($scope.steps);
                var s0 = 0; //initial step page 1
                var s2 = 0; //initial step page 3
                $scope.sn = 0; //initial whole pages
                //test if step page 0 is filled
                
                
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
                
                if(userService.getCarDraft().state=='update'){
                    if($scope.activePage == 1){
                        requestService.CarStepPost({id:userService.getCarDraft().id , step:1}, $scope.steps[0], function(res){
                            $mdDialog.hide();
                            $location.path('/cars/'+userService.getCarDraft().id);
                        });
                    }else if($scope.activePage == 3){
                        requestService.CarStepPost({id:userService.getCarDraft().id , step:$scope.activePage}, $scope.steps[$scope.activePage-1], function(res){
                            $mdDialog.hide();
                            $location.path('/cars/'+userService.getCarDraft().id);
                        });
                    }else{
                        if(!angular.equals(userService.getCarDraft(),{}) && $scope.tableFilled[$scope.activePage-1].filled){
                            requestService.CarStepPost({id:userService.getCarDraft().id , step:$scope.activePage}, $scope.steps[$scope.activePage-1], function(res){
                                $mdDialog.hide();
                                $location.path('/cars/'+userService.getCarDraft().id);
                            });
                        }
                    }
                }
                
                requestService.CarStepPost({id:userService.getCarDraft().id , step:6}, $scope.steps[5], function(res){
                    //console.log("step6",res);
                    requestService.EndCarpost({id:userService.getCarDraft().id}, function(res){
                        //console.log("final", res);
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
                    if($scope.activePage == 1){
                        requestService.CarStepPost({id:userService.getCarDraft().id , step:1}, $scope.steps[0], function(res){
                            console.log(res);
                        });
                    }else if($scope.activePage == 3){
                        requestService.CarStepPost({id:userService.getCarDraft().id , step:$scope.activePage}, $scope.steps[$scope.activePage-1], function(res){
                            console.log(res);
                        });
                    }else{
                        if(!angular.equals(userService.getCarDraft(),{}) && $scope.tableFilled[$scope.activePage-1].filled){
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