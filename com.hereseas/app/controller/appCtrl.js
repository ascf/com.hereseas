hereseasApp.controller('AppCtrl',
    function ($scope, $stateParams, $rootScope, $location) {


});

hereseasApp.controller('LoginCtrl',
    function ($scope, $stateParams,
        $rootScope, $location,
        $mdDialog, userService) {

        $scope.signUpData = {

        };

        $scope.signUpSubmit = function () {
            console.log($scope.signUpData);

            userService.registerUser($scope.signUpData)
                .then(function (res) {
                    console.log(res);
                    if (res.result) {
                        alert("created");
                    } else {
                        //alert("failed");

                        $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .title('This is an alert title')
                            .content('You can specify some description text in here.')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Got it!')
                            //.targetEvent(ev)
                        );
                    }
                });
        };
    });

hereseasApp.controller('LoginController', function ($scope, $state) {
    // create blank user variable for login form
    $scope.user = {
        email: 'info@oxygenna.com',
        password: 'demo'
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
        $state.go('admin-panel.default.introduction');
    };
});