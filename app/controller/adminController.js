hereseasApp.controller('AdminController', function ($scope, requestService, userService, $state){
    $scope.users = [];
    requestService.AdminGetUserInfo(function(res){
        angular.forEach(res.data, function (key){
            //console.log(res.data);
            var tmp = {};
            tmp.email = key.email;
            tmp.username = key.username;
            tmp.createAt = key.createAt.slice(0, 10);
            tmp.avatar = key.avatar;

            requestService.GetSchool({id: key.schoolId}, function(res2) {
                if (res2.result) {

                    tmp.school = res2.data.shortName;
                    //console.log(tmp.school);
                    //console.log(tmp);
                    $scope.users.push(tmp);
                    
                } else {
                    //http get school id error
                    tmp.school = "No School";
                    $scope.users.push(tmp);
                }
            });
        });


    });
    $scope.hoverIn = function(){
        this.hoverInfo = true;
    };
    $scope.hoverOut = function(){
        this.hoverInfo = false;
    };
     $scope.goHome = function() {
        $state.go('home');    
    };
});