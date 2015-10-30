hereseasApp.controller('ActivsController',function($stateParams,$scope,requestService,roomService){
    
    // store current page number
    var cur_page = 1;
    var max_page = 1;
    $scope.activities=[
        {
            title:'爬大山',
            isfavor: true,
            numOfPeo:'250'
        },
        {
            title:'游大泳',
            isfavor: false,
            numOfPeo:'250'
        },
        {
            title:'跑大步',
            isfavor: true,
            numOfPeo:'250'
        },
        {
            title:'吃大饭',
            isfavor: true,
            numOfPeo:'250'
        },
        {
            title:'唱大歌',
            isfavor: false,
            numOfPeo:'250'
        },
        {
            title:'狼人杀',
            isfavor: true,
            numOfPeo:'250'
        },
        {
            title:'约大会',
            isfavor: false,
            numOfPeo:'250'
        },
        {
            title:'爬大山',
            isfavor: true,
            numOfPeo:'250'
        },
        {
            title:'游大泳',
            isfavor: false,
            numOfPeo:'250'
        },
        {
            title:'跑大步',
            isfavor: true,
            numOfPeo:'250'
        },
        {
            title:'吃大饭',
            isfavor: true,
            numOfPeo:'250'
        },
        {
            title:'唱大歌',
            isfavor: false,
            numOfPeo:'250'
        },
        {
            title:'狼人杀',
            isfavor: true,
            numOfPeo:'250'
        },
        {
            title:'约大会',
            isfavor: false,
            numOfPeo:'250'
        }
    ];
    
});

hereseasApp.controller('ActivsPostController', function ($state, $scope, roomService, $stateParams, languageService, requestService,$mdDialog) {
    $scope.activePage = 1;
    $scope.lastPage = lastPage;
    $scope.nextPage = nextPage;
    $scope.setActivePage = setActivePage;
    
    function lastPage() {
        setActivePage($scope.activePage-1);
    };  
    function nextPage() {
        setActivePage($scope.activePage+1);
    };

    function setActivePage(page) {
        if($scope.activePage == page){

        } else{
            if($scope.activePage == 1){
                //requestService.StepPost({id:userService.getDraft().id , step:1}, $scope.steps[0], function(res){
                //    console.log(res);
                //});
            }
            else{
                //if(!angular.equals(userService.getDraft(),{}) && $scope.tableFilled[$scope.activePage-1].filled && $scope.activePage!==7){
                    console.log($scope.steps[$scope.activePage-1], $scope.activePage);
                    //requestService.StepPost({id:userService.getDraft().id , step:$scope.activePage}, $scope.steps[$scope.activePage-1], function(res){
                    //    console.log(res);
                    //});
                //}
            }
        }
        $scope.activePage = page;
    };
    
});

hereseasApp.controller('ActivsDisplayController', function ($state, $scope, roomService, $stateParams, languageService, requestService,$mdDialog) {
    console.log($stateParams.activId);
    // display single old stuff
    function activSetMap(){
        // initial map
                var myLatLng = {};
                var good = {
                    cover:'/app/view/img/goods/goods_favor.png',
                    isfavor: true,
                    price:'250',
                    userAvatar:'/app/view/img/user/img1.JPG',
                    latitude:'38.9131296',
                    longitude:'-77.00652760000003'
                };
                myLatLng.lat = parseFloat(good.latitude);
                myLatLng.lng = parseFloat(good.longitude);             

                // Create a map object and specify the DOM element for display.
                var map = new google.maps.Map(document.getElementById('activMap'), {
                    center: myLatLng,
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
                // Create a marker and set its position.
                price = good.price;
                var marker = new MarkerWithLabel({
                    map: map,
                    position: myLatLng,
                    icon: image,
                    shape: shape,
                    labelContent: price,
                    draggable: false,
                    labelClass: "labels",
                    labelAnchor: new google.maps.Point(18, 22)
                });   
    };
    
    activSetMap();
});