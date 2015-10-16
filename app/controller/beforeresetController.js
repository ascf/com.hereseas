hereseasApp.controller('BeforeResetController', 
	function ($scope, requestService, userService){
	$scope.userData = {};	
	$scope.createForgetter = function () {
		//console.log($scope.userData)
        requestService.CreateForgetter($scope.userData, function(res) {
        	//console.log(res);
        	if (res.result) {
        		alert("email has been sent" );
        	} else {
        		alert("err");
        	}

        });
    };
});