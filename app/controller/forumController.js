hereseasApp.controller('ForumController', function ($stateParams,$scope, $mdDialog, userService, requestService, alertService, $window, $state) {

    requestService.GetForumThreads({id:$stateParams.schoolId},function(res){
        console.log(res);
        if(res.result){
            $scope.threads = res.data.threads;
            console.log($scope.threads);
        }
    });
    
    $scope.goToArticle = function(threadId){
        $state.go('article',{id:threadId});
        
    };
    
    $scope.showArticlePost = function showArticlePost(ev) {
        console.log(1);
        var flag = userService.getLoginState();
        //should have logged in to post room
        if(flag)
        {
            if(userService.getUser().schoolId=="")
                alertService.alert("请先完善个人信息（first name 和 last name）");
            else
            {
                //userService.setDraft({});                   

                $mdDialog.show({
                    //controller: RoomPostController,
                    templateUrl: '/app/view/article_post.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:false
                });
            }
        }
        else alertService.alert("请先登录").then(function() {
                $scope.showLogin();
        });
    };
    
    $scope.showLogin = function(ev) {
        userService.setSignupOrLogin('login');
        $mdDialog.show({
          templateUrl: '/app/view/signup_login.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        });
    };
    
});

hereseasApp.controller('ArticleController', function ($stateParams,$scope, roomService, requestService, $window, $state) {

    requestService.GetForumThreadById({id:$stateParams.id},function(res){
        console.log(res);
        if(res.result){
            $scope.thread = res.data;
            console.log($scope.thread);
        }
    });
    
    requestService.GetForumCommentsById({id:$stateParams.id},function(res){
        console.log(res);
        if(res.result){
            $scope.threadComments = res.data.comments;
            console.log($scope.threadComments);
        }
    });
    
    if($stateParams.style == "long"){
        console.log(0);
        $scope.isLong = true;
    }
    
    $scope.postComment = function(){
        
        requestService.PostForumComment({schoolId:$scope.thread.schoolId,threadId:$scope.thread._id,content:$scope.content},function(res){
            console.log(res);
            
        })
    }
    
});


hereseasApp.controller('ArticlePostController', function ($stateParams, $scope, $mdDialog, requestService, $window, $state) {

    $scope.postArticle = function(){
        
        requestService.PostForumThread({schoolId:$stateParams.schoolId,title:$scope.title,content:$scope.content},function(res){
            console.log(res);
            if(res.result){
                 $mdDialog.hide();
            }
            
        })
    }
    
    $scope.cancel = function(){
        $mdDialog.hide();
    };
    
});



