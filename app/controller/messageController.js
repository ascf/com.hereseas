hereseasApp.controller('MessageCtrl', function ($scope, $stateParams, requestService, userService){
    requestService.GetApt({id: $stateParams.aptId}, function(res){
        if(res.result){
            $scope.data = res.data[0];
            $scope.userData = {};
            $scope.userData.id = $scope.data.userId;
            
            $scope.sendmessage = function() {
                console.log($scope.userData);
                userService.sendmessage({
                    id: $scope.userData.id,
                    content: $scope.userData.content
                }).then(function (res) {
                    console.log(res);
                    //console.log(res.result);
                    if (res.result) {
                        alert("Message has been sent");
                    } else {
                        alert("err");
                    }
                });

            }
        }
    });
});
