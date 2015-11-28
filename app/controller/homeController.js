hereseasApp.controller('HomeController', ['$scope','requestService',function ($scope, requestService) {
    requestService.GetThreeSchools(function(res){
        $scope.schools = res.data;
    });
}]);


