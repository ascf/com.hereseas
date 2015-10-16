hereseasApp.controller('AccountCtrl', function($scope, requestService, userService, $mdDialog){
    $scope.state = userService.getSignupOrLogin();//1 for login 2 for signup
    
    $scope.signUpData = {};
    $scope.user = {
        email: '',
        password: '',
        save: true
    };

    $scope.socialLogins = [{
        icon: 'fa-twitter',
        color: '#5bc0de',
        url: '#'
    }, {
        icon: 'fa-facebook',
        color: '#337ab7',
        url: '#'
    }, {
        icon: 'fa-google-plus',
        color: '#e05d6f',
        url: '#'
    }, {
        icon: 'fa-linkedin',
        color: '#337ab7',
        url: '#'
    }];

    $scope.hide = function() {
        $mdDialog.hide();
    };
    
    $scope.goSignup = function(){
        $scope.state = 2;
        userService.setSignupOrLogin(2);
    };
    
    $scope.goLogin = function(){
        $scope.state = 1;
        userService.setSignupOrLogin(1);
    };
    
    // controller to handle login check
    $scope.loginClick = function () {
        //console.log($scope.user);
        requestService.DoLogin($scope.user, function(res){
            console.log(res,"1");
            if(res.result){
                 requestService.GetUserSelf(function(res){
                    userService.setUser(res.data);
                    userService.setLoginState(true);
                    $scope.hide();
                });                    
            }else{
                alert("用户名或密码错误");
            }
        });
    };
            
    $scope.signUpSubmit = function () {
        requestService.DoRegister($scope.signUpData, function(res) {
            console.log(res);
            if (res.result) {
                alert("注册成功，您已登录");
                requestService.DoLogin($scope.signUpData, function(res){
                    if(res.result){
                        requestService.GetUserSelf(function(res){
                            console.log(res.data);
                            userService.setUser(res.data);
                            userService.setLoginState(true);
                            //$scope.hide();
                        });
                    }
                });
                $scope.hide();
            } else {
                alertService.alert('The email has already been registered!');
            }
        });
    };
    
    $scope.forgetpw = function () {
        $scope.hide();
        
    }
});