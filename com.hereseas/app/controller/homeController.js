hereseasApp.controller('HomeController', function ($scope, userService, alertService, $state, $mdDialog) {
    console.log("abcdefgh");
    
    $scope.checkLogState = checkLogState;
    
    function checkLogState() {
        if($scope.logged()) $state.go('roompost');
        else alertService.alert("请先登录！");
    };
});

hereseasApp.directive('myBlur', function() {

  function link(scope, element, attrs) {
    function blurIt() {
      element.blur();
    }

    scope.$watch(attrs.myBlur, function(newValue,oldValue) {
      if(!(newValue==oldValue))
          blurIt();
    });
  }

  return {
    link: link
  };
});




hereseasApp.directive('header', function () {
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: true,
        scope: {user: '='}, // This is one of the cool things :). Will be explained in post.
        templateUrl: "/app/view/partials/_header.html",
        controller: HeaderController       
    }
    function HeaderController($scope, $stateParams, $rootScope, $location, userService, $mdDialog, alertService){
        $scope.logged = logged;
        $scope.logOut = logOut;
        
        $scope.$watch(
              function() { return userService.getToSignup(); },
              // This is the change listener, called when the value returned from the above function changes
              function(newValue, oldValue) {
                if ( newValue !== oldValue ) {
                    if(newValue == true){ 
                        $scope.showSignup();
                        userService.changeToSignup();
                    }
                    else {
                        
                    }
                }
              }
        );
        
        $scope.$watch(
              function() { return userService.getToLogin(); },
              // This is the change listener, called when the value returned from the above function changes
              function(newValue, oldValue) {
                if ( newValue !== oldValue ) {
                    if(newValue == true){ 
                        $scope.showLogin();
                        userService.changeToLogin();
                    }
                    else {
                        
                    }
                }
              }
        );
        
        
        
        function logged() {
            return userService.getStoredUser();
        };

        function logOut() {
            userService.logOut();
            alertService.alert("您已注销！");
        };
        
        
        $scope.showRoompost = function(ev) {
            var cookie = userService.getStoredUser();
            if(cookie)
            {
                $mdDialog.show({
                  controller: RoomPostController,
                  templateUrl: '/app/view/room_post.html',
                  //parent: angular.element(document.body),
                  targetEvent: ev,
                });
            }
            else alertService.alert("请先登录").then(function() {
                    $scope.showLogin();
            });
        };
        
        
        $scope.showSignup = function(ev) {
            $mdDialog.show({
              controller: SignupController,
              templateUrl: '/app/view/signup.html',
              //parent: angular.element(document.body),
              targetEvent: ev,
            });
        };
        
        $scope.showLogin = function(ev) {
            $mdDialog.show({
              controller: LoginController,
              templateUrl: '/app/view/login.html',
              //parent: angular.element(document.body),
              targetEvent: ev,
            });
        };
        
        function SignupController($scope, $stateParams, $rootScope, $location, $mdDialog, userService, alertService){
            $scope.signUpData = {};
            
            $scope.hide = function() {
                $mdDialog.hide();
            };
            
            $scope.goLogin = function() {
                $scope.hide();
                userService.changeToLogin();
            };

            $scope.signUpSubmit = function () {
                console.log($scope.signUpData);

                userService.registerUser($scope.signUpData)
                    .then(function (res) {
                        console.log(res);
                        if (res.result) {
                            alert("created");
                            $scope.hide();
                        } else {
                            //alert("failed");
                            alertService.alert('The email has already been registered!');
                        }
                    });
            };
        
        };
        
        function LoginController($scope, $state, userService, alertService, $mdDialog,$http) {
        // create blank user variable for login form
            $scope.user = {
                email: '',
                password: '',
                save: true
            };

            $scope.socialLogins = [{
                icon: 'fa-twitter',
                color: '#5bc0de',
                url: '#'
            }, {
                icon: 'fa-facebook',
                color: '#337ab7',
                url: '#'
            }, {
                icon: 'fa-google-plus',
                color: '#e05d6f',
                url: '#'
            }, {
                icon: 'fa-linkedin',
                color: '#337ab7',
                url: '#'
            }];
            
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.goSignup = function() {
                $scope.hide();
                userService.changeToSignup();
            };
            
            // controller to handle login check
            $scope.loginClick = function () {
                console.log($scope.user);
                userService.login($scope.user)
                    .then(function (res) {
                        if (res.result) {
                
                          var host = "http://localhost:8080";
 
                $http.get(host+'/init')
            .then(function(res){
               
                    
                    console.log('login',res);   
              
            },errResponseHandler); 
                            
                            
                            
                            
                            
                           
                            
                            $scope.hide();
                        } else {
                            //alert!
                            alertService.alert(res.err);
                        }
                    });
            };
        };
        
        
        
        function RoomPostController($scope, languageService, userService, alertService, $state, $mdDialog, roomService){

            $scope.activePage = 1;
            $scope.AddRoom = AddRoom;
            $scope.RemoveRoom = RemoveRoom;
            $scope.name = name;
            $scope.lastPage = lastPage;
            $scope.nextPage = nextPage;
            $scope.setActivePage = setActivePage;
            $scope.doPost = doPost;

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.post_data =
                {
                    userId : "55b54946bc943afe055f1c68",
                    userFirstName : "Zhenyu",
                    userLastName : "Han",
                    userAvatar : "default.png",
                    schoolId : "55b3d4c19e9331f82297498a",
                    title :  '',
                    description : '',
                    cover : '/pic/cover1.jpg',
                    images : ['/pic/image1.jpg', '/pic/image2.jpg', '/pic/image3.jpg'],
                    isStudio:     false,
                    numBedrooms:  1,
                    numBathrooms: 1,
                    description: '',
                    beginDate:  new Date(),
                    endDate: new Date(),
                    location : {
                         latitude : 0,
                         longitude : 0,
                         street :  '',
                         apt :       '',
                         city :     '',
                         state :    '',
                         zipcode :  ''
                    },
                    aptFacilities:[
                        {name : 'gym',   value :   false}, 
                        {name : 'swimmingPool',   value :   false}, 
                        {name : 'laundry',   value :   false}, 
                        {name : 'petsAllowed',   value :   false}, 
                        {name : 'partyRoom',   value :   false},
                        {name : 'businessRoom',   value :   false}, 
                        {name : 'elevator',   value :   false}, 
                        {name : 'frontDesk',   value :   false}, 
                        {name : 'freeParking',   value :   false}, 
                        {name : 'roof',   value :   false},
                        {name : 'yard',   value :   false}, 
                        {name : 'wheelchairAccessible',   value :   false}, 
                        {name : 'bbq',   value :   false}, 
                        {name : 'safetySystem',   value :   false} 
                    ],
                    fees:[
                        {name : 'deposit',   price :   0},         
                        {name : 'leasing',   price :   0},
                        {name : 'park',   price :   0},
                        {name : 'utilities',   price :   0},
                        {name : 'insurance',   price :   0},
                        {name : 'network',   price :   0},
                        {name : 'clean',   price :   0}
                    ],
                    roomFacilities:[
                        {name : 'refrigerator',value : true}, 
                        {name : 'washer',   value :   true}, 
                        {name : 'dryer',   value :   true}, 
                        {name : 'microwave',   value :   true}, 
                        {name : 'airCondition',   value :   true}, 
                        {name : 'balcony',   value :   true}, 
                        {name : 'furnitures',   value :   true}, 
                        {name : 'smokeDetector',   value :   true}, 
                        {name : 'extinguisher',   value :   true}, 
                        {name : 'heater',   value :   true}, 
                        {name : 'oven',   value :   true}, 
                        {name : 'dishwasher',   value :   true}
                    ],   
                    rooms:[
                        {
                            id:    '',
                            hasBathroom: false,
                            hasWalkIn:  false,
                            hasCloset:   false,
                            type:         'bedroom',
                            price :       0,
                            priceType :   'month',
                            rentType :   'one_person'
                        }
                    ]
                }

            function doPost() {
                var data = {
                    userId : "55b54946bc943afe055f1c68",
                    userFirstName : "Huanzhou",
                    userLastName : "Huang",
                    userAvatar : "default.png",
                    schoolId : "55b54935bc943afe055f1c67",
                    title :  $scope.post_data.title,
                    description : $scope.post_data.description,
                    cover : '/pic/cover1.jpg',
                    images : ['/pic/image1.jpg', '/pic/image2.jpg', '/pic/image3.jpg'],
                    type: "2B2B",
                    address : {
                         street :  '',
                         apt :       '',
                         city :     '',
                         state :    '',
                         zipcode :  ''
                    },
                    longitude : '45',
                    latitude : '-73',
                    fees:[
                        {name : 'deposit',   price :   $scope.post_data.fees[0].price},         
                        {name : 'leasing',   price :   $scope.post_data.fees[1].price},
                        {name : 'park',   price :   $scope.post_data.fees[2].price},
                        {name : 'utilities',   price :   $scope.post_data.fees[3].price},
                        {name : 'insurance',   price :   $scope.post_data.fees[4].price},
                        {name : 'network',   price :   $scope.post_data.fees[5].price},
                        {name : 'clean',   price :   $scope.post_data.fees[6].price}
                    ],
                    facilities : {
                        aptFacilities:[
                            {name : 'gym',   value :   $scope.post_data.aptFacilities[0].value}, 
                            {name : 'swimmingPool',   value :   $scope.post_data.aptFacilities[1].value}, 
                            {name : 'laundry',   value :   $scope.post_data.aptFacilities[2].value}, 
                            {name : 'petsAllowed',   value :   $scope.post_data.aptFacilities[3].value}, 
                            {name : 'partyRoom',   value :   $scope.post_data.aptFacilities[4].value},
                            {name : 'businessRoom',   value :   $scope.post_data.aptFacilities[5].value}, 
                            {name : 'elevator',   value :   $scope.post_data.aptFacilities[6].value}, 
                            {name : 'frontDesk',   value :   $scope.post_data.aptFacilities[7].value}, 
                            {name : 'freeParking',   value :   $scope.post_data.aptFacilities[8].value}, 
                            {name : 'roof',   value :   $scope.post_data.aptFacilities[9].value},
                            {name : 'yard',   value :   $scope.post_data.aptFacilities[10].value}, 
                            {name : 'wheelchairAccessible',   value :   $scope.post_data.aptFacilities[11].value}, 
                            {name : 'bbq',   value :   $scope.post_data.aptFacilities[12].value}, 
                            {name : 'safetySystem',   value :   $scope.post_data.aptFacilities[13].value} 
                        ],
                        roomFacilities:[
                            {name : 'refrigerator',value : $scope.post_data.roomFacilities[0].value}, 
                            {name : 'washer',   value :   $scope.post_data.roomFacilities[1].value}, 
                            {name : 'dryer',   value :   $scope.post_data.roomFacilities[2].value}, 
                            {name : 'microwave',   value :   $scope.post_data.roomFacilities[3].value}, 
                            {name : 'airCondition',   value :   $scope.post_data.roomFacilities[4].value}, 
                            {name : 'balcony',   value :   $scope.post_data.roomFacilities[5].value}, 
                            {name : 'furnitures',   value :   $scope.post_data.roomFacilities[6].value}, 
                            {name : 'smokeDetector',   value :   $scope.post_data.roomFacilities[7].value}, 
                            {name : 'extinguisher',   value :   $scope.post_data.roomFacilities[8].value}, 
                            {name : 'heater',   value :   $scope.post_data.roomFacilities[9].value}, 
                            {name : 'oven',   value :   $scope.post_data.roomFacilities[10].value}, 
                            {name : 'dishwasher',   value :   $scope.post_data.roomFacilities[11].value}
                        ]
                    },   
                    rooms:[
                        {
                            type  : $scope.post_data.rooms[0].priceType,
                            price : $scope.post_data.rooms[0].price,
                            bathroom: $scope.post_data.rooms[0].hasBathroom,
                            walkInCloset:  $scope.post_data.rooms[0].hasWalkIn,
                            closet:   $scope.post_data.rooms[0].hasCloset,
                            beginDate:  $scope.post_data.beginDate,
                            endDate :    $scope.post_data.endDate
                        }
                    ]
                }
                console.log("data to be posted",data);
                roomService.postRoom(data);
            };

            //Room Post页相关功能
            function lastPage() {
                    $scope.activePage--;
            };
            function nextPage() {
                    $scope.activePage++;
            };

            function setActivePage(page) {
                $scope.activePage = page;
            };

            function AddRoom() {
                $scope.post_data.rooms.push(
                    {
                        id:    '',
                        has_bathroom: false,
                        has_walk_in:  false,
                        has_closet:   false,
                        type:         'bedroom',
                        price :       0,
                        price_type :   'month',
                        rent_type :   'one_person'
                    }
                );
                $scope.$apply();
            };

            function RemoveRoom(index) {
                $scope.post_data.rooms.splice(index,1);
                $scope.$apply();
            };

            $scope.$watch(
              function() { return $scope.post_data.numBedrooms; },
              // This is the change listener, called when the value returned from the above function changes
              function(newValue, oldValue) {
                if ( newValue !== oldValue ) {
                    if(newValue == 0){ 
                        $scope.post_data.isStudio = true;
                        $scope.post_data.numBathrooms = 0;
                    }
                    else {
                        $scope.post_data.isStudio = false;
                        $scope.post_data.numBathrooms = 1;
                    }
                }
              }
            );

            function name(name) {
                return languageService.getChineseName(name);
            };
        };
    };
});

