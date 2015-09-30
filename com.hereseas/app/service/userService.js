hereseasApp.factory('userService', function ($http, $cookies, $state) {


    var userService = this;
//    var host = "http://52.25.82.212:8080";
    
    var host = "http://localhost:8080";
    
    var toSignup = false;
    var toLogin = false;
    /**
     *
     * @type {{}}
     */
    var user = {};
    var userInfo = {};

    this.setUserInfo = function(userInfo){
        this.userInfo = userInfo;
    };
    this.getStoredUser = function(){
        var userInfoCoookie = $cookies.hereseasUser;
        if(userInfoCoookie){
            //console.log("userInfoCoookie",userInfoCoookie);
            this.userInfo = JSON.parse(userInfoCoookie);
        }
        return userInfoCoookie;
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
    
    this.logOut = function() {
        delete $cookies.hereseasUser;
    };
    
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

    this.setUser = function(newUser){
        userService.user = newUser;
    };

    this.registerUser = function (data) {
        return $http.post(host+'/user', {
            email: data.email,
            password: data.password
        }).then(
            commonResponseHandler,
            errResponseHandler
        );

    }
    this.login = function (data){
        return $http.post(host+'/login', data)
            .then(function(res){
                if(res.data.result){
                    
                    console.log('login',res);
                    userService.setUserInfo({
                        username : data.username,
                        password : data.password,
                        id : res.data.id
                    });
                    if(data.save && userService.userInfo){
                        //$cookies.put('hereseas.user',JSON.stringify(userService.userInfo));
                        $cookies.hereseasUser = JSON.stringify(userService.userInfo);
                    };
                }
                return commonResponseHandler(res);
            },errResponseHandler);
    };

    return userService;
});
