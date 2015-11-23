hereseasApp.controller('HomeController', function ($scope, userService, alertService, $state, $mdDialog, requestService) {
    //console.log("abcdefgh");
    
    requestService.GetThreeSchools(function(res){
        //console.log(res.data);
        $scope.schools = res.data;
    });
   

    
});


