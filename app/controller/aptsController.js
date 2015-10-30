hereseasApp.controller('AptsController',function($stateParams,$scope,requestService,roomService, userService, $cookies){
    
    // store current page number
    var cur_page = 1;
    var max_page = 1;
    
    var min_price = {0:0,1:500,2:1000};
    var max_price = {0:9999,1:1000,2:1500};
    var aptType = {0:'',1:'1b1b',2:'2b2b'};
    var rmType = {0:'',1:'房间',2:'卧室'};
    
    $scope.price =0;
    
    $scope.selectData = {
        id : $stateParams.schoolId, 
        page : cur_page, 
        pageSize : 3,
        //car:true,
        //utility:true,
        //pet:true,
        //share:true,
        startPrice:min_price[$scope.price],
        endPrice:max_price[$scope.price],
        apartmentType: '',
        roomType: '',
        date:''
    };
    
    $scope.favs = [];
    
    $scope.savedApts = userService.cookies2Favorite().apartments;
    
    
    $scope.updateFavs = function(index){
        if(userService.getLoginState()){
            var id = $scope.aptResult[index].id;
            var pos = $scope.savedApts.indexOf(id);

            if(pos == -1){
                $scope.savedApts.push(id);
                $scope.favs[index] = "/app/view/img/profile/favorite2.png";
                
                userService.postFavorite({
                    id: id,
                    category: "apartments"
                }).then(function (res) {
                    console.log(res);
                    if (res.result) {
                        //alert("Message has been sent");
                    } else {
                        //alert("err");
                    }
                });
                
            }else{
                $scope.savedApts.splice(pos, 1);
                $scope.favs[index] = "/app/view/img/profile/favorite1.png";
            }
            console.log($scope.savedApts);

            var favoriteList = userService.cookies2Favorite();
            favoriteList.apartments = $scope.savedApts;
            userService.saveFavorite2Cookies(favoriteList);
        }else{
            console.log("需要登录");
        }
    };
    
    
    function updatePage(){
        requestService.GetAptsBySchool($scope.selectData,
        function(res){
            if(res.result){
                //console.log(res.data);
                var apts = res.data.apartments;
                $scope.aptResult = apts;
                if(userService.getLoginState()){
                    $scope.favs = [];
                    angular.forEach(apts, function(key){
                        if($scope.savedApts.indexOf(key.id) !== -1)
                            $scope.favs.push("/app/view/img/profile/favorite2.png");
                        else $scope.favs.push("/app/view/img/profile/favorite1.png");
                    });
                }else{
                    angular.forEach(apts, function(key){
                        $scope.favs.push("/app/view/img/profile/favorite1.png");
                    });
                }
                // store number of max pages
                max_page = res.data.totalPage;
                $scope.pages = [];
                for(var i=0; i<max_page; i++){
                    $scope.pages[i] = {};
                    $scope.pages[i].id = i+1;             
                }

                // initial map
                var myLatLng=[];
                var apts = res.data.apartments;
                for(var i=0; i<apts.length; i++){
                    myLatLng[i]={};
                    myLatLng[i].lat = parseFloat(apts[i].latitude);
                    myLatLng[i].lng = parseFloat(apts[i].longitude);             
                }

                // Create a map object and specify the DOM element for display.
                var map = new google.maps.Map(document.getElementById('aptsMap'), {
                    center: myLatLng[0],
                    scrollwheel: true,
                    zoom: 12
                });

                // Origins, anchor positions and coordinates of the marker increase in the X
                // direction to the right and in the Y direction down.
                var image = {
                    url: '/app/view/img/apts/marker.png',
                    // This marker is 58 pixels wide by 24 pixels high.
                    size: new google.maps.Size(58, 24),
                    // The origin for this image is (0, 0).
                    origin: new google.maps.Point(0, 0),
                    // The anchor for this image is the base of the flagpole at (0, 24).
                    anchor: new google.maps.Point(36, 24)
                };
                // Shapes define the clickable region of the icon. The type defines an HTML
                // <area> element 'poly' which traces out a polygon as a series of X,Y points.
                // The final coordinate closes the poly by connecting to the first coordinate.
                var shape = {
                    coords: [0, 0, 0, 24, 58, 24, 58, 0],
                    type: 'poly'
                };

                var price;
                for(var i=0; i<apts.length; i++){
                    // Create a marker and set its position.
                    price = apts[i].price.minPrice + "-" + apts[i].price.maxPrice
                    var marker = new MarkerWithLabel({
                        map: map,
                        position: myLatLng[i],
                        icon: image,
                        shape: shape,
                        labelContent: price,
                        draggable: false,
                        labelClass: "labels",
                        labelAnchor: new google.maps.Point(30, 22)
                    });   
                }
            }else{
                $scope.aptResult = []; 
            }
        });
    }; 
    
    updatePage();
    
    $scope.$watch(function(){return $scope.selectData.apartmentType;},
        function(newValue,oldValue){
            updatePage();
    });
    
    $scope.$watch(function(){return $scope.selectData.roomType;},
        function(newValue,oldValue){
            updatePage();
    });
    
    $scope.$watch(function(){return $scope.selectData.date;},
        function(newValue,oldValue){
            updatePage();
    });
    
    $scope.$watch('price',
        function(newValue,oldValue){
            $scope.selectData.startPrice=min_price[$scope.price];
            $scope.selectData.endPrice=max_price[$scope.price];
            updatePage();
    });
    
    $scope.setPage = function(pg){
        cur_page = pg+1;
        $scope.selectData.page = cur_page;
        updatePage();
    };
    
    $scope.previous = function(){
        if(cur_page - 1 > 0){
            cur_page = cur_page - 1;
        }
        $scope.selectData.page = cur_page;
        updatePage();
    };
    
    $scope.next = function(){
        if(cur_page + 1 <= max_page){
            cur_page = cur_page + 1;
        }
        $scope.selectData.page = cur_page;
        updatePage();
    };
    
    $scope.changeSearch = function() {
        console.log($scope.selectData.hasPark);
        updatePage();
    }
});