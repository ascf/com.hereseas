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
    
    $scope.$watch(function(){return userService.getUser().username}, function(newValue){
         $scope.username = newValue;
    });
    
    $scope.$on('login', function(){
        $scope.showLogin();
    });
    
    
    $scope.$watch(function(){return $cookies['newmsg'];}, function(newValue){
         console.log(newValue);
         if(newValue == 0 || newValue ==undefined) $scope.newMsg = false;
         else $scope.newMsg = true;
    });
    
    
    //set login state to set the header (logged:user&exit, not logged:login&signup)
    requestService.GetUserSelf(function (res) {
        //console.log(res,userService.getUser());
        if (res.result){ 
            userService.setLoginState(true);
            userService.setUser(res.data);
            $cookies['newmsg'] = 0;
            requestService.GetContact(function(res){
                angular.forEach(res.contacts, function(key){
                    requestService.GetMsgs({userid:key}, function(res){
                        //console.log(res.data);
                        if(!angular.equals(res.data,[])){
                            angular.forEach(res.data, function(msg){
                                if(msg.receiver == userService.getUser().id && msg.read == false){
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
        return userService.getLoginState();
    };

    function logOut() {
        requestService.LogOut(function() {
            userService.setLoginState(false);
            $scope.$emit('logout','1');
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
        var flag = userService.getLoginState();
        //should have logged in to post room
        if(flag)
        {
            console.log(userService.getUser());
            if(userService.getUser().schoolId==undefined)
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
        var flag = userService.getLoginState();
        //should have logged in to post room
        if(flag)
        {
            if(userService.getUser().schoolId==undefined)
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
        var flag = userService.getLoginState();
        //should have logged in to post room
        if(flag)
        {
            if(userService.getUser().schoolId==undefined)
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
        var flag = userService.getLoginState();
        //should have logged in to post room
        if(flag)
        {
            if(userService.getUser().schoolId==undefined)
                alertService.alert("请先填写你的学校").then(function(){
                    $state.go('profile');
                });
            else
            {
                userService.setDraft({});                   

                $mdDialog.show({
                    //controller: RoomPostController,
                    templateUrl: '/app/view/activ_post.html',
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
    
    $scope.openChatWindow = function(ev){
        var flag = userService.getLoginState();
        //should have logged in to post room
        if(flag)
        {
            $mdDialog.show({
                controller:['$scope','userService','requestService','$cookies','userId', function($scope,userService, requestService,$cookies,userId) { 
                    console.log(userId);
    
                    $scope.initMsgs = initMsgs;
                    $scope.updateMsgs = updateMsgs;
                    $scope.setCurContact = setCurContact;
                    $scope.sendMessage = sendMessage;
                    function setCurContact(contactId){
                        $scope.curContact = contactId;
                        updateMsgs(contactId);
                    };

                    $scope.contactDetails = {};
                    $scope.messages = {};
                    
                    $scope.contents = {};
                    initMsgs();
                    function initMsgs(){
                        requestService.GetContact(function(res){
                            console.log(res.contacts);
                            $scope.contacts = res.contacts;
                            $scope.curContact = $scope.contacts[0];
                            angular.forEach(res.contacts, function(key){

                                requestService.GetUser({id:key}, function(res){
                                    console.log("contact", res.data);
                                    $scope.contactDetails[key] = res.data;
                                });


                                requestService.GetMsgs({userid:key}, function(res){
                                    console.log(res.data);
                                    if(!angular.equals(res.data,[])){
                                        $scope.messages[key] = res.data;
                                        updateMsgs(key);
                                        console.log($scope.messages);
                                    }
                                });
                            });
                        });
                    };
                    
                    
                    function sendMessage(id){
                        
                        console.log($scope.contents[id]);
                        
                        userService.sendmessage({
                            id: id,
                            content: $scope.contents[id]
                        }).then(function (res) {
                            console.log(res);
                            if (res.result) {
                                //alert("Message has been sent");
                                requestService.GetMsgs({userid:id}, function(res){
                                    console.log(res);
                                    $scope.messages[id] = res.data;
                                    $scope.contents[id] = "";
                                });
                            } else {
                                alert("err");
                            }
                        });
                    };
                    
                    
                    function updateMsgs(contactId){
                        //console.log($scope.messages[contactId]);
                        angular.forEach($scope.messages[contactId], function(msg){
                            if(msg.read == false && msg.sender !== userService.getUser().id)
                            {
                                //console.log(msg);
                                userService.updateMessages({
                                    id: msg._id
                                }).then(function (res) {
                                    //console.log(res);
                                    if (res.result) {
                                        console.log("Message updated");
                                        msg.read = true;
                                        $cookies['newmsg'] = parseInt($cookies['newmsg']) - 1;
                                    } else {
                                        console.log("err");
                                    }
                                });
                            }
                        });
                    };
                    
                }],
                templateUrl: '/app/view/partials/_chat_window.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                locals : {
                    userId : userService.getUser().id
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
                            console.log('checked');
                        }else{
                            alert('Session time out, please login again!');
                            requestService.LogOut(function() {
                                userService.setLoginState(false);
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

hereseasApp.controller('TopBarController', function($scope, $stateParams,requestService){
    requestService.GetSchool({id:$stateParams.schoolId}, function(res){
        $scope.avatar = res.data.avatar;
        console.log($scope.avatar);
    });
});