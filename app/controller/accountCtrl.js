hereseasApp.controller('AccountCtrl', function($scope,$state,$window, requestService, userService, $mdDialog, $cookies,alertService){
    $scope.state = userService.getSignupOrLogin();//1 for login 2 for signup
    $scope.login_err = false; //登陆时用户名密码是否匹配变量
    $scope.nonedu_err = false;
    $scope.exist_err = false;
    $scope.emailerr = false; //注册时错误变量
    $scope.psworderr = false; //注册时错误变量
    $scope.usererr = false;
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
        $scope.login_err = false;
        $scope.psworderr = false;
        $scope.usererr = false;
        $scope.nonedu_err = false;
        $scope.exist_err = false;
    };
    
    $scope.goLogin = function(){
        $scope.state = 'login';
        userService.setSignupOrLogin('login');
        $scope.emailerr = false;
        $scope.psworderr = false;
        $scope.usererr = false;
        $scope.nonedu_err = false;
        $scope.exist_err = false;
    };
    
    $scope.rememberMe = function(){
        //console.log("before",$scope.user.remember);
        //console.log($scope.user.remember);
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
                        //console.log(res);
                        $cookies['schoolId'] = res.data.schoolId;
                        $cookies['userId'] = res.data.id;

                        $cookies.login = true;
                        $state.reload()
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
        if($scope.signUpData.username == undefined){$scope.usererr = true;}
            else{$scope.usererr = false}
        if(!$scope.psworderr && !$scope.emailerr && !$scope.usererr)
        {
            requestService.DoRegister($scope.signUpData, function(res) {
                //console.log(res);
                if (res.result) {
                    alertService.alert("注册成功，请登录您的邮箱进行验证！");
                    
                    $scope.hide();
                } else {
                    if(res.err=="ERR_NOT_EDUEMAIL_ERR"){
                        $scope.exist_err = false;
                        $scope.nonedu_err = true;
                    }
                    else if(res.err=="ERR_EXISTED_EMAIL "){
                        $scope.nonedu_err = false;
                        $scope.exist_err = true;
                    }
                }
            });
        }
    };
    
    $scope.forgetpw = function () {
        $scope.hide();
        
    }
});

/*hereseasApp.controller('ChatCtrl',function($scope, $window, userService, requestService,$cookies){
    console.log($window.senderId);
    
    $scope.initMsgs = initMsgs;
    
    $window.onbeforeunload = function(){
        console.log($cookies);
        delete $cookies[$window.senderId];
        $scope.$apply();
        
        return "bbb";
    };
    
    $scope.setCurContact = function(contactId){
        $scope.curContact = contactId;
    };
    
    $scope.contactDetails = {};
    $scope.messages = {};
    
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
                        console.log($scope.messages);
                    }
                });
            });
        });
        
    };
    
   
    
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
    
});*/