hereseasApp.controller('SchoolController', function ($stateParams,$scope, roomService, requestService, $window, $state) {
    $scope.schoolId = $stateParams.schoolId;
    
    requestService.GetSchool({id:$stateParams.schoolId}, function(res){
        console.log("school:",res.data);
        $scope.image = res.data.image;
        $scope.avatar = res.data.avatar;
    });
    
    
    requestService.GetThreeApts({schoolId: $stateParams.schoolId}, function(res){
        console.log(res);       
        $scope.aptImg1 = res.data[0].cover;
        $scope.aptImg2 = res.data[1].cover;
        $scope.aptImg3 = res.data[2].cover;
        $scope.aptId1 = res.data[0]._id;
        $scope.aptId2 = res.data[1]._id;
        $scope.aptId3 = res.data[2]._id;
    });

    $scope.goodImg1 = '/app/view/img/goods/goods.png';
    $scope.goodImg2 = '/app/view/img/goods/goods.png';
    $scope.goodImg3 = '/app/view/img/goods/goods.png';
    $scope.aptId1 = '1';
    $scope.aptId2 = '2';
    $scope.aptId3 = '3';
    
    $scope.carImg1 = '/app/view/img/car/car_temp.jpg';
    $scope.carImg2 = '/app/view/img/car/car_temp.jpg';
    $scope.carImg3 = '/app/view/img/car/car_temp.jpg';
    
    $scope.bgImg = "/app/view/img/school/bg1.svg";
    $scope.schlImg = "/app/view/img/school/gwu_title.JPG";
    $scope.new_users = [
            {img :"/app/view/img/user/img1.JPG"},
            {img :"/app/view/img/user/img1.JPG"},
            {img :"/app/view/img/user/img1.JPG"},
            {img :"/app/view/img/user/img1.JPG"},
            {img :"/app/view/img/user/img1.JPG"},
            {img :"/app/view/img/user/img1.JPG"},
    ];
    
    
    $scope.showAllApts = function(){
        $state.go('allApts',{schoolId:$stateParams.schoolId}); 
    };
    
    $scope.showAllCars = function(){
        $state.go('allCars'); 
    };
    
    $scope.showAllGoods = function(){
        $state.go('allGoods'); 
    };
    
});


hereseasApp.controller('SchoolSearchCtrl', function($scope, requestService) {

    $scope.selected = undefined;
    
    requestService.GetSchools(function(res){
        //console.log("schools", res.data);
        $scope.schools = [];
        $scope.ids = [];
        for(var i=0; i<res.data.length; i++){
            $scope.schools.push(res.data[i].name);
            $scope.ids.push(res.data[i]._id);
        }
        
        /*$scope.$on('getSchoolName',function (e, result){
            $scope.selected = result;
        });
        
        
        $scope.$watch(
          function() { return $scope.selected; },
          function(newValue, oldValue) {
            if ( (newValue !== oldValue) && (newValue !== undefined) && (newValue !== "") &&($scope.schools.indexOf(newValue) !== -1) ) {
                console.log($scope.ids[$scope.schools.indexOf(newValue)]);
                $scope.$emit('schoolNameChanged', 
                             {id:$scope.ids[$scope.schools.indexOf(newValue)],
                              name:newValue} );
            }
          }
        );*/
    });

});
