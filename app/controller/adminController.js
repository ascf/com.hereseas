hereseasApp.controller('AdminController', function ($scope, requestService, userService){
    $scope.users = {};
    requestService.AdminGetUserInfo(function(res){
        $scope.users = res.data;
    });
    $scope.hoverIn = function(){
        this.hoverInfo = true;
    };
    $scope.hoverOut = function(){
        this.hoverInfo = false;
    };
});