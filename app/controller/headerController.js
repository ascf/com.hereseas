hereseasApp.controller('HeaderController', function($scope, $stateParams, $rootScope, $location, userService, $mdDialog, alertService, $http, requestService, $state){
        //login,signup,user ng-show
        $scope.logged = logged;
        $scope.logOut = logOut;
    
        //back to homepage
        $scope.goHome = function () {
            $state.go('home');    
        };
        //go profile page
        $scope.goProfile = function(){
            $state.go('profile');  
        };
        
        //set login state to set the header (logged:user&exit, not logged:login&signup)
        requestService.GetUserSelf(function (res) {
            //console.log(res,userService.getUser());
            if (res.result){ 
                userService.setLoginState(true);
                userService.setUser(res.data);
            }
        });
    
    
        $scope.$watch(function(){return userService.getUser().username}, function(newValue){
             $scope.username = newValue;
        });
        
        
        function logged() {
            return userService.getLoginState();
        };

        function logOut() {
            requestService.LogOut(function() {
                userService.setLoginState(false);
            });
        };
    
        $scope.editCarPost = function(ev, id, state) {
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
              clickOutsideToClose:true
            });
        };
    
    
    
        $scope.editPost = function(ev, id, state) {
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
              clickOutsideToClose:true
            });
        };
    
        
        //when "发布你的" clicked 
        $scope.showRoompost = function(ev) {
            var flag = userService.getLoginState();
            //should have logged in to post room
            if(flag)
            {
                if(userService.getUser().schoolId=="")
                    alertService.alert("请先完善个人信息（first name 和 last name）");
                else
                {
                    userService.setDraft({});                   
                    
                    $mdDialog.show({
                        //controller: RoomPostController,
                        templateUrl: '/app/view/room_post.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true
                    });
                }
                    
            }
            else alertService.alert("请先登录").then(function() {
                    $scope.showLogin();
            });
        };
    
        $scope.showCarpost = function(ev) {
            var flag = userService.getLoginState();
            //should have logged in to post room
            if(flag)
            {
                if(userService.getUser().schoolId=="")
                    alertService.alert("请先完善个人信息（first name 和 last name）");
                else
                {
                    userService.setDraft({});                   
                    
                    $mdDialog.show({
                        //controller: RoomPostController,
                        templateUrl: '/app/view/car_post.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true
                    });
                }
                    
            }
            else alertService.alert("请先登录").then(function() {
                    $scope.showLogin();
            });
        };
    
        $scope.showItemspost = function(ev) {
            var flag = userService.getLoginState();
            //should have logged in to post room
            if(flag)
            {
                if(userService.getUser().schoolId=="")
                    alertService.alert("请先完善个人信息（first name 和 last name）");
                else
                {
                    userService.setItemDraft({});                   
                    
                    $mdDialog.show({
                        //controller: RoomPostController,
                        templateUrl: '/app/view/Items_post.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true
                    });
                }
                    
            }
            else alertService.alert("请先登录").then(function() {
                    $scope.showLogin();
            });
        };

    
        $scope.showActivspost = function(ev) {
            var flag = userService.getLoginState();
            //should have logged in to post room
            if(flag)
            {
                if(userService.getUser().schoolId=="")
                    alertService.alert("请先完善个人信息（first name 和 last name）");
                else
                {
                    userService.setDraft({});                   
                    
                    $mdDialog.show({
                        //controller: RoomPostController,
                        templateUrl: '/app/view/activ_post.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true
                    });
                }
                    
            }
            else alertService.alert("请先登录").then(function() {
                    $scope.showLogin();
            });
        };
        
        //when signup clicked
        $scope.showSignup = function(ev) {
            userService.setSignupOrLogin(2);
            $mdDialog.show({
              templateUrl: '/app/view/signup_login.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true
            });
        };
        
        //when login clicked
        $scope.showLogin = function(ev) {
            userService.setSignupOrLogin(1);
            $mdDialog.show({
              templateUrl: '/app/view/signup_login.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true
            });
        };
        
        
        
        
        
        
});