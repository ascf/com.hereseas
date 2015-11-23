hereseasApp.controller('MessageCtrl', function ($scope, userService,$mdDialog){

    $scope.userData = {};
    //console.log($mdDialog);
    $scope.sendmessage = function() {
        //console.log($scope.userData);
        
        userService.sendmessage({
            id: $mdDialog.recvId,
            content: $scope.userData.content
        }).then(function (res) {
            //console.log(res);
            //console.log(res.result);
            if (res.result) {
                alert("Message has been sent");
            } else {
                alert("err");
            }
        });
    }
});
