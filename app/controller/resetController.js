hereseasApp.controller('ResetController', 
	function ($scope, $stateParams, $rootScope, $location, $state, $timeout, $cookies,
		userService, requestService){
	//console.log($location.$$search.token)
	$scope.userData = {};
	//$scope.activated = false;
	$scope.reset = false;
	$scope.userData.id = $location.$$search.token;
	if ($state.current.name == 'reset' && $location.$$search.token) {
		//console.log($location.$$search.token)
		userService.checkreset({
            token: $location.$$search.token
        }).then(function (res) {
        	//console.log(res);
            console.log(res.result);
            if (res.result) {
                $scope.activated = true;
            } else {
                $scope.activated = false;
            }
        })
	} else {}

	$scope.resetPassword = function () {
		//console.log($scope.userData)
		if ($scope.activated) {
			//console.log($scope.activated)
			//console.log($scope.userData);
			//console.log($scope.userData.id);
			userService.resetpassword({
            	id: $scope.userData.id,
            	password: $scope.userData.password
	        }).then(function (res) {
	        	//console.log(res);
	            //console.log(res.result);
	            if (res.result) {
	                //alert("Password has been reset");
	                $scope.reset = true;

			        requestService.LogOut(function() {
			            userService.setLoginState(false);
			            $cookies.login = false;
			            $scope.$emit('logout','1');
			            //$state.reload();
			            $scope.reset = true;
			            $scope.activated = true;
			            //console.log("logour");
			        });
   
	            } else {
	                alert("err");
	            }
	        })
		}
    };

    $scope.goHome = function() {
        $state.go('home');    
    };
});