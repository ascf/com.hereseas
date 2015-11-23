hereseasApp.controller('ProfileController', function ($state, $scope,$timeout,requestService,userService, Upload, fileReader, $window,$cookies) {
    $scope.$on('logout',function(){
        $state.go('home');
    });
    
    requestService.GetUserSelf(function (res) {
        //console.log("userself", res);
        if (res.result){            
            var geocoder = new google.maps.Geocoder();
            $scope.options1 = null;
            $scope.details1 = '';
            $scope.addresses = [];
            $scope.addressGot = false;        //控制页面上是否显示解析后地址  
            $scope.addressCorrect = false;     //判断地址是否正确
            
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
            
            $scope.filterApt = true;
            $scope.filterCar = true;
            $scope.filterItem = true;
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
            
            $scope.img = undefined;
            
            $scope.validAddress = validAddress; //判断地址是否合法
            $scope.setPostPage = setPostPage;
            $scope.setActivePage = setActivePage;
            
            $scope.setActiveTab = setActiveTab;
            $scope.getUnreadMsgsNum = getUnreadMsgsNum;
            $scope.initMessages = initMessages;
            
            $scope.initProfiles = initProfiles;//初始化个人信息内容函数
            
            $scope.intiFavorite = intiFavorite;

            
            $scope.deleteCar = deleteCar;
            $scope.getCars = getCars;
            $scope.getCarDrafts = getCarDrafts;
            
            $scope.deleteApt = deleteApt;
            $scope.getApts = getApts;
            $scope.getAptDrafts = getAptDrafts;
            
            $scope.deleteItem = deleteItem;
            $scope.getItems = getItems;
            
            
            $scope.upload = upload;
            
            $scope.initProfiles();
            $scope.intiFavorite();
            $scope.initMessages();
            
            
            $scope.getApts(true);
            $scope.getAptDrafts(true);
            $scope.getCars(true);
            $scope.getCarDrafts(true);
            $scope.getItems(true);
            
            
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
            
            
            function getItems(init){
                requestService.GetItems(function(res) {
                    if(res.result==false)
                    {
                        $scope.hasPostedItems = false;
                    }
                    else
                    {
                        $scope.hasPostedItems = true;
                        $scope.items = res.data;
                        if(init == true)
                            $scope.localItems = $scope.items;
                        //console.log("local items",$scope.localItems);
                    }
                });
            };
            
            
            function deleteItem(index, id){
                var deleteConfirm = window.confirm("确定要删除吗？");
                if(deleteConfirm){
                    $scope.localItems.splice(index, 1);

                    requestService.DeleteItem({id:id}, function(res){
                        //console.log(id,res);
                    });
                }
            };
            
            function deleteCar(index, id, type){
                var deleteConfirm = window.confirm("确定要删除吗？");
                if(deleteConfirm){
                    if(type == 1){
                        $scope.localCars.splice(index, 1);
                    }
                    else{
                        $scope.localDraftCars.splice(index, 1);
                    }

                    requestService.DeleteCar({id:id}, function(res){
                        //console.log(id,res);
                    });
                }
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
                        //console.log("local cars",$scope.localCars);
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
                var deleteConfirm = window.confirm("确定要删除吗？");
                if(deleteConfirm){
                    if(type == 1){
                        $scope.localApts.splice(index, 1);
                    }
                    else{
                        $scope.localDraftApts.splice(index, 1);
                    }

                    requestService.DeleteApt({id:id}, function(res){
                        //console.log(id,res);
                    });
                }
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
                        
                        //console.log("apts",res.data);
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
                        //console.log("apt drafts",res.data);
                        if(init == true)
                            $scope.localDraftApts = $scope.aptDrafts;
                    }
                });
            };
            
            
            
            function upload(file) {
                if (file) {
                    //console.log(file);
                   
                    //console.log("111");
                    fileReader.readAsDataUrl(file, $scope).then(function(result) {
                        $scope.img = result;
                        //key.content = result;
                    });
                    var up = Upload.upload({
                        url: userService.getHost()+'/avatar/m_upload_image',
                        file: file,
                        fileFormDataName: 'avatar'
                    }).progress(function (evt) {
                        $scope.prog = parseInt(100.0 * evt.loaded / evt.total);
                    }).success(function (data, status, headers, config) {
                        //console.log('file ' + config.file.name + 'uploaded. Response: ');
                        //console.log(data);
                        $scope.avatar = "https://s3.amazonaws.com/hereseas-public-images/"+data.data;
                        requestService.ChangeProfile({step:3}, {'avatar':$scope.avatar}, function(res){
                                //console.log(res);
                            });
                    }).error(function (data, status, headers, config) {
                        //console.log('error status: ' + status);
                    })
                }
            };
            
            function initMessages(){
                requestService.GetContact(function(res){
                    //console.log(res.contacts);
                    angular.forEach(res.contacts, function(key){
                        
                        requestService.GetMsgs({userid:key}, function(res){
                            //console.log(res.data);
                            if(!angular.equals(res.data,[])){
                                var tempMsgs = [];
                                var num=0;
                                angular.forEach(res.data, function(msg){
                                    tempMsgs.push({id:msg._id, content:msg.content, read:msg.read, sender:msg.senderUsername,senderId:msg.sender, time:msg.createAt});
                                    if(msg.read == false && msg.senderUsername !== $scope.basicInfo.username) num++;
                                });
                                
                                requestService.GetUser({id:key},function(res2){
                                    var avatar = res2.data.avatar;
                                    var user = res2.data.username;
                                    
                                    var content = res.data[res.data.length-1].content;
                                    content = content.length>14?content.substring(0,14)+"...":content;

                                    $scope.messages.push({avatar:avatar,userId:key, user:user,favorite:false, msgs:tempMsgs, lastMsg:content, time:res.data[res.data.length-1].createAt, num:num});
                                    
                                    
                                    tempMsgs = [];
                                    num=0;
                                });
                                
                                
                            }
                        });
                    });
                });
            };
            
            function getUnreadMsgsNum(){
                var num = 0;
                angular.forEach($scope.messages, function(key){
                    num += key.num;
                });
                return num;
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
                if(res.data.avatar !== "avatar/default.png")
                    $scope.img = res.data.avatar;
                else $scope.img = "/app/view/img/profile/default_avatar.png"
               

                if(res.data.enrollYear !== undefined){
                    $scope.basicInfo.enrollYear = res.data.enrollYear;
                }

                if(res.data.enrollSeason !== undefined){
                    $scope.basicInfo.enrollSeason = res.data.enrollSeason;
                }

                $scope.basicInfo.username = res.data.username;

                requestService.GetSchools(function(res){
                    $scope.schools = res.data;
                    //console.log($scope.schools);
                    $scope.schoolNames = [];
                    $scope.schoolIds = [];
                    for(var i=0; i<res.data.length; i++){
                        $scope.schoolNames.push(res.data[i].name);
                        $scope.schoolIds.push(res.data[i]._id);
                    }
                    
                });

                if(res.data.schoolId !== undefined){
                    $scope.basicInfo.schoolId = res.data.schoolId;
                    //console.log($scope.basicInfo.schoolId);
                }

            };
            
            $scope.$watch('file', function (newValue, oldValue) {
                if(!angular.equals(newValue, oldValue))
                    $scope.upload($scope.file);
            });
            
            $scope.updateInfo = function(res){
                requestService.ChangeProfile({step:1},$scope.basicInfo, function(res){
                    //console.log(res);
                    $state.reload();
                });
            }
            
            
        } else {
            $state.go('home');
        }
    });

});

