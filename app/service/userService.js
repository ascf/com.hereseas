hereseasApp.factory('userService', function ($http, $state) {


    var userService = this;
    var host = "http://52.25.82.212:8080";
    
    
    var toSignup = false;
    var toLogin = false;

    var loginState = false;   
    
    /**
     *
     * @type {{}}
     */
    var userInfo = {};
    var draft = {};
    
    var signupOrLogin = 1;
    this.setSignupOrLogin = function(state){
        signupOrLogin = state;
    };
    
    this.getSignupOrLogin = function(){
        return signupOrLogin;
    };
    
    
    this.setDraft = function(data){
        draft = data;
    };
    
    this.getDraft = function(){
        return draft;
    };
    
    this.setUser = function (info){
        userInfo = info;
    };
    
    this.getUser = function(){
        return userInfo;
    };

    this.setLoginState = function(state) {
        loginState = state;
    };
    
    this.getLoginState = function() {
        return loginState;
    };
    
    this.getToLogin = function() {
        return toLogin;
    };
    this.changeToLogin = function() {
        toLogin = !toLogin;
    };
    
    this.getToSignup = function() {
        return toSignup;
    };
    
    this.changeToSignup = function() {
        toSignup = !toSignup;
    };
    
    /*
     *  verify the email user have given
     */
    this.verify = function (data){
        return $http.post(host+'/user/verify',{
            uid: data.id,
            code: data.code
            
        })
            .then(
                function(res){
                    if(res.data.result){
                        return {result:true};
                    }else{
                        return {result:false,err:res.data.err};
                    }
                },errResponseHandler);


    };
    
    this.active = function (data){
        return $http.post(host+'/user/active',{
            eduEmail: data.eduEmail,
        })
            .then(
                function(res){
                    console.log(res);
                    if(res.data.result){
                        return {result:true};
                    }else{
                        return {result:false,err:res.data.err};
                    }
                },errResponseHandler);


    };
    
    this.userSelf = function (data){
        return $http.get(host+'/userself',{
            
        })
            .then(
                function(res){
                    //console.log(res);
                    if(res.data.result){
                        return {result:true,data:res.data.data};
                    }else{
                        return {result:false};
                    }
                },errResponseHandler);

    };


    this.checkreset = function (data){
        //console.log("1");
        return $http.post(host+'/checkreset',{
            token: data.token
        })
        .then(
            function(res){
                //console.log("server" + res);
                if(res.data.result){
                    return {result:true};
                }else{
                    return {result:false,err:res.data.err};
                }
            },errResponseHandler);
    };

    this.resetpassword = function (data){
        //console.log("2");
        return $http.put(host+'/reset',{
            id: data.id,
            password: data.password
        })
        .then(
            function(res){
                //console.log("3");
                //console.log(res);
                if(res.data.result){
                    return {result:true};
                }else{
                    return {result:false,err:res.data.err};
                }
            },errResponseHandler);
    };

    this.sendmessage = function (data) {
        return $http.post(host+'/sendmessage',{
            id: data.id,
            content: data.content
        })
        .then(
            function(res){
                if(res.data.result){
                    return {result:true};
                }else{
                    return {result:false,err:res.data.err};
                }
            },errResponseHandler);
    }

    /*this.logOut = function() {
        return $http.get(host+'/logout')
            .then(function(){
            userService.setLoginState(false);    
        },
            errResponseHandler
        );
        //delete $cookies.hereseasUser;
    };*/
    
    /*this.getUser = function(){

        //console.log('cookie:',JSON.parse($cookieStore.get('hereseas.user')));

        this.getStoredUser();

        return $http.get(host+'/user/'+userService.userInfo.id)
            .then(function(res){
                if(res.data.result){
                    userService.user = res.data.data;
                    return {result:true,data:res.data.data  }
                }else
                    return {result:false,err:res.err};
            },errResponseHandler);
    };*/

    /*this.initLoginState = function() {
        return $http.get(host+'/init')
            .then(function(res){
                console.log("init",res);
                if(res.data.result){
                    
                    userService.setLoginState(true);
                }
                return commonResponseHandler(res);
            },errResponseHandler);
    };*/

    /*this.registerUser = function (data) {
        return $http.post(host+'/user', {
            email: data.email,
            password: data.password
        }).then(
            commonResponseHandler,
            errResponseHandler
        );

    }*/
    /*this.login = function (data){
        return $http.post(host+'/login', data)
            .then(function(res){
                if(res.data.result){
                    
                    console.log('login',res);
                    
                    userService.setLoginState(true);
                    console.log("loginstate",loginState);
                }
                return commonResponseHandler(res);
            },errResponseHandler);
    };*/

    return userService;
});
