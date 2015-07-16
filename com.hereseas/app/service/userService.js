hereseasApp.factory('userService', function ($http) {

    var host = "";



    return {
        registerUser: function (data) {
            return $http.post('/user', {
                email: data.email,
                password: data.password
            }).then(
                commonResponseHandler,
                errResponseHandler
            );

        }
    };
});
