hereseasApp.factory('userService', function ($http) {

    var host = "";


    var commonResponseHandler = function (res) {
        return {
            result: true,
            data: res.data
        }
    };

    var errResponseHandler = function (res) {
        return {
            result: false,
            err: 'Server error:' + res.status
        };
    };

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