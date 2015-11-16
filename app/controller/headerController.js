hereseasApp.controller('HeaderController', function($scope, $stateParams, $rootScope, $location, userService, $mdDialog, alertService, $http, requestService, $state){
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
    
    //set login state to set the header (logged:user&exit, not logged:login&signup)
    requestService.GetUserSelf(function (res) {
        //console.log(res,userService.getUser());
        if (res.result){ 
            userService.setLoginState(true);
            userService.setUser(res.data);
        }
    });

    function logged() {
        return userService.getLoginState();
    };

    function logOut() {
        requestService.LogOut(function() {
            userService.setLoginState(false);
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
});