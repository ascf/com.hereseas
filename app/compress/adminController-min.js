hereseasApp.controller("AdminController",function($scope,requestService,userService,$state,$cookies){requestService.GetUserSelf(function(res){if(!res.result){$state.go("home")}});$scope.users=[];$scope.isAdmin=false;requestService.AdminGetUserInfo(function(res){if(res.result==true){$scope.isAdmin=true;angular.forEach(res.data,function(key){var tmp={};tmp.email=key.email;tmp.username=key.username;tmp.createAt=key.createAt.slice(0,10);tmp.avatar=key.avatar;requestService.GetSchool({id:key.schoolId},function(res2){if(res2.result){tmp.school=res2.data.shortName;$scope.users.push(tmp)}else{tmp.school="No School";$scope.users.push(tmp)}})})}else{$state.go("home")}});$scope.hoverIn=function(){this.hoverInfo=true};$scope.hoverOut=function(){this.hoverInfo=false};$scope.goHome=function(){$state.go("home")}});