hereseasApp.controller('OthersProfileController', function ($state, $scope, $stateParams, requestService) {
    $scope.hasSelling = false;
    $scope.goToEach = function(index){
        //console.log(index);
        switch($scope.onSelling[index].identity){
            case 1:$state.go('rooms',{aptId:$scope.onSelling[index].content._id});break;
            case 2:$state.go('cars',{carId:$scope.onSelling[index].content._id});break;
            case 3:$state.go('items',{itemId:$scope.onSelling[index].content._id});break;
        }
    };
    
    $scope.pageReturn = function(){
        $state.go('schoolMates',{schoolId:$scope.othersInfo.schoolId});
    };
    $scope.userId = $stateParams.othersId;
    requestService.GetUser({id:$stateParams.othersId}, function(res){
        if(res.result){
            //console.log(res.data);
            $scope.othersInfo = res.data;
            requestService.GetUserAllPost({id:$stateParams.othersId}, function(res){
                //console.log(res.data);
                if(res.data.length!=0){
                    $scope.hasSelling = true;
                    $scope.onSelling = res.data;
                }
            });
            
            requestService.GetSchool({id:$scope.othersInfo.schoolId}, function(res) {
                if (res.result) {
                    $scope.schoolName = res.data.name;
                } else {
                    
                }
            });
        };   
    }); 
});