hereseasApp.factory('userService', function($http, $state, $cookies) {


    var userService = this;
    var host = "http://www.hereseas.com";
    //var host = "http://52.25.82.212:8080";

    var toSignup = false;
    var toLogin = false;

    var loginState = false;

    var userInfo = {};
    var draft = {};
    var carDraft = {};
    //var itemDraft = [];

    var signupOrLogin = 'login';

    this.getHost = function() {

        return host;
    };


    this.setSignupOrLogin = function(state) {
        signupOrLogin = state;
    };

    this.getSignupOrLogin = function() {
        return signupOrLogin;
    };


    this.setDraft = function(data) {
        draft = data;
    };

    this.getDraft = function() {
        return draft;
    };

    this.setCarDraft = function(data) {
        carDraft = data;
    };

    this.getCarDraft = function() {
        return carDraft;
    };


    this.setUser = function(info) {
        userInfo = info;
    };

    this.getUser = function() {
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
    this.verify = function(data) {
        return $http.post(host + '/user/verify', {
                uid: data.id,
                code: data.code

            })
            .then(
                function(res) {
                    if (res.data.result) {
                        return {
                            result: true
                        };
                    } else {
                        return {
                            result: false,
                            err: res.data.err
                        };
                    }
                }, errResponseHandler);


    };

    this.active = function(data) {
        return $http.post(host + '/user/active', {
                eduEmail: data.eduEmail,
            })
            .then(
                function(res) {
                    console.log(res);
                    if (res.data.result) {
                        return {
                            result: true
                        };
                    } else {
                        return {
                            result: false,
                            err: res.data.err
                        };
                    }
                }, errResponseHandler);


    };


    this.checkreset = function(data) {
        //console.log("1");
        return $http.post(host + '/checkreset', {
                token: data.token
            })
            .then(
                function(res) {
                    //console.log("server" + res);
                    if (res.data.result) {
                        return {
                            result: true
                        };
                    } else {
                        return {
                            result: false,
                            err: res.data.err
                        };
                    }
                }, errResponseHandler);
    };

    this.resetpassword = function(data) {
        //console.log("2");
        return $http.put(host + '/reset', {
                id: data.id,
                password: data.password
            })
            .then(
                function(res) {
                    //console.log("3");
                    //console.log(res);
                    if (res.data.result) {
                        return {
                            result: true
                        };
                    } else {
                        return {
                            result: false,
                            err: res.data.err
                        };
                    }
                }, errResponseHandler);
    };

    this.sendmessage = function(data) {
        return $http.post(host + '/sendmessage', {
                id: data.id,
                content: data.content
            })
            .then(
                function(res) {
                    if (res.data.result) {
                        return {
                            result: true
                        };
                    } else {
                        return {
                            result: false,
                            err: res.data.err
                        };
                    }
                }, errResponseHandler);
    }

    this.updateMessages = function(data) {
        return $http.put(host + '/readmessage', {
                id: data.id
            })
            .then(
                function(res) {
                    if (res.data.result) {
                        return {
                            result: true
                        };
                    } else {
                        return {
                            result: false,
                            err: res.data.err
                        };
                    }
                }, errResponseHandler);
    }

    this.postFavorite = function(data) {
        return $http.post(host + '/favorite', {
                id: data.id,
                category: data.category
            })
            .then(
                function(res) {
                    if (res.data.result) {
                        return {
                            result: true
                        };
                    } else {
                        return {
                            result: false,
                            err: res.data.err
                        };
                    }
                }, errResponseHandler);
    };

    this.deleteFavorite = function(data) {
        return $http({
                url: host + '/favorite',
                method: 'DELETE',
                data: {
                    id: data.id,
                    category: data.category
                },
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                }
            })
            .then(
                function(res) {
                    if (res.data.result) {
                        return {
                            result: true
                        };
                    } else {
                        return {
                            result: false,
                            err: res.data.err
                        };
                    }
                }, errResponseHandler);
    };

    return userService;
});