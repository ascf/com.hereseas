hereseasApp.controller('ProfileController', function ($state, $scope,$timeout,requestService,userService, Upload, fileReader) {
    requestService.GetInit(function (res) {
        if (res.result){
            
            /*$scope.$on('schoolNameChanged',function (e, result){
                //console.log('school changed', result);
                $scope.basicInfo.schoolId = result.id;
                $scope.schoolName = result.name;
            });*/
            
            /*$scope.$watch('basicInfo', function (newValue, oldValue) {
                if(!angular.equals(newValue, oldValue) && !angular.equals(oldValue, {})){
                    console.log(newValue, oldValue);
                    $scope.updateMark.basic = true;
                }
            }, true);
            
            $scope.$watch('address', function (newValue, oldValue) {
                if(!angular.equals(newValue, oldValue) && !angular.equals(oldValue, {
                         street :  '',
                         apt :       '',
                         city :     '',
                         state :    '',
                         zipcode :  '',
                         full:   ''
                    })){
                    console.log(newValue, oldValue);
                    $scope.updateMark.address = true;
                }
            }, true);*/
            
            var geocoder = new google.maps.Geocoder();
            $scope.options1 = null;
            $scope.details1 = '';
            $scope.addresses = [];
            $scope.addressGot = false;        //控制页面上是否显示解析后地址  
            $scope.addressCorrect = false;     //判断地址是否正确
            $scope.validAddress = validAddress; //判断地址是否合法
            
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
            
            
            function validAddress(value) {
                var num = 0;
                angular.forEach( value, function() {
                    num++;
                });
                return num==1 ? false : true;
            };
            
            $scope.img = undefined;
            
            requestService.GetUserSelf(function(res){
                console.log("userself", res);
                
                $scope.img = res.data.avatar;
                
                
                if(res.data.address !== undefined){
                    $scope.address =  res.data.address;
                    $scope.addressGot = true;
                    $scope.addressCorrect = true;
                    
                    $scope.$watch(function(){return $scope.address.apt}, function (newValue) {
                        console.log(newValue);
                        $scope.address.apt = newValue;
                        requestService.ChangeProfile({step:2}, {'address':$scope.address}, function(res){
                            console.log(res);
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

                $scope.basicInfo.schoolId = res.data.schoolId;
                
                $scope.$watch('basicInfo', function (newValue, oldValue) {
                    if(!angular.equals(newValue, oldValue)){
                        console.log(newValue, oldValue);
                        requestService.ChangeProfile({step:1},$scope.basicInfo, function(res){
                            console.log(res);
                        });
                    }
                }, true);
                
                
                
                
                /*$scope.$watch('address', function (newValue, oldValue) {
                    if(newValue.street !==oldValue.street || newValue.city !==oldValue.city || newValue.state !==oldValue.state || newValue.zipcode !==oldValue.zipcode){
                        console.log(newValue, oldValue);
                        $scope.address.full = newValue.street+', ' + newValue.city +', '+newValue.state;
                        
                        geocoder.geocode({ 'address' : $scope.address.full}, function (results, status) {
                            console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                            if (status == google.maps.GeocoderStatus.OK) {
                                console.log("Valid address");
                            } else {
                                console.log("Invalid address");
                            }
                        });
                        
                        
                        requestService.ChangeProfile({step:2}, {'address':newValue}, function(res){
                            console.log(res);
                        });
                    }
                }, true);*/
                
                requestService.GetSchool({id:$scope.basicInfo.schoolId}, function(res){
                    console.log(res);
                    $scope.schoolName = res.data.name;
                    $scope.schoolAvatar = res.data.avatar;
                    //$scope.$broadcast('getSchoolName', $scope.schoolName);
                });
               
                
            });
            
            
            $scope.sendInfo = '';
            
            userService.userSelf({
                    
                })
                    .then(function (res) {
                        if (res.result) {
                            if(res.data.verified == true){
                                $scope.verified = true;
                            }else{
                                $scope.verified = false;
                            }
                            $scope.email = res.data.email;
                        } else {
                            
                        }
                    })
            

            $scope.sendVerifyLink = function(){
                userService.active({
                    eduEmail: $scope.eduEmail,
                })
                    .then(function (res) {
                        console.log(res.result);
                        if (res.result) {                          
                            $scope.sendInfo = 'email sended';                                                         
                        } else {
                            $scope.sendInfo = res.err;
                        }
                    })
            };
            
            
            $scope.deleteApt = function(index, id, type){
                if(type == 1){
                    $scope.localApts.splice(index, 1);
                }
                else{
                    $scope.localDrafts.splice(index, 1);
                }
                
                requestService.DeleteApt({id:id}, function(res){
                    console.log(id,res);
                    
                });
            };
            
            $scope.getApts = function(init){
                requestService.GetApts(function(res) {
                    if(res.result==false)
                    {
                        $scope.hasPosted = false;
                    }
                    else
                    {
                        $scope.hasPosted = true;
                        $scope.apts = res.data;
                        if(init == true)
                            $scope.localApts = $scope.apts;
                    }
                });
            };
            
            
            $scope.getDrafts = function(init){
                requestService.GetDrafts(function(res){
                    if(res.result == false){
                        $scope.hasDraft = false;
                    }else{
                        $scope.hasDraft = true;
                        $scope.drafts = res.data;
                        if(init == true)
                            $scope.localDrafts = $scope.drafts;
                    }
                });
            };
            $scope.getApts(true);
            $scope.getDrafts(true);
            
            
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
            //$scope.lastPage = lastPage;
            //$scope.nextPage = nextPage;
            //$scope.cancel = cancel;
            
            $scope.setActiveTab = setActiveTab;
            $scope.setFavorite = setFavorite;
            $scope.updateMsgs = updateMsgs;
            $scope.getUnReadMessages = getUnReadMessages;
            
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

            $scope.numMessage = 0;
            $scope.numNotify = 0;
            $scope.favorite = ["/app/view/img/profile/favorite1.png","/app/view/img/profile/favorite2.png"];            
            
            $scope.messages = [
                {
                    user:"Zhenyu Han", 
                    msgs:[
                        {content:"aaaaaaaaaaaaaaaaa",read:false},
                        {content:"bbbbbbbbbbbbbbbbb",read:true},
                        {content:"ccccccccccccccccc",read:false}
                    ], 
                    favorite: false
                },
                {
                    user:"Shuo Peng", 
                    msgs:[
                        {content:"ddddddddddddddddd",read:false},
                        {content:"eeeeeeeeeeeeeeeee",read:true},
                    ], 
                    favorite: true
                },
                {
                    user:"Huanzhou Huang", 
                    msgs:[
                        {content:"ddddddddddddddddd",read:true},
                        {content:"eeeeeeeeeeeeeeeee",read:true},
                    ], 
                    favorite: true     
                }
            ];
            
            $scope.unReadMessages = [];
            
            getUnReadMessages();
            function getUnReadMessages() {
                var temp = [];
                var lastestMsg="";
                for(var i=0; i<$scope.messages.length; i++)
                {
                    var value = $scope.messages[i].msgs;
                    for(var j=0; j<value.length; j++)
                    {
                        if(value[j].read == false)
                            temp.push(value[j].content);
                        lastestMsg = value[j].content;
                    }
                    if(temp.length == 0 )
                        $scope.unReadMessages.push({user: $scope.messages[i].user, contents: temp,lastest:lastestMsg, hasNew:false});
                    else
                    { 
                        $scope.unReadMessages.push({user: $scope.messages[i].user, contents: temp,lastest:lastestMsg, hasNew:true});
                        $scope.numMessage += temp.length;
                    }
                    temp = [];
                    lastestMsg="";
                }
            }
            
            function updateMsgs(index) {
                if($scope.unReadMessages[index].hasNew == true){
                    $scope.numMessage -= $scope.unReadMessages[index].contents.length;
                    $scope.unReadMessages[index].contents = [];
                    $scope.unReadMessages[index].hasNew = false;
                    
                    //console.log($scope.unReadMessages[index].contents.length);
                    for(var i=0; i<$scope.messages[index].msgs.length; i++)
                    {
                        $scope.messages[index].msgs[i].read = true;
                    }
                }
            };
            
            
            function setFavorite(index) {
                $scope.messages[index].favorite = !$scope.messages[index].favorite;
                //console.log($scope.messages);
            };
            
            
            /*function lastPage() {
                setActivePage($scope.activePage-1);
            };

            function nextPage() {
                setActivePage($scope.activePage+1);
            };*/
            
            function cancel() {
                $state.go('home');
            };

            
            function setPostPage(page){ 
                $scope.postPage = page;
            }

            function setActivePage(page) {
                /*if($scope.activePage == page){
                    
                } else{
                    if($scope.activePage == 2){
                        if($scope.updateMark.address){
                            $scope.address.full = $scope.address.street+', ' + $scope.address.city +', '+$scope.address.state;
                            requestService.ChangeProfile({step:2}, {'address':$scope.address}, function(res){
                                console.log(res);
                                $scope.updateMark.address = false;
                            });
                        }
                    }
                }*/
                $scope.activePage = page;
            };
            
            function setActiveTab(tab) {
                $scope.activeTab = tab;
            };
        } else {
            $state.go('home');
        }
    });
    
    
    
    


});