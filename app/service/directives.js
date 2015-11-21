/**
 * Created by yangmang on 7/16/15.
 */

var hereseasDirectives = angular.module('hereseasDirectives', []);

hereseasDirectives.directive('matchValue', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem , attrs,ctrl) {
            var firstPassword = '#' + attrs.matchValue;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    // console.info(elem.val() === $(firstPassword).val());
                    if(!ctrl.$error.required&&elem.val() != $(firstPassword).val())
                        ctrl.$error.unmatched = true;
                    else
                        delete ctrl.$error.unmatched; 
                });
            });
        }
    };
});

hereseasApp.directive('clickme', function() {
  return function(scope, element, attrs) {
    var clickingCallback = function() {
      element.blur();
    };
    element.bind('click', clickingCallback);
  }
});

hereseasApp.directive('footer', function() {
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: true,
        scope: {}, // This is one of the cool things :). Will be explained in post.
        templateUrl: "/app/view/partials/_footer.html",
        controller: FooterController       
    };
    function FooterController($window,$scope){
        var w = angular.element($window);
        $scope.getWindowWidth = function () {
            return  w.width();
        };

        $scope.$watch($scope.getWindowWidth, function (newValue) {
            $scope.windowWidth = newValue;
        }, true);
        
    };
});

hereseasApp.directive('topBar', function(){
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: true,
        scope: {}, // This is one of the cool things :). Will be explained in post.
        templateUrl: "/app/view/partials/_top-bar.html",
        controller: TopBarCtrl,
    };
    
    function TopBarCtrl($window, $scope, $state,$stateParams,requestService){
        $scope.startPos = 0;
        $scope.path = "/app/view/img/topBar/";
        $scope.icons = [
            {img :$scope.path+"apartments.svg", value:"吉屋"},
            {img :$scope.path+"cars.svg", value:"车行"},
            {img :$scope.path+"goods.svg", value:"集市"},
            {img :$scope.path+"actitivies.svg", value:"活动"}
        ];
        
        requestService.GetSchool({id:$stateParams.schoolId}, function(res){
            console.log(res);
            $scope.avatar = res.data.avatar;
            console.log($scope.avatar);
        });
        
        
        $scope.showAll = function (id){
            console.log($stateParams.schoolId);

            if(id==0) $state.go('school', { schoolId:$stateParams.schoolId });
            if(id==1) $state.go('allApts', { schoolId:$stateParams.schoolId });
            if(id==2) $state.go('allCars', { schoolId:$stateParams.schoolId });
            if(id==3) $state.go('allItems', { schoolId:$stateParams.schoolId });
            if(id==4) $state.go('allActivs', { schoolId:$stateParams.schoolId });
            if(id==6) $state.go('forum', { schoolId:$stateParams.schoolId });
        };
    }
});


hereseasApp.directive('schoolSearch', function (requestService) {
    return {
        restrict: 'E', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: true,
        scope: {}, // This is one of the cool things :). Will be explained in post.
        templateUrl: "/app/view/partials/_school-search.html",
        
        link: function(scope, element, attrs, model) {
            scope.selected = undefined;
    
            requestService.GetSchools(function(res){
                //console.log("schools", res.data);
                scope.schools = [];
                scope.ids = [];
                for(var i=0; i<res.data.length; i++){
                    scope.schools.push(res.data[i].name);
                    scope.ids.push(res.data[i]._id);
                }
                
                /*if(attrs.profile == "true")
                {
                    scope.$on('getSchoolName',function (e, result){
                        scope.selected = result;
                    });

                    scope.$watch(
                      function() { return scope.selected; },
                      function(newValue, oldValue) {
                        if ( (newValue !== oldValue) && (newValue !== undefined) && (newValue !== "") &&(scope.schools.indexOf(newValue) !== -1) ) {
                            //console.log(scope.ids[scope.schools.indexOf(newValue)]);
                            scope.$emit('schoolNameChanged', 
                                {id:scope.ids[scope.schools.indexOf(newValue)],name:newValue});
                        }
                      }
                    );
                }*/
            });
        }   
    };
});


hereseasApp.directive('ngAutocomplete', function($parse) {
    return {

      scope: {
        details: '=',
        ngAutocomplete: '=',
        options: '=',
      },

      link: function(scope, element, attrs, model) {
          scope.$on('addressFilled',function (e, result){
                newAutocomplete();
            });
        //options for autocomplete
        var opts

        //convert options provided to opts
        var initOpts = function() {
          opts = {}
          if (scope.options) {
            if (scope.options.types) {
              opts.types = []
              opts.types.push(scope.options.types)
            }
            if (scope.options.bounds) {
              opts.bounds = scope.options.bounds
            }
            if (scope.options.country) {
              opts.componentRestrictions = {
                country: scope.options.country
              }
            }
          }
        }
        initOpts()

        //create new autocomplete
        //reinitializes on every change of the options provided
        var newAutocomplete = function() {
            //console.log("elem1", element[0]);
          scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);
          google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
            scope.$apply(function() {                
                scope.details = scope.gPlace.getPlace();

              scope.ngAutocomplete = element.val();
            });
          })
        }
        newAutocomplete()
        
        //watch options provided to directive
        scope.watchOptions = function () {
          return scope.options
        };
        scope.$watch(scope.watchOptions, function () {
          initOpts()
          newAutocomplete()
          element[0].value = '';
          scope.ngAutocomplete = element.val();
        }, true);
      }
    };
  });

hereseasApp.directive('affixme', function() {
  return {      
      link:function(scope, elem, attrs) {
          
        $(elem[0]).affix({
              offset: {
                top:80,
                bottom: 741//leftBarHeight-rightBarHeight
              }
            }); 
    }
  };
});