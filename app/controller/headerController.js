
hereseasApp.controller('HeaderController', ['$scope','userService','$mdDialog','alertService','requestService','$state','$cookies',function($scope, userService, $mdDialog, alertService, requestService, $state,$cookies){
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
         if(newValue == 0 || newValue ==undefined) $scope.newMsg = false;
         else $scope.newMsg = true;
    });
    
    
    //set login state to set the header (logged:user&exit, not logged:login&signup)
    requestService.GetUserSelf(function (res) {
        if (res.result){ 
            $cookies.login = true;
            
            $scope.username = res.data.username;
            $cookies['userId'] = res.data.id;
            
            if(res.data.schoolId !== undefined)
                $cookies['schoolId'] = res.data.schoolId;
            $cookies['newmsg'] = 0;
            requestService.GetContact(function(res){
                angular.forEach(res.contacts, function(key){
                    requestService.GetMsgs({userid:key}, function(res){
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
            delete $cookies['schoolId'];
            delete $cookies['userId'];
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
            if($cookies['schoolId'] == undefined)
                alertService.alert("请先填写你的学校").then(function(){
                    $state.go('profile');
                });
            else
            {
                userService.setDraft({id:'',state:'post'});                   

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
                userService.setCarDraft({id:'',state:'post'});                   

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
                $mdDialog.show({
                    //controller: RoomPostController,
                    templateUrl: '/app/view/items_post.html',
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
                controller:['$scope','userService','requestService','$cookies','$mdDialog', function($scope ,userService, requestService,$cookies,$mdDialog) { 
    
                    $scope.hide = function(){
                        $mdDialog.hide();
                    };
                    
                    $scope.initMsgs = initMsgs;
                    $scope.updateMsgs = updateMsgs;
                    $scope.setCurContact = setCurContact;
                    $scope.sendMessage = sendMessage;
                    function setCurContact(index){
                        $scope.curContact = index;
                        
                        requestService.GetMsgs({userid:$scope.contacts[$scope.curContact]}, function(res){
                            $scope.messages = res.data;
                            updateMsgs();
                        });
                    };

                    $scope.contactDetails = [];
                    $scope.messages = [];
                    
                    $scope.contents = "";
                    initMsgs();
                    function initMsgs(){
                        requestService.GetContact(function(res){
                            if(res.contacts.length == 0){
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
                            
                            if($scope.contacts.length!==0)
                            {
                                requestService.GetMsgs({userid:$scope.contacts[0]}, function(res){
                                    $scope.messages = res.data;
                                    updateMsgs();
                                });
                            }
                            
                            angular.forEach($scope.contacts, function(key){
                                $scope.contactDetails.push({});
                            });
                            angular.forEach($scope.contacts, function(key){
                                requestService.GetUser({id:key}, function(user){
                                    $scope.contactDetails[$scope.contacts.indexOf(key)] = user.data; 
                                });
                            });
                        });
                    };
                    
                    
                    function sendMessage(){
                        userService.sendmessage({
                            id: $scope.contacts[$scope.curContact],
                            content: $scope.contents
                        }).then(function (res) {
                            if (res.result) {
                                requestService.GetMsgs({userid:$scope.contacts[$scope.curContact]}, function(res){
                                    $scope.messages = res.data;
                                    $scope.contents = "";
                                });
                            } else {
                                alert("err");
                            }
                        });
                    };
                    
                    function updateMsgs(){
                        angular.forEach($scope.messages, function(msg){
                            if((msg.read == false && msg.sender !== $cookies.userId) || (msg.read == false && msg.sender==msg.receiver))
                            {
                                userService.updateMessages({
                                    id: msg._id
                                }).then(function (res) {
                                    if (res.result) {
                                        msg.read = true;
                                        $cookies.newmsg = parseInt($cookies.newmsg) - 1;
                                    } 
                                });
                            }
                        });
                    };
                }],
                templateUrl:'/app/view/partials/_chat_window_temp.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
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
                        }else{
                            alertService.alert('Session time out, please login again!').then(function(){
                                requestService.LogOut(function() {
                                    $cookies.login = false;
                                    delete $cookies.userId;
                                    delete $cookies.schoolId;
                                    $scope.$emit('logout','1');
                                });
                            });          
                        }
                    });
                }
              });
            // AngularJS unaware of update to $scope
        }, 900000);
        
    }
    sessionCtrl();
}]);

hereseasApp.controller('TopBarController', ['$scope','$stateParams','requestService',function($scope, $stateParams,requestService){
    requestService.GetSchool({id:$stateParams.schoolId}, function(res){
        if(res.result){
            $scope.avatar = res.data.avatar; 
        }
    });
}]);