hereseasApp.factory('roomService', function ($http, $state) {    
    var postData = {};
    
    var coordinate ={
        latitude : 0,
        longitude : 0
    };
    var directionsService;
    var directionsDisplay;
    var durations ={
        driving : '',
        bicycling : '',
        walking : ''
    };
    var response1;
    var response2;
    var response3;
    var aptIds = ["", "", ""];
    
    var service = {
        setMap : setMap,
        calDurations : calDurations,
        setDisplay : setDisplay
    };
    return service;    
    
    function setMap() {
        directionsService = new google.maps.DirectionsService();
        var manhattan = new google.maps.LatLng(40.7711329, -73.9741874);
        var mapOptions = {
            zoom: 13,
            center: manhattan
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        map.setOptions({scrollwheel: false});

        var rendererOptions = {
            map : map
        };
        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    };
    
    function calDurations(aptAddress, schoolAddress){
        var request1 = {
          origin : aptAddress,
          destination : schoolAddress,
          travelMode: google.maps.TravelMode.DRIVING,
        };
        var request2 = {
          origin : aptAddress,
          destination : schoolAddress,
          travelMode: google.maps.TravelMode.BICYCLING,
        };
        var request3 = {
          origin : aptAddress,
          destination : schoolAddress,
          travelMode: google.maps.TravelMode.WALKING,
        };
        directionsService.route(request1, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                response1 = response;
                durations.driving = response.routes[0].legs[0].duration.text;
            }
        });
        directionsService.route(request2, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                response2 = response;
                durations.bicycling = response.routes[0].legs[0].duration.text;
            }
        });
        directionsService.route(request3, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                response3 = response;
                durations.walking = response.routes[0].legs[0].duration.text;
            }
        });

        return durations;
    };
    
    
    function setDisplay(method){
        if(method == "driving"){
            directionsDisplay.setDirections(response1);
        }else if(method == "bicycling"){
            directionsDisplay.setDirections(response2);
        }
        else directionsDisplay.setDirections(response3);
    };
    
});