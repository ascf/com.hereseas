hereseasApp.controller('RoomController', function ($state, $scope, roomService, $stateParams, languageService) {
    $scope.init = init;
    init();
    
    function init() {
        //if (roomService.validAptId($stateParams.aptId)) {
            
            roomService.getData($stateParams.aptId)
                .then(function (roomRes) {
                        if (roomRes.result) {
                            $scope.apt_true = 0;
                            $scope.room_true = 0;
                            $scope.fees_true = 0;
                            $scope.show_all_apt = false;
                            $scope.show_all_room = false;
                            $scope.show_all_fees = false;

                            $scope.add_apt = "2440 Virginia Avenue Northwest, Washington, DC";
                            $scope.add_school = "2000 S Eads St, Arlington, VA";

                            roomService.setMap();

                            $scope.durations = roomService.calDurations($scope.add_apt, $scope.add_school);

                            $scope.aptIcons = [
                                '/app/view/img/icon/gym.svg',
                                '/app/view/img/icon/swimmingPool.svg',
                                '/app/view/img/icon/laundry.svg',
                                '/app/view/img/icon/petsAllowed.svg',
                                '/app/view/img/icon/partyRoom.svg',
                                '/app/view/img/icon/businessRoom.svg',
                                '/app/view/img/icon/elevator.svg',
                                '/app/view/img/icon/frontDesk.svg',
                                '/app/view/img/icon/freeParking.svg',
                                '/app/view/img/icon/roof.svg',
                                '/app/view/img/icon/yard.svg',
                                '/app/view/img/icon/wheelchairAccessible.svg',
                                '/app/view/img/icon/bbq.svg',
                                '/app/view/img/icon/safetySystem.svg'
                            ];
                            $scope.roomIcons = [
                                '/app/view/img/icon/refrigerator.svg',
                                '/app/view/img/icon/washer.svg',
                                '/app/view/img/icon/dryer.svg',
                                '/app/view/img/icon/microwave.svg',
                                '/app/view/img/icon/airCondition.svg',
                                '/app/view/img/icon/balcony.svg',
                                '/app/view/img/icon/furnitures.svg',
                                '/app/view/img/icon/smokeDetector.svg',
                                '/app/view/img/icon/extinguisher.svg',
                                '/app/view/img/icon/heater.svg',
                                '/app/view/img/icon/oven.svg',
                                '/app/view/img/icon/dishwasher.svg'
                            ];
                            $scope.data = roomRes.data[0];
                            $scope.images = $scope.data.images;
                            $scope.cover = $scope.data.cover;                    
                            $scope.rooms = $scope.data.rooms;
                            $scope.theRoom = $scope.rooms[1];
                            $scope.apt_facilities = $scope.data.facilities.apt;
                            $scope.room_facilities = $scope.data.facilities.room;
                            $scope.fees = $scope.data.fees;
                            
                            $scope.ShowAllApt = ShowAllApt;
                            $scope.ShowAllRoom = ShowAllRoom;
                            $scope.ShowAllFees = ShowAllFees;
                            $scope.SetMethod = SetMethod;
                            $scope.name = name;
                            $scope.count = count;
                            $scope.has_all_facilities = has_all_facilities;
                            $scope.has_all_room_facilities = has_all_room_facilities;
                            $scope.has_all_fees = has_all_fees;
                            
                            count();
                            roomService.getSchool($scope.data.schoolId)
                                .then(function (schoolRes) {
                                    if (schoolRes.result) {
                                        $scope.schoolName = schoolRes.data.name;
                                    } else {
                                        //http get school id error
                                    }
                            });
                            
                            
                            function count() {
                                //统计拥有的公寓设施的数量
                                for (var key in $scope.apt_facilities)
                                {                        
                                    if($scope.apt_facilities[key].value == true)
                                        $scope.apt_true++;
                                };
                                //统计拥有的房间设施的数量
                                for(var key in $scope.room_facilities)
                                {
                                    if($scope.room_facilities[key].value == true)
                                        $scope.room_true++;
                                };
                                //统计拥有的费用的数量
                                for(var key in $scope.fees)
                                {
                                    if(!($scope.fees[key].price == 0))
                                        $scope.fees_true++;
                                };
                            };
                            
                            function ShowAllApt() {
                                $scope.show_all_apt = !$scope.show_all_apt;  
                            };

                            function ShowAllRoom() {
                                $scope.show_all_room = !$scope.show_all_room;
                            };

                            function ShowAllFees() {
                                $scope.show_all_fees = !$scope.show_all_fees;
                            };

                            function SetMethod(method) {
                                roomService.setDisplay(method);
                            };

                            function name(name) {
                                return languageService.getChineseName(name);
                            };
                            
                            function has_all_facilities() {
                                return $scope.apt_true == $scope.apt_facilities.length;
                            };

                            function has_all_room_facilities() {
                                return $scope.room_true == $scope.room_facilities.length;
                            };

                            function has_all_fees() {
                                return $scope.fees_true == $scope.fees.length;
                            };

                        } else {
                            //http get data error
                            $state.go('home');
                        }
                    });
        /*} else {
            $state.go('home');
        }
        $scope.isSaving = false;*/
    }
});