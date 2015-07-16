hereseasApp.factory('userService', function ($http) {

    var host = "";



    return {
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
                .then(commonResponseHandler,errResponseHandler);
        }
    };
});
