hereseasApp.controller('GoodsController',function($stateParams,$scope,requestService,roomService){
    
    // store current page number
    var cur_page = 1;
    var max_page = 1;
    $scope.goods=[
        {
            cover:'/app/view/img/goods/goods_favor.png',
            isfavor: true,
            price:'250',
            userAvatar:'/app/view/img/user/img1.JPG',
            latitude:'38.9131296',
            longitude:'-77.00652760000003'
        },
        {
            cover:'/app/view/img/goods/goods_favor.png',
            isfavor: true,
            price:'250',
            userAvatar:'/app/view/img/user/img1.JPG',
            latitude:'38.9131296',
            longitude:'-77.00652760000003'
        },
        {
            cover:'/app/view/img/goods/goods_favor.png',
            isfavor: false,
            price:'250',
            userAvatar:'/app/view/img/user/img1.JPG',
            latitude:'38.9131296',
            longitude:'-77.00652760000003'
        },
        {
            cover:'/app/view/img/goods/goods_favor.png',
            isfavor: false,
            price:'250',
            userAvatar:'/app/view/img/user/img1.JPG',
            latitude:'38.9131296',
            longitude:'-77.00652760000003'
        },
        {
            cover:'/app/view/img/goods/goods_favor.png',
            isfavor: false,
            price:'250',
            userAvatar:'/app/view/img/user/img1.JPG',
            latitude:'38.9131296',
            longitude:'-77.00652760000003'
        },
        {
            cover:'/app/view/img/goods/goods_favor.png',
            isfavor: true,
            price:'250',
            userAvatar:'/app/view/img/user/img1.JPG',
            latitude:'38.9131296',
            longitude:'-77.00652760000003'
        },
        {
            cover:'/app/view/img/goods/goods_favor.png',
            isfavor: false,
            price:'250',
            userAvatar:'/app/view/img/user/img1.JPG',
            latitude:'38.9131296',
            longitude:'-77.00652760000003'
        },
    ];

    // display all old stuffs on map
    function goodsSetMap(){
        // initial map
                var myLatLng=[];
                var goods = $scope.goods;
                for(var i=0; i<goods.length; i++){
                    myLatLng[i]={};
                    myLatLng[i].lat = parseFloat(goods[i].latitude);
                    myLatLng[i].lng = parseFloat(goods[i].longitude);             
                }

                // Create a map object and specify the DOM element for display.
                var map = new google.maps.Map(document.getElementById('goodsMap'), {
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
                for(var i=0; i<goods.length; i++){
                    // Create a marker and set its position.
                    price = goods[i].price;
                    var marker = new MarkerWithLabel({
                        map: map,
                        position: myLatLng[i],
                        icon: image,
                        shape: shape,
                        labelContent: price,
                        draggable: false,
                        labelClass: "labels",
                        labelAnchor: new google.maps.Point(18, 22)
                    });   
                }
    }
    
    
    
    goodsSetMap();
    
});

hereseasApp.controller('GoodsDisplayController', function ($state, $scope, roomService, $stateParams, languageService, requestService,$mdDialog) {
    console.log($stateParams.goodId);
    
});

hereseasApp.controller('GoodDisplayController', function ($state, $scope, roomService, $stateParams, languageService, requestService,$mdDialog) {
    console.log($stateParams.goodId);
    // display single old stuff
    function goodSetMap(){
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
                var map = new google.maps.Map(document.getElementById('goodMap'), {
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
    goodSetMap();
});