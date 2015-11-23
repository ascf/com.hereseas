hereseasApp.controller('ForumController', function ($stateParams,$scope, $mdDialog, userService, requestService, alertService, $window, $state) {
    $scope.pages = 0;
    $scope.threads = [];
    var cur_page = 1;
    var max_page = 1;
    $scope.schoolId = $stateParams.schoolId;
    function updatepage(){
        requestService.GetForumBySchool({id:$stateParams.schoolId,page:cur_page,pageSize:20},function(res){
            //console.log(res);
            if(res.result){
                $scope.pages = res.data.totalPages;
                $scope.threads = res.data.threads;
                // store number of max pages
                max_page = res.data.totalPage;
                $scope.pages = [];
//                $scope.pages_pre_dot = false;
//                $scope.pages_end_dot = false;
                for(var i=0; i<max_page; i++){
                    $scope.pages[i] = {};
                    $scope.pages[i].id = i+1;
                    
                    if(i == cur_page-1){
                        $scope.pages[i].selected = true;
                        $scope.pages[i].show = true;
                    }else{
                        $scope.pages[i].selected = false;
                    }
                    
                    if(i < cur_page -1){
                        if(i > cur_page-4){
                            $scope.pages[i].show = true;
                        }else{
                            $scope.pages[i].show = false;
                            $scope.pages_pre_dot = true;
                        }
                    }
                    
                    if(i > cur_page -1){
                        if(i < cur_page+2){
                            $scope.pages[i].show = true;
                        }else{
                            $scope.pages[i].show = false;
                            $scope.pages_end_dot = true;
                        }
                    }
                }
            }
        });
    }
    
    $scope.goToArticle = function(threadId){
        $state.go('article',{schoolId:$scope.schoolId,id:threadId});
        
    };
    
    $scope.showArticlePost = function showArticlePost(ev) {
        //console.log(1);
        requestService.GetUserSelf(function (res) { 
            if (res.result){
                //should have logged in to post room
                if($cookies['schoolId'] =="")
                    alertService.alert("请先完善个人信息（first name 和 last name）");
                else{
                    //userService.setDraft({});                   

                    $mdDialog.show({
                        //controller: RoomPostController,
                        templateUrl: '/app/view/article_post.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:false
                    });
                }
            }else alertService.alert("请先登录").then(function() {
                    $scope.showLogin();
            });
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
        
    $scope.setPage = function(pg){
        cur_page = pg+1;
        $scope.page = cur_page;
        updatepage();
    };
    
    $scope.previous = function(){
        if(cur_page - 1 > 0){
            cur_page = cur_page - 1;
        }
        $scope.page = cur_page;
        updatepage();
    };
    
    $scope.next = function(){
        if(cur_page + 1 <= max_page){
            cur_page = cur_page + 1;
        }
        $scope.page = cur_page;
        updatepage();
    };
    
    $scope.setPage(0);
});

hereseasApp.controller('ArticleController', function (userService,$sce,$stateParams,$scope,alertService,$mdDialog,requestService, $window, $state) {

    $scope.pages = 0;
    var cur_page = 1;
    var max_page = 1;
    
    requestService.GetUserSelf(function (res) { 
        if (res.result){
            $scope.hasLogind = true;
        }else{
            $scope.hasLogind = false;    
        }
    });

    requestService.GetForumThreadById({id:$stateParams.id},function(res){
        //console.log(res);
        if(res.result){
            $scope.thread = res.data;
            $scope.thread.content = $sce.trustAsHtml($scope.thread.content);
            //console.log($scope.thread);
        }
    });
    
    function updateComments(){
        requestService.GetForumCommentsById({id:$stateParams.id,page:cur_page,pageSize:100},function(res){
            //console.log(res);
            if(res.result){
                $scope.pages = res.data.totalPages;
                $scope.threadComments = res.data.comments;
                //console.log($scope.threadComments);
            }
        });
    }
    
    $scope.showOtherUserInfo = function(othersId){
        $state.go('othersProfile',{schoolId:$stateParams.schoolId,othersId:othersId}); 
    }
    
    $scope.postComment = function(){
        if($scope.hasLogind)
        {
            requestService.PostForumComment({schoolId:$scope.thread.schoolId,threadId:$scope.thread._id,content:$scope.content},function(res){
                //console.log(res);
                if(res.result){
                    //console.log($scope.thread.schoolId);
                    $state.go('article',{schoolId:$scope.thread.schoolId,id:$scope.thread._id});
                }else{
                    alert('留言发布失败。');
                }

            });
        }
        else alertService.alert("请先登录").then(function() {
                $scope.showLogin();
        });
    
    }

    $scope.showLogin = function(ev) {
        userService.setSignupOrLogin('login');
        $mdDialog.show({
          templateUrl: '/app/view/signup_login.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        });
    };
    
    $scope.setPage = function(pg){
        cur_page = pg+1;
        $scope.page = cur_page;
        updateComments();
    };
    
    $scope.previous = function(){
        if(cur_page - 1 > 0){
            cur_page = cur_page - 1;
        }
        $scope.page = cur_page;
        updateComments();
    };
    
    $scope.next = function(){
        if(cur_page + 1 <= max_page){
            cur_page = cur_page + 1;
        }
        $scope.page = cur_page;
        updateComments();
    };
    $scope.goToForum = function(){
        $state.go('forum', { schoolId:$stateParams.schoolId });
    };
    $scope.setPage(0);
    
});


hereseasApp.controller('ArticlePostController', function ($stateParams, $scope, $location, $mdDialog, requestService, $window, $state) {

    $scope.postArticle = function(){
        
        requestService.PostForumThread({schoolId:$stateParams.schoolId,title:$scope.title,content:$scope.htmlVariable},function(res){
            //console.log(res);
            if(res.result){
                $mdDialog.hide();
                $state.go('article',{schoolId:$stateParams.schoolId,id:res.data.id});
                
            }else{
                alert('发帖失败。');
            }
            
        })
    }
    
    $scope.cancel = function(){
        $mdDialog.hide();
    };
    
});

hereseasApp.config(['$provide',
  function($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$modal', '$delegate',
      function(taRegisterTool, $modal, taOptions) {
        // $delegate is the taOptions we are decorating
        // here we override the default toolbars specified in taOptions.
        taOptions.toolbar = [
          [],
          [],
          [],
          ['insertLink']
        ];

        // Create our own insertImage button
        taRegisterTool('customInsertImage', {
          iconclass: "fa fa-picture-o",
          action: function() {
            var textAngular = this;
            var savedSelection = rangy.saveSelection();
            var modalInstance = $modal.open({
              // Put a link to your template here or whatever
              template: '<div layout="row" layout-wrap><div style="margin:10 10 10 10;border:1px solid; height:180;width:140px; background-color:rgb(248,248,248);background-repeat:no-repeat; background-size:cover;" layout="column" ng-repeat="pic in images" ng-style="{\'background-image\':\'url(\'+pic.url+\')\'}"><p ng-click="removeImage(pic)">删除</p></div><div style="margin:10 10 10 10;border:1px solid; height:180;width:140px; background-color:rgb(248,248,248);background-repeat:no-repeat; background-size:cover;" layout="column" ng-repeat="img in arrUploads" ng-style="{\'background-image\':\'url(\'+img.content+\')\'}"><div layout="row"><progress ng-show="img.prog > 0" value="{{img.prog/100}}">{{img.prog}}%</progress><div ng-show="img.prog==100">上传成功！</div><div ng-click="img.cancel()">取消</div></div></div><div style="height:180;width:140px;" ngf-drop ngf-select ng-model="files" class="drop-box"  ngf-keep="true" ngf-keep-distinct="true" ngf-drag-over-class="dragover" ngf-multiple="true" ngf-allow-dir="true" accept="image/*"><br />拖动您想要的照片进框中，或者点击以上传，可同时选择多张图片</div></div><button ng-click="submit()">OK</button>',
              controller: ['$modalInstance', '$scope', 'Upload', 'fileReader', 'requestService','userService',
                function($modalInstance, $scope, Upload, fileReader, requestService,userService) {
                    
                    $scope.$watch('files', function (newValue, oldValue) {
                        //files:image upload model
                        
                        if(!angular.equals(newValue, oldValue)&& newValue !== [])
                            //console.log(newValue);
                            $scope.upload($scope.files);
                    });
                    
                    $scope.arrUploads = [];
                    $scope.images = [];
                    
                    $scope.upload = function (files) {
                        if (files && files.length && (files.length<(4-$scope.arrUploads.length))) {
                            //console.log(files);
                            for (var i = $scope.arrUploads.length; i < files.length; i++) {  //ngf-keep为false时从0开始, false时处理重复图片较麻烦
                                $scope.arrUploads.push({file: files[i], prog: 0, content: "default.png", saved : false, cancel: "", id:""});
                            }  
                            //console.log($scope.arrUploads);
                            angular.forEach($scope.arrUploads, function(key){
                                if(key.saved == false)
                                {
                                    //console.log(123);
                                    fileReader.readAsDataUrl(key.file, $scope).then(function(result) {
                                        key.content = result;
                                    });
                                    var up = Upload.upload({
                                        url:userService.getHost()+'/forum/m_upload_image',
                                        file: key.file,
                                        fileFormDataName: 'forum'
                                    }).progress(function (evt) {
                                        key.prog = parseInt(100.0 * evt.loaded / evt.total);
                                    }).success(function (data, status, headers, config) {
                                        //console.log('file ' + config.file.name + 'uploaded. Response: ');
                                        //console.log($scope.arrUploads);
                                        key.saved = true;
                                        key.id = 'https://s3.amazonaws.com/hereseas-public-images/'+data.data;
                                    
                                        //console.log(key.id);

                                        $scope.images.push({url:key.id});
//                                        if($scope.images.length == 1)
//                                            $scope.steps[5].cover = $scope.steps[5].images[0];
                                        $scope.arrUploads.splice($scope.arrUploads.indexOf(key), 1);
                                        $scope.files.splice($scope.files.indexOf(key.file), 1);

                                    }).error(function (data, status, headers, config) {
                                        alert('上传失败'+data);
                                        //console.log('error status: ' + status);
                                    })

                                    key.cancel = function(){
                                        up.abort();     
                                        $scope.arrUploads.splice($scope.arrUploads.indexOf(key), 1);
                                        $scope.files.splice($scope.files.indexOf(key.file), 1);
                                        //console.log("cancel during upload", $scope.files, $scope.arrUploads);
                                    }
                                }
                            });  
                        }
                    };
                    
                  $scope.submit = function() {
                      //console.log($scope.images);
                    $modalInstance.close($scope.images);
                  };
                }
              ]
            });

            modalInstance.result.then(function(images) {
              rangy.restoreSelection(savedSelection);
                 angular.forEach(images, function(image){
                     //console.log(image.url);
                    textAngular.$editor().wrapSelection('insertImage', image.url);
                 });
            });
            return false;
          },
        });

        // Now add the button to the default toolbar definition
        // Note: It'll be the last button
        taOptions.toolbar[3].push('customInsertImage');
        return taOptions;
      }
    ]);
  }
]);


