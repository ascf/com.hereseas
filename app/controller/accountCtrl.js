hereseasApp.controller('AccountCtrl', function($scope, requestService, userService, $mdDialog, $cookies){
    $scope.state = userService.getSignupOrLogin();//1 for login 2 for signup
    $scope.login_err = false; //登陆时用户名密码是否匹配变量
    $scope.emailerr = false; //注册时错误变量
    $scope.psworderr = false; //注册时错误变量
    $scope.need_activate = false;
    $scope.signUpData = {};
    
    $scope.userData = {};	
	$scope.createForgetter = function () {
		//console.log($scope.userData)
        requestService.CreateForgetter($scope.userData, function(res) {
        	//console.log(res);
        	if (res.result) {
        		//alert("email has been sent" );
                $scope.state = 'resetTrue';
        	} else {
        		$scope.state = 'resetFalse';
        	}

        });
    };
    
    $scope.user = {
        email: '',
        password: '',
        remember: true
    };
    $scope.emailpattern = /^.+@.+\..+$/;
    
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
        $scope.state = 'signup';
        userService.setSignupOrLogin('signup');
        $scope.login_err = false;
        $scope.emailerr = false;
        $scope.psworderr = false;
    };
    
    $scope.goReset = function(){
        $scope.state = 'reset';
        $scope.emailerr = false;
        
    };
    
    $scope.goLogin = function(){
        $scope.state = 'login';
        userService.setSignupOrLogin('login');
        $scope.emailerr = false;
        $scope.psworderr = false;
    };
    
    $scope.rememberMe = function(){
        console.log("before",$scope.user.remember);
        console.log($scope.user.remember);
    }
    // controller to handle login check
    $scope.loginClick = function () {
        //console.log($scope.user);
        var isMatch = $scope.emailpattern.test($scope.user.email);
        if(!isMatch){$scope.emailerr = true;}
            else{$scope.emailerr = false;}
        if($scope.user.password.length < 6){$scope.psworderr = true;}
            else{$scope.psworderr = false;}
        if(!$scope.psworderr && !$scope.emailerr)
        {
            requestService.DoLogin($scope.user, function(res){
                //console.log(res);
                if(res.result){
                     requestService.GetUserSelf(function(res){
                        userService.setUser(res.data);
                        userService.setLoginState(true);

                        /*requestService.GetFavList(function(res){
                            console.log(res);
                            userService.saveFavorite2Cookies(res.data);

                        });*/
                        $scope.hide();
                        $scope.login_err = false;
                    });                    
                }else{
                    if(res.err == 'ERR_ACTIVATED_ERR'){
                        $scope.need_activate = true;
                    }else{
                        
                        $scope.login_err = true;
                    }
                }
            });
        }
    };
            
    $scope.signUpSubmit = function () {
        var isMatch = $scope.emailpattern.test($scope.signUpData.email);
        //console.log(isMatch);
        if(!isMatch){$scope.emailerr = true;}
            else{$scope.emailerr = false;}
        if($scope.signUpData.password == undefined){$scope.psworderr = true;}
            else{$scope.psworderr = false}
        if(!$scope.psworderr && !$scope.emailerr)
        {
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

                                /*requestService.GetFavList(function(res){
                                    console.log(res);
                                    userService.saveFavorite2Cookies(res.data);
                                });*/
                                //$scope.hide();
                            });
                        }
                    });
                    $scope.hide();
                } else {
                    alert('The email has already been registered!'); 
                }
            });
        }
    };
    
    $scope.forgetpw = function () {
        $scope.hide();
        
    }
});

hereseasApp.controller('ChatCtrl',function($scope, $window, userService, requestService){
    console.log($window.senderId);
    $scope.recvId = $window.senderId;
    $scope.content = "";
    
    requestService.GetMsgs({userid:$scope.recvId}, function(res){
        console.log(res);
        $scope.messages = res.data;
    });
    
    
    $scope.sendMessage = function(){
        console.log($scope.content);
        userService.sendmessage({
            id: $scope.recvId,
            content: $scope.content
        }).then(function (res) {
            console.log(res);
            if (res.result) {
                //alert("Message has been sent");
                requestService.GetMsgs({userid:$scope.recvId}, function(res){
                    console.log(res);
                    $scope.messages = res.data;
                });
            } else {
                alert("err");
            }
        });
    };
    
});