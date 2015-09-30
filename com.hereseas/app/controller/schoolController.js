hereseasApp.controller('SchoolController', function ($scope, roomService) {
    
    $scope.aptId1 = "55be72bfac3a703e065b81b4";
    $scope.aptId2 = "55be72bfac3a703e065b81b4";
    
    roomService.setAptIds($scope.aptId1, $scope.aptId2, $scope.aptId2);
    
});