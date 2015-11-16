hereseasApp.controller('SchoolController', function ($stateParams,$scope, roomService, requestService, $window, $state) {
    $scope.schoolId = $stateParams.schoolId;
    
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
    $scope.hasItem = [
        {exist: false},
        {exist: false},
        {exist: false},
    ];
    $scope.hasCar = [
        {exist: false},
        {exist: false},
        {exist: false},
    ];
    $scope.hasSchool = [
        {exist: false},
        {exist: false},
        {exist: false},
    ];

    init($stateParams.schoolId);
    
    function init(id){
        requestService.GetSchool({id:id}, function(res){
            //console.log("school:",res.data);
            $scope.image = res.data.image;
            $scope.avatar = res.data.avatar;
        });

        requestService.GetNewSchoolMates({id:id}, function(res){
            console.log(res.data);
            $scope.newSchoolMates = res.data;
        });

        requestService.GetThreeApts({schoolId: id}, function(res){
            //console.log(res);  
            if(res.result){
                $scope.aptImg1 = res.data[0].cover;
                $scope.aptId1 = res.data[0]._id;
                if(res.data.length >= 2){
                    $scope.aptImg2 = res.data[1].cover;
                    $scope.aptId2 = res.data[1]._id;
                }
                if(res.data.length >= 3)
                {
                    $scope.aptImg3 = res.data[2].cover;
                    $scope.aptId3 = res.data[2]._id;
                }
            }
        });
        
        requestService.GetThreeItems({schoolId: id}, function(res){
            console.log(res);
            if(res.result){
                $scope.itemImg1 = res.data[0].cover;
                $scope.itemId1 = res.data[0]._id;
                $scope.hasItem[0].exist = true;
                if(res.data.length >= 2)
                {
                    $scope.itemImg2 = res.data[1].cover;
                    $scope.itemId2 = res.data[1]._id;
                    $scope.hasItem[1].exist = true;
                }
                if(res.data.length >= 3)
                {
                    $scope.itemId3 = res.data[2]._id;
                    $scope.itemImg3 = res.data[2].cover;
                    $scope.hasItem[2].exist = true;
                }
            }
        });
        
        requestService.GetThreeCars({schoolId: id}, function(res){
            console.log(res); 
            if(res.result){
                $scope.carImg1 = res.data[0].cover;
                $scope.carId1 = res.data[0]._id;
                $scope.hasCar[0].exist = true;
                if(res.data.length >= 2)
                {
                    $scope.carId2 = res.data[1]._id;
                    $scope.carImg2 = res.data[1].cover;
                    $scope.hasCar[1].exist = true;
                }
                if(res.data.length >= 3)
                {
                    $scope.carId3 = res.data[2]._id;
                    $scope.carImg3 = res.data[2].cover;
                    $scope.hasCar[2].exist = true;
                }
            }
        });


    };
    
    $scope.showAllApts = function(){
        $state.go('allApts',{schoolId:$stateParams.schoolId}); 
    };
    
    $scope.showAllCars = function(){
        $state.go('allCars',{schoolId:$stateParams.schoolId}); 
    };
    
    $scope.showAllItems = function(){
        $state.go('allItems',{schoolId:$stateParams.schoolId}); 
    };
    
    $scope.showAllActivs = function(){
        $state.go('allActivs',{schoolId:$stateParams.schoolId}); 
    };
    
    
});


hereseasApp.controller('SchoolSearchCtrl', function($scope, $state,requestService) {

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
        
        */
        $scope.$watch(
          function() { return $scope.selected; },
          function(newValue, oldValue) {
            if ( (newValue !== oldValue) && (newValue !== undefined) && (newValue !== "") &&($scope.schools.indexOf(newValue) !== -1) ) {
                //console.log($scope.ids[$scope.schools.indexOf(newValue)]);
                $state.go('school',{schoolId:$scope.ids[$scope.schools.indexOf(newValue)]}); 
            }
          }
        );
    });

});

hereseasApp.controller('SchoolMatesCtrl', function($scope, $stateParams, $state, requestService) {

    requestService.GetSchoolMates({id: $stateParams.schoolId}, function(res){
        console.log(res.data);
        $scope.schoolMates = res.data;
    });
    
    $scope.seeOthersProfile = function(index){
        console.log(index);
        $state.go('othersProfile',{othersId:$scope.schoolMates[index]._id}); 
    }

});
