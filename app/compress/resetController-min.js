hereseasApp.controller("ResetController",function($scope,$stateParams,$rootScope,$location,$state,$timeout,$cookies,userService,requestService){$scope.userData={};$scope.reset=false;$scope.userData.id=$location.$$search.token;if($state.current.name=="reset"&&$location.$$search.token){userService.checkreset({token:$location.$$search.token}).then(function(res){if(res.result){$scope.activated=true}else{$scope.activated=false}})}else{}$scope.resetPassword=function(){if($scope.activated){userService.resetpassword({id:$scope.userData.id,password:$scope.userData.password}).then(function(res){if(res.result){$scope.reset=true;requestService.LogOut(function(){$cookies.login=false;$scope.$emit("logout","1");$scope.reset=true;$scope.activated=true})}else{alert("err")}})}};$scope.goHome=function(){$state.go("home")}});