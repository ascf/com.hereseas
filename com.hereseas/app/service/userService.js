hereseasApp.factory('userService', function ($http, $cookies) {

    var host = "";

    /**
     *
     * @type {{}}
     */
    var user = {};

    return {
        user: user,
        getStoredUser : function(){
            this.user = $cookies.getObject('hereseas.user');
            console.log('user in cookies:',this.user);
        },
        registerUser: function (data) {
            return $http.post(host+'/user', {
                email: data.email,
                password: data.password
            }).then(
                commonResponseHandler,
                errResponseHandler
            );

        },
        login : function (data){
            return $http.post(host+'/login',data)
                .then(function(res){
                    if(res.data.result){
                        this.user = {
                            username : data.username,
                            password : data.password,
                            id : res.data.id
                        }
                        if(data.save){
                            $cookies.putObject('hereseas.user',this.user);
                        }
                    }
                    return commonResponseHandler(res);
                },errResponseHandler);
        }
    };
});
