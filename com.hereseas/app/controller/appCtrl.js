hereseasApp.controller('AppCtrl',
    function ($scope, $stateParams, $rootScope, $location) {


    });

hereseasApp.controller('HeaderController',
    function ($scope, $stateParams, $rootScope, $location) {


    });

hereseasApp.controller('FooterController',
    function ($scope, $stateParams, $rootScope, $location) {

    });


hereseasApp.controller('CommonController',
    function ($scope, $stateParams, $rootScope, $location) {

    });


hereseasApp.controller('LoginCtrl',
    function ($scope, $stateParams,
              $rootScope, $location,
              $mdDialog, userService, alertService) {

        $scope.signUpData = {};

        $scope.signUpSubmit = function () {
            console.log($scope.signUpData);

            userService.registerUser($scope.signUpData)
                .then(function (res) {
                    console.log(res);
                    if (res.result) {
                        alert("created");
                    } else {
                        //alert("failed");

                        alertService.alert('The email has already been registered!');
                    }
                });
        };
    });

hereseasApp.controller('LoginController',
    function ($scope, $state, userService, alertService) {
        // create blank user variable for login form
        $scope.user = {
            email: 'yangmang@msn.com',
            password: 'mission'
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

        // controller to handle login check
        $scope.loginClick = function () {

            userService.login($scope.user)
                .then(function (res) {
                    if (res.result) {
                        $state.go('user.dashboard');
                    } else {
                        //alert!
                        alertService.alert(res.err);
                    }
                });

        };
    });
