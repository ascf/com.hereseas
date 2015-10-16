hereseasApp.controller('VerifyController',
    function ($scope, $stateParams, $rootScope, $location, $state, $timeout,
              userService, alertService) {
    
        //account verify
        if ($state.current.name == 'verify' && $location.$$search.uid && $location.$$search.code && $location.$$search.action == 'activate') {

            $scope.activated = false;
            $scope.activating = true;
            $scope.sendInfo = '';
            
            $scope.activateSubmit = function () {
                userService.verify({
                    id: $location.$$search.uid,
                    code: $location.$$search.code
                })
                    .then(function (res) {
                        console.log(res.result);
                        $scope.activating = false;
                        if (res.result) {
                            $scope.activated = true;
                        } else {
                            $scope.activated = false;
                            $scope.errInfo = res.err;
                        }
                    })
            };

            $scope.activateSubmit();
        }
        else {
            $scope.brokenLink = true;
        }
        //$scope.activating = true;
    });