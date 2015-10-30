hereseasApp.controller('ProfileController', function ($state, $scope,$timeout,requestService,userService, Upload, fileReader, $window,$cookies) {
    requestService.GetUserSelf(function (res) {
        console.log("userself", res);
        if (res.result){
                        
            var geocoder = new google.maps.Geocoder();
            $scope.options1 = null;
            $scope.details1 = '';
            $scope.addresses = [];
            $scope.addressGot = false;        //控制页面上是否显示解析后地址  
            $scope.addressCorrect = false;     //判断地址是否正确
            $scope.validAddress = validAddress; //判断地址是否合法
            
             //基本信息model
            $scope.basicInfo = {
                username : '',
                schoolId : '',
                enrollYear :'',
                enrollSeason:''
            };
            //地址信息model
            $scope.address ={
                 street :  '',
                 apt :       '',
                 city :     '',
                 state :    '',
                 zipcode :  '',
                 full:   ''
            };
            
            $scope.setPostPage = setPostPage;
            $scope.setActivePage = setActivePage;
            
            $scope.setActiveTab = setActiveTab;
            $scope.updateMsgs = updateMsgs;
            $scope.getUnreadMsgsNum = getUnreadMsgsNum;
            $scope.initMessages = initMessages;
            
            $scope.filterApt = true;
            $scope.filterCar = true;
            $scope.filterGood = true;
            $scope.filterActivity = true;
            $scope.postType2 = "Apts";
            $scope.content = "Hello World ";
            $scope.postPage = 1;
            $scope.activePage = 1;
            $scope.activeTab = 1;
            
            $scope.numPosted = 1;
            $scope.numToPost = 1;
            $scope.numDeal = 0;

            $scope.messages = [];
            $scope.numNotify = 0;
            var popWindows = [];
            
            $scope.initProfiles = initProfiles;//初始化个人信息内容函数
            
            $scope.intiFavorite = intiFavorite;
            $scope.deleteFavorite = deleteFavorite;
            
            $scope.deleteCar = deleteCar;
            $scope.getCars = getCars;
            $scope.getCarDrafts = getCarDrafts;
            
            $scope.deleteApt = deleteApt;
            $scope.getApts = getApts;
            $scope.getAptDrafts = getAptDrafts;
            
            $scope.img = undefined;
            
            $scope.initProfiles();
            $scope.intiFavorite();
            $scope.initMessages();
            
            $scope.getApts(true);
            $scope.getAptDrafts(true);
            $scope.getCars(true);
            $scope.getCarDrafts(true);
            
            function intiFavorite(){
                requestService.GetFavList({action:''}, function(res){
                    //console.log(res);
                    if(res.data.apartments !== null)
                        $scope.favoriteApts = res.data.apartments;
                    else $scope.favoriteApts = [];

                    if(res.data.activities !== null)
                        $scope.favoriteActs = res.data.activities;
                    else $scope.favoriteActs = [];

                    if(res.data.cars !== null)
                        $scope.favoriteCars = res.data.cars;
                    else $scope.favoriteCars = [];

                    if(res.data.items !== null)
                        $scope.favoriteItems = res.data.items;
                    else $scope.favoriteItems = [];
                });
            };

            
            function deleteFavorite(index){
                var id = $scope.favoriteApts[index]._id;
                userService.deleteFavorite({
                    id:id,
                    category:"apartments"
                }).then(function (res) {
                    console.log(res);
                    if (res.result) {
                        //alert("Message has been sent");
                    } else {
                        //alert("err");
                    }
                });
                
                $scope.favoriteApts.splice(index, 1);
                
                var temp = [];
                angular.forEach($scope.favoriteApts, function(key){
                    temp.push(key._id);
                });
                var favoriteList = userService.cookies2Favorite();
                favoriteList.apartments = temp;
                userService.saveFavorite2Cookies(favoriteList);
            };
            
            function deleteCar(index, id, type){
                if(type == 1){
                    $scope.localCars.splice(index, 1);
                }
                else{
                    $scope.localDraftCars.splice(index, 1);
                }
                
                requestService.DeleteCar({id:id}, function(res){
                    console.log(id,res);
                });
            };
            
            function getCars(init){
                requestService.GetCars(function(res) {
                    if(res.result==false)
                    {
                        $scope.hasPostedCars = false;
                    }
                    else
                    {
                        $scope.hasPostedCars = true;
                        $scope.cars = res.data;
                        if(init == true)
                            $scope.localCars = $scope.cars;
                        console.log($scope.localCars);
                    }
                });
            };
            
            function getCarDrafts(init){
                requestService.GetCarDrafts(function(res){
                    if(res.result == false){
                        $scope.hasDraftCars = false;
                    }else{
                        $scope.hasDraftCars = true;
                        $scope.carDrafts = res.data;
                        if(init == true)
                            $scope.localDraftCars = $scope.carDrafts;
                    }
                });
            };
            
            function deleteApt(index, id, type){
                if(type == 1){
                    $scope.localApts.splice(index, 1);
                }
                else{
                    $scope.localDraftApts.splice(index, 1);
                }
                
                requestService.DeleteApt({id:id}, function(res){
                    console.log(id,res);
                });
            };
            
            
            function getApts(init){
                requestService.GetApts(function(res) {
                    if(res.result==false)
                    {
                        $scope.hasPostedApts = false;
                    }
                    else
                    {
                        $scope.hasPostedApts = true;
                        $scope.apts = res.data;
                        if(init == true)
                            $scope.localApts = $scope.apts;
                    }
                });
            };
            
            function getAptDrafts(init){
                 requestService.GetAptDrafts(function(res){
                    if(res.result == false){
                        $scope.hasDraftApts = false;
                    }else{
                        $scope.hasDraftApts = true;
                        $scope.aptDrafts = res.data;
                        if(init == true)
                            $scope.localDraftApts = $scope.aptDrafts;
                    }
                });
            };
            
            $scope.$watch('file', function (newValue, oldValue) {
                //console.log($scope.files, "old:", oldValue, "new:", newValue);
                if(!angular.equals(newValue, oldValue))
                    $scope.upload($scope.file);
            });
            
            $scope.upload = function (file) {
                if (file) {
                    console.log(file);
                   
                    console.log("111");
                    fileReader.readAsDataUrl(file, $scope).then(function(result) {
                        $scope.img = result;
                        //key.content = result;
                    });
                    var up = Upload.upload({
                        url: 'http://52.25.82.212:8080/avatar/m_upload_image',
                        file: file,
                        fileFormDataName: 'avatar'
                    }).progress(function (evt) {
                        $scope.prog = parseInt(100.0 * evt.loaded / evt.total);
                    }).success(function (data, status, headers, config) {
                        console.log('file ' + config.file.name + 'uploaded. Response: ');
                        console.log(data);
                        $scope.avatar = "https://s3.amazonaws.com/hereseas-public-images/"+data.data;
                        requestService.ChangeProfile({step:3}, {'avatar':$scope.avatar}, function(res){
                                console.log(res);
                            });
                    }).error(function (data, status, headers, config) {
                        console.log('error status: ' + status);
                    })
                }
            };
            function initMessages(){
                requestService.GetContact(function(res){
                    //console.log(res.contacts);
                    angular.forEach(res.contacts, function(key){
                        popWindows.push(null);
                        requestService.GetMsgs({userid:key}, function(res){
                            //console.log(res.data);
                            if(!angular.equals(res.data,[])){
                                var tempMsgs = [];
                                var num=0;
                                angular.forEach(res.data, function(msg){
                                    tempMsgs.push({id:msg._id, content:msg.content, read:msg.read, sender:msg.senderUsername,senderId:msg.sender, time:msg.createAt});
                                    if(msg.read == false && msg.senderUsername !== $scope.basicInfo.username) num++;
                                });

                                $scope.messages.push({userId:key, user:tempMsgs[0].sender, favorite:false, msgs:tempMsgs, lastMsg:res.data[res.data.length-1].content, num:num});
                                tempMsgs = [];
                                num=0;
                            }
                        });
                    });
                });
            };
            
            
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
                    
                    $scope.address.street = $scope.addresses[0]+" "+$scope.addresses[1];
                    console.log($scope.address.street);
                    $scope.address.city = $scope.addresses[2];
                    $scope.address.state = $scope.addresses[3];
                    $scope.address.zipcode = $scope.addresses[4];
                    if($scope.address.zipcode !== undefined){
                        $scope.addressCorrect = true;
                        geocoder.geocode({ 'address' : $scope.address.full}, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                                console.log(results[0].formatted_address);
                                $scope.address.latitude = results[0].geometry.location.lat();
                                $scope.address.longitude = results[0].geometry.location.lng();
                                console.log($scope.address);
                                requestService.ChangeProfile({step:2}, {'address':$scope.address}, function(res){
                                    console.log(res);
                                });
                            } else {}
                        });   
                    }
                    else{
                        $scope.addressCorrect = false;
                    }
                    
                }
            });
            
            
            function getUnreadMsgsNum(){
                var num = 0;
                angular.forEach($scope.messages, function(key){
                    num += key.num;
                });
                return num;
            };
            
            function updateMsgs(index) {
                if(angular.equals(popWindows[index], null)){
                    popWindows[index] = $window.open('#/chat');
                    popWindows[index].senderId = $scope.messages[index].userId;
                }
                $scope.messages[index].num =0;
                angular.forEach($scope.messages[index].msgs, function(key){
                    if(key.read == false && key.sender !== $scope.basicInfo.username)
                    {
                        userService.updateMessages({
                            id: key.id
                        }).then(function (res) {
                            if (res.result) {
                                console.log("Message updated");
                                key.read = true;
                            } else {
                                console.log("err");
                            }
                        });
                    }
                });
            };

            function validAddress(value) {
                var num = 0;
                angular.forEach( value, function() {
                    num++;
                });
                return num==1 ? false : true;
            };
            
            
            function setPostPage(page){ 
                $scope.postPage = page;
            }

            function setActivePage(page) {
                $scope.activePage = page;
            };
            
            function setActiveTab(tab) {
                $scope.activeTab = tab;
            };
            
            function initProfiles(){
                if(res.data.verified == true){
                    $scope.verified = true;
                }else{
                    $scope.verified = false;
                }
                $scope.email = res.data.email;

                $scope.img = res.data.avatar;
                if(res.data.address !== undefined){
                    $scope.address =  res.data.address;
                    $scope.addressGot = true;
                    $scope.addressCorrect = true;

                    $scope.$watch(function(){return $scope.address.apt}, function (newValue) {
                        $scope.address.apt = newValue;
                        requestService.ChangeProfile({step:2}, {'address':$scope.address}, function(res){
                            //console.log(res);
                        });
                    }, true);
                }

                if(res.data.enrollYear !== undefined){
                    $scope.basicInfo.enrollYear = res.data.enrollYear;
                }

                if(res.data.enrollSeason !== undefined){
                    $scope.basicInfo.enrollSeason = res.data.enrollSeason;
                }

                $scope.basicInfo.username = res.data.username;

                requestService.GetSchools(function(res){
                    $scope.schoolNames = [];
                    $scope.schoolIds = [];
                    for(var i=0; i<res.data.length; i++){
                        $scope.schoolNames.push(res.data[i].name);
                        $scope.schoolIds.push(res.data[i]._id);
                    }
                    
                    $scope.$watch('schoolName', function (newValue) {//学校字段内容改变时判断是否是正确的名字。正确时匹配schoolId
                        if(newValue !== undefined){
                            var index = $scope.schoolNames.indexOf(newValue);
                            if(index !== -1)
                                $scope.basicInfo.schoolId = $scope.schoolIds[index];
                        }
                    });
                });

                if(res.data.schoolId !== undefined){
                    $scope.basicInfo.schoolId = res.data.schoolId;
                    requestService.GetSchool({id:$scope.basicInfo.schoolId}, function(res){
                        if(res.result){
                            $scope.schoolName = res.data.name;
                        }   
                    }); 
                }

                $scope.$watch('basicInfo', function (newValue, oldValue) {
                    if(newValue.username!=='' && newValue.enrollSeason!=='' && newValue.enrollYear!=='' && newValue.schoolId!=='' && !angular.equals(newValue,oldValue)){
                        requestService.ChangeProfile({step:1},$scope.basicInfo, function(res){
                            console.log(res);
                        });
                    }
                }, true);
            };
            
        } else {
            $state.go('home');
        }
    });
    
    
    
    


});