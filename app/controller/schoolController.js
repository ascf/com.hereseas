hereseasApp.controller('SchoolController', function ($stateParams,$scope,$cookies,roomService, requestService, $window, $state) {
    $scope.schoolId = $stateParams.schoolId;
    
//    $scope.bgImg = "/app/view/img/school/bg1.svg";
//    $scope.schlImg = "/app/view/img/school/gwu_title.JPG";

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
    $scope.hasApt = [
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
            //console.log(res.data);
            $scope.newSchoolMates = res.data;
        });
        
        requestService.GetSchoolMates({id: $stateParams.schoolId}, function(res){
            //console.log(res.data);
            $scope.schoolMates = res.data;
        });

        requestService.GetThreeApts({schoolId: id}, function(res){
            //console.log(res);  
            if(res.result){
                $scope.aptImg1 = res.data[0].cover;
                $scope.aptId1 = res.data[0]._id;
                $scope.hasApt[0].exist = true;
                if(res.data.length >= 2){
                    $scope.aptImg2 = res.data[1].cover;
                    $scope.aptId2 = res.data[1]._id;
                    $scope.hasApt[1].exist = true;
                }
                if(res.data.length >= 3)
                {
                    $scope.aptImg3 = res.data[2].cover;
                    $scope.aptId3 = res.data[2]._id;
                    $scope.hasApt[2].exist = true;
                }
            }
        });
        
        requestService.GetThreeItems({schoolId: id}, function(res){
            //console.log(res);
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
            //console.log(res); 
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
    
    $scope.showOtherUserInfo = function(othersId){
        $state.go('othersProfile',{schoolId:$stateParams.schoolId,othersId:othersId}); 
    }
    
    
});


hereseasApp.controller('SchoolSearchCtrl', function($scope, $state,requestService) {
/*
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
        
        $scope.clicked = false;
        $scope.clickSearch = function() {
            //console.log("chaned");
            if ($scope.selected == undefined || $scope.selected == "") {
                console.log("haha");
                //$state.go('school',{schoolId:$scope.ids[$scope.schools.indexOf(0)]}); 
            }
        }
        

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

*/

    

    requestService.GetSchools(function(res){
        $scope.hschools = [];
        $scope.ids = [];

        var schools = [];

        for(var i=0; i<res.data.length; i++){
            $scope.hschools.push(res.data[i].name);
            $scope.ids.push(res.data[i]._id);
            schools.push(res.data[i]);
        }
      

        $scope.$watch(
          function() { return $scope.selected; },
          function(newValue, oldValue) {
            if ( (newValue !== oldValue) && (newValue !== undefined) && (newValue !== "") &&($scope.hschools.indexOf(newValue) !== -1) ) {
                $state.go('school',{schoolId:$scope.ids[$scope.hschools.indexOf(newValue)]}); 
            }
          }
        );
        
        var substringMatcher = function(strs) {
          return function findMatches(q, cb) {
                
                var matches, substringRegex;

                // an array that will be populated with substring matches
                matches = [];

                // regex used to determine if a string contains the substring `q`
                substrRegex = new RegExp(q, 'i');

                // iterate through the pool of strings and for any string that
                // contains the substring `q`, add it to the `matches` array
                $.each(strs, function(i, str) {
                    
                  if (substrRegex.test(str.name)) {
                    matches.push(str);
                  }
                });

                cb(matches);
          };
        };


        $('#the-basics .typeahead').typeahead({minLength: 0}, {
          name: 'best-pictures',
          display: 'value',
          source: substringMatcher(schools),
          templates: {
            empty: [
              '<div class="empty-message" style="text-align: center; color: black; padding: 5px, 10px;">',
                '您的学校正在开通，请先到附近的学校逛逛吧',
              '</div>'
            ].join('\n'),
            suggestion:  function(data) {
                return '<div class="tt-pic">' + '<img src="' + data.avatar + '" width=30 height= 30/>' + '<strong>&nbsp&nbsp' + data.name + '</strong>' + '</div>';
            }
            
          }
        });

        $('.typeahead').bind('typeahead:select', function(ev, suggestion) {
          $state.go('school',{schoolId:suggestion._id}); 
        });

    });


});

/*
//This code is to show typeahead when focus on input.
hereseasApp.directive('typeaheadFocus', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attr, ngModel) {

      //trigger the popup on 'click' because 'focus'
      //is also triggered after the item selection
      element.bind('click', function () {

        var viewValue = ngModel.$viewValue;

        //restore to null value so that the typeahead can detect a change
        if (ngModel.$viewValue == ' ') {
          ngModel.$setViewValue(null);
        }

        //force trigger the popup
        ngModel.$setViewValue(' ');

        //set the actual value in case there was already a value in the input
        ngModel.$setViewValue(viewValue || ' ');
      });

      //compare function that treats the empty space as a match
      scope.emptyOrMatch = function (actual, expected) {
        if (expected == ' ') {
          return true;
        }
        return actual.indexOf(expected) > -1;
      };
    }
  };
});
*/
hereseasApp.controller('SchoolMatesCtrl', function($scope, $stateParams, $state, requestService) {

    requestService.GetSchoolMates({id: $stateParams.schoolId}, function(res){
        //console.log(res.data);

        $scope.schoolMates = res.data;
    });
    
    $scope.seeOthersProfile = function(index){
        //console.log(index);
        $state.go('othersProfile',{othersId:$scope.schoolMates[index]._id, schoolId:$stateParams.schoolId}); 
    }

});
