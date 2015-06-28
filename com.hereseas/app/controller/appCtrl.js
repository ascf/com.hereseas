hereseasApp.controller('AppCtrl', function ($scope, $stateParams, $rootScope, $location) {


});

hereseasApp.controller('LoginCtrl', function ($scope, $stateParams, $rootScope, $location, userService) {

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
                    alert("failed");
                }
            });
    };
});