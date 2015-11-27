var hereseasDirectives=angular.module("hereseasDirectives",[]);hereseasDirectives.directive("matchValue",function(){return{require:"ngModel",link:function(scope,elem,attrs,ctrl){var firstPassword="#"+attrs.matchValue;elem.add(firstPassword).on("keyup",function(){scope.$apply(function(){if(!ctrl.$error.required&&elem.val()!=$(firstPassword).val()){ctrl.$error.unmatched=true}else{delete ctrl.$error.unmatched}})})}}});hereseasApp.directive("clickme",function(){return function(scope,element,attrs){var clickingCallback=function(){element.blur()};element.bind("click",clickingCallback)}});hereseasApp.directive("footer",function(){return{restrict:"A",replace:true,scope:{},templateUrl:"/app/view/partials/_footer.html",controller:FooterController};function FooterController($window,$scope){var w=angular.element($window);$scope.getWindowWidth=function(){return w.width()};$scope.$watch($scope.getWindowWidth,function(newValue){$scope.windowWidth=newValue},true)}});hereseasApp.directive("topBar",function(){return{restrict:"A",replace:true,scope:{},templateUrl:"/app/view/partials/_top-bar.html",controller:TopBarCtrl};$scope.bk_bar=[];function TopBarCtrl($location,$window,$scope,$state,$stateParams,requestService){$scope.path="/app/view/img/topBar/";$scope.icons=[{img:$scope.path+"apartments.svg",value:"吉屋"},{img:$scope.path+"cars.svg",value:"车行"},{img:$scope.path+"goods.svg",value:"集市"},{img:$scope.path+"actitivies.svg",value:"活动"}];requestService.GetSchool({id:$stateParams.schoolId},function(res){$scope.avatar=res.data.avatar});$scope.bk_bar=[];if($location.path().indexOf("apts")!=-1){$scope.bk_bar[0]="/app/view/img/topBar/apt_selected.svg"}else{$scope.bk_bar[0]="/app/view/img/topBar/apartments.svg"}if($location.path().indexOf("allCars")!=-1){$scope.bk_bar[1]="/app/view/img/topBar/car_selected.svg"}else{$scope.bk_bar[1]="/app/view/img/topBar/cars.svg"}if($location.path().indexOf("allItems")!=-1){$scope.bk_bar[2]="/app/view/img/topBar/item_selected.svg"}else{$scope.bk_bar[2]="/app/view/img/topBar/goods.svg"}if($location.path().indexOf("allActivs")!=-1){$scope.bk_bar[3]="/app/view/img/topBar/activ_selected.svg"}else{$scope.bk_bar[3]="/app/view/img/topBar/actitivies.svg"}if($location.path().indexOf("forum")!=-1){$scope.bk_bar[4]="/app/view/img/topBar/forum_selected.svg"}else{$scope.bk_bar[4]="/app/view/img/topBar/life.svg"}$scope.showAll=function(id){if(id==0){$state.go("school",{schoolId:$stateParams.schoolId})}if(id==1){$state.go("allApts",{schoolId:$stateParams.schoolId})}if(id==2){$state.go("allCars",{schoolId:$stateParams.schoolId})}if(id==3){$state.go("allItems",{schoolId:$stateParams.schoolId})}if(id==4){$state.go("allActivs",{schoolId:$stateParams.schoolId})}if(id==6){$state.go("forum",{schoolId:$stateParams.schoolId})}}}});hereseasApp.directive("schoolSearch",function(requestService){return{restrict:"E",replace:true,scope:{},templateUrl:"/app/view/partials/_school-search.html",link:function(scope,element,attrs,model){scope.selected=undefined;requestService.GetSchools(function(res){scope.schools=[];scope.ids=[];for(var i=0;i<res.data.length;i++){scope.schools.push(res.data[i].name);scope.ids.push(res.data[i]._id)}})}}});hereseasApp.directive("ngAutocomplete",function($parse){return{scope:{details:"=",ngAutocomplete:"=",options:"="},link:function(scope,element,attrs,model){scope.$on("addressFilled",function(e,result){newAutocomplete()});var opts;var initOpts=function(){opts={};if(scope.options){if(scope.options.types){opts.types=[];opts.types.push(scope.options.types)}if(scope.options.bounds){opts.bounds=scope.options.bounds}if(scope.options.country){opts.componentRestrictions={country:scope.options.country}}}};initOpts();var newAutocomplete=function(){scope.gPlace=new google.maps.places.Autocomplete(element[0],opts);google.maps.event.addListener(scope.gPlace,"place_changed",function(){scope.$apply(function(){scope.details=scope.gPlace.getPlace();scope.ngAutocomplete=element.val()})})};newAutocomplete();scope.watchOptions=function(){return scope.options};scope.$watch(scope.watchOptions,function(){initOpts();newAutocomplete();element[0].value="";scope.ngAutocomplete=element.val()},true)}}});hereseasApp.directive("affixme",function(){return{link:function(scope,elem,attrs){$(elem[0]).affix({offset:{top:80,bottom:741}})}}});