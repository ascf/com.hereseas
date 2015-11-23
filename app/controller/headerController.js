hereseasApp.controller('HeaderController', function($scope, $stateParams, $rootScope, $location, userService, $mdDialog, alertService, $http, requestService, $state,$cookies,$window){
    //login,signup,user ng-show
    $scope.logged = logged;
    $scope.logOut = logOut;

    $scope.goHome = goHome;
    $scope.goProfile = goProfile;

    $scope.editCarPost = editCarPost;

    $scope.editAptPost = editAptPost;

    $scope.showRoompost = showRoompost;
    $scope.showCarpost = showCarpost;
    $scope.showItemspost = showItemspost;
    $scope.showActivspost = showActivspost;

    $scope.showSignup = showSignup;
    $scope.showLogin = showLogin;
    

    
    $scope.$on('login', function(){
        $scope.showLogin();
    });
    
    
    $scope.$watch(function(){return $cookies['newmsg'];}, function(newValue){
         //console.log(newValue);
         if(newValue == 0 || newValue ==undefined) $scope.newMsg = false;
         else $scope.newMsg = true;
    });
    
    
    //set login state to set the header (logged:user&exit, not logged:login&signup)
    requestService.GetUserSelf(function (res) {
        if (res.result){ 
            $cookies.login = true;
            console.log(res.data);
            
            $scope.username = res.data.username;
            $cookies['userId'] = res.data.id;
            $cookies['schoolId'] = res.data.schoolId;
            $cookies['newmsg'] = 0;
            requestService.GetContact(function(res){
                angular.forEach(res.contacts, function(key){
                    requestService.GetMsgs({userid:key}, function(res){
                        //console.log(res.data);
                        if(!angular.equals(res.data,[])){
                            angular.forEach(res.data, function(msg){
                                if(msg.receiver == $cookies['userId'] && msg.read == false){
                                    $cookies['newmsg'] = parseInt($cookies['newmsg']) + 1;
                                }
                            });
                        }
                    });
                });
            });
            
            
        }
    });

    function logged() {
        return $cookies.login=='true';
    };

    function logOut() {
        requestService.LogOut(function() {
            $cookies.login = false;
            $cookies['schoolId'] = undefined;
            $cookies['userId'] = undefined;
            $scope.$emit('logout','1');
            $state.reload();
        });
    };

    //back to homepage
    function goHome() {
        $state.go('home');    
    };
    //go profile page
    function goProfile(){
        $state.go('profile');  
    };

    function editCarPost(ev, id, state) {
        if(state==1){
            userService.setCarDraft({id:id, state:"update"});
        }
        else{
            userService.setCarDraft({id:id, state:"edit"});    
        }
        $mdDialog.show({
          //controller: RoomPostController,
          templateUrl: '/app/view/car_post.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false
        });
    };



    function editAptPost(ev, id, state) {
        if(state==1){
            userService.setDraft({id:id, state:"update"});
        }
        else{
            userService.setDraft({id:id, state:"edit"});    
        }
        $mdDialog.show({
          //controller: RoomPostController,
          templateUrl: '/app/view/room_post.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false
        });
    };


    //when "发布你的" clicked 
    function showRoompost(ev) {
        if(logged())
        {
            console.log($cookies);
            if($cookies['schoolId'] == undefined)
                alertService.alert("请先填写你的学校").then(function(){
                    $state.go('profile');
                });
            else
            {
                userService.setDraft({});                   

                $mdDialog.show({
                    //controller: RoomPostController,
                    templateUrl: '/app/view/room_post.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:false
                });
            }
        }
        else alertService.alert("请先登录").then(function() {
                $scope.showLogin();
        });
    };

    function showCarpost(ev) {
        if(logged())
        {
            if($cookies['schoolId']==undefined)
                alertService.alert("请先填写你的学校").then(function(){
                    $state.go('profile');
                });
            else
            {
                userService.setCarDraft({});                   

                $mdDialog.show({
                    //controller: RoomPostController,
                    templateUrl: '/app/view/car_post.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:false
                });
            }
        }
        else alertService.alert("请先登录").then(function() {
                $scope.showLogin();
        });
    };

    function showItemspost(ev) {
        //should have logged in to post room
        if(logged())
        {
            if($cookies['schoolId']==undefined)
                alertService.alert("请先填写你的学校").then(function(){
                    $state.go('profile');
                });
            else
            {
                //userService.setItemDraft({});                   

                $mdDialog.show({
                    //controller: RoomPostController,
                    templateUrl: '/app/view/Items_post.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:false
                });
            
            }
        }
        else alertService.alert("请先登录").then(function() {
                $scope.showLogin();
        });
    };


    function showActivspost(ev) {
        //should have logged in to post room
        if(logged())
        {
            if($cookies['schoolId']==undefined)
                alertService.alert("请先填写你的学校").then(function(){
                    $state.go('profile');
                });
            else
            {
                userService.setDraft({});                   

                $mdDialog.show({
                    //controller: RoomPostController,
                    templateUrl: '/app/view/activ_post_temp.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:false
                });
            }
        }
        else alertService.alert("请先登录").then(function() {
                $scope.showLogin();
        });
    };

    //when signup clicked
    function showSignup(ev) {
        userService.setSignupOrLogin('signup');
        $mdDialog.show({
          templateUrl: '/app/view/signup_login.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        });
    };

    //when login clicked
    function showLogin(ev) {
        userService.setSignupOrLogin('login');
        $mdDialog.show({
          templateUrl: '/app/view/signup_login.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        });
    };
    
    $scope.openChatWindow = function(ev, receiver){
        //should have logged in to post room
        if(logged())
        {
            $mdDialog.show({
                controller: function($scope ,userService, requestService,$cookies,$mdDialog,userId) { 
                    //console.log(userId);
    
                    $scope.hide = function(){
                        $mdDialog.hide();
                    };
                    
                    $scope.initMsgs = initMsgs;
                    $scope.updateMsgs = updateMsgs;
                    $scope.setCurContact = setCurContact;
                    $scope.sendMessage = sendMessage;
                    function setCurContact(index){
                        $scope.curContact = index;
                        updateMsgs(index);
                    };

                    $scope.contactDetails = [];
                    $scope.messages = [];
                    
                    $scope.contents = [];
                    initMsgs();
                    function initMsgs(){
                        requestService.GetContact(function(res){
                            //console.log(res);
                            
                            if(res.contacts[0] == undefined){
                                $scope.contacts = [];
                                if(receiver!==''){ 
                                    $scope.contacts.push(receiver);
                                }
                                $scope.curContact = 0;
                            }
                            else{
                                $scope.contacts = res.contacts;
                                if(receiver!==''){ 
                                    if($scope.contacts.indexOf(receiver) !== -1){
                                        $scope.contacts.splice($scope.contacts.indexOf(receiver),1);
                                    }
                                    
                                    $scope.contacts.push(receiver);
                                    $scope.contacts = $scope.contacts.reverse();
                                    $scope.curContact = 0;
                                }else{
                                    $scope.contacts = $scope.contacts.reverse();
                                    $scope.curContact = 0;
                                }
                                
                            }
                            //console.log($scope.contacts);
                            
                            angular.forEach($scope.contacts, function(key){
                                $scope.contents.push('');
                                $scope.messages.push([]);
                                $scope.contactDetails.push({});
                            });
                            
                            
                            angular.forEach($scope.contacts, function(key){
                                //console.log(key);
                                requestService.GetUser({id:key}, function(user){
                                    //console.log(key);
                                    $scope.contactDetails[$scope.contacts.indexOf(key)] = user.data;
                                    
                                    requestService.GetMsgs({userid:key}, function(res){
                                        if(!angular.equals(res.data,[])){
                                            $scope.messages[$scope.contacts.indexOf(key)] =res.data;
                                            //console.log(key,"msgs", $scope.messages);
                                            if($scope.curContact==0){
                                                updateMsgs(0);
                                            }
                                        }
                                        else{
                                            $scope.messages[$scope.contacts.indexOf(key)] =[];
                                        }
                                        
                                    }); 
                                });
                            });
                        });
                    };
                    
                    
                    function sendMessage(id){
                        
                        //console.log($scope.contacts[id]);
                        
                        userService.sendmessage({
                            id: $scope.contacts[id],
                            content: $scope.contents[id]
                        }).then(function (res) {
                            //console.log(res);
                            if (res.result) {
                                requestService.GetMsgs({userid:$scope.contacts[id]}, function(res){
                                    //console.log(res);
                                    $scope.messages[id] = res.data;
                                    $scope.contents[id] = "";
                                });
                            } else {
                                alert("err");
                            }
                        });
                    };
                    
                    
                    function updateMsgs(index){
                        //console.log($scope.messages[contactId]);
                        angular.forEach($scope.messages[index], function(msg){
                            if(msg.read == false && msg.sender !== $cookies['userId'])
                            {
                                //console.log(msg);
                                userService.updateMessages({
                                    id: msg._id
                                }).then(function (res) {
                                    //console.log(res);
                                    if (res.result) {
                                        //console.log("Message updated");
                                        msg.read = true;
                                        $cookies['newmsg'] = parseInt($cookies['newmsg']) - 1;
                                    } else {
                                        //console.log("err");
                                    }
                                });
                            }
                        });
                    };
                    
                },
                templateUrl: '/app/view/partials/_chat_window.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                locals : {
                    userId : $cookies['userId']
                }
            });
        }
        else alertService.alert("请先登录").then(function() {
                $scope.showLogin();
        });         
    };
    
    //check login stats every 15 minutes
    function sessionCtrl() {                                                                                        
        setTimeout(function () {
            $scope.$apply(function () {
                if(userService.getLoginState() == true){
                   requestService.GetUserSelf(function (res) { 
                        if (res.result){
                            sessionCtrl();
                            //console.log('checked');
                        }else{
                            alert('Session time out, please login again!');
                            requestService.LogOut(function() {
                                $cookies.login = false;
                                $cookies['userId'] = undefined;
                                $cookies['schoolId'] = undefined;
                                $scope.$emit('logout','1');
                            });
                        }
                    });
                }
              });
            // AngularJS unaware of update to $scope
        }, 900000);
        
    }
    sessionCtrl();
});

hereseasApp.controller('TopBarController', function($state, $scope, $stateParams,requestService){
    requestService.GetSchool({id:$stateParams.schoolId}, function(res){
        $scope.avatar = res.data.avatar;
        //console.log($scope.avatar);
    });
});