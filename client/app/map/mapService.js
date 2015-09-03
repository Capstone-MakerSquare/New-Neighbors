var map = angular.module('myApp.mapServices',[])
.factory('Map', function () {

  var map;
  var mapOptions = {
    center: {
        lat: 0,
        lng: 0
      },
    zoom: 4
  };

  //----------------------------------------------------------------------------------
  //Initialize the map with a coordinates object
  var initialize = function (coordinates) {
    mapOptions.center.lat = coordinates.latitude;
    mapOptions.center.lng = coordinates.longitude;

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }


  //----------------------------------------------------------------------------------
  //Pan and focus on the coordinate set of interest
  var panAndFocus = function (coordinates) {
    // var latLng = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);
    map.panTo({lat: coordinates.latitude, lng: coordinates.longitude});
    map.setZoom(mapOptions.zoom);
  }

  //----------------------------------------------------------------------------------
  //Drop a marker
  var dropMarker = function (coordinates, title) {
    var myLatLng = {lat: coordinates.latitude, lng: coordinates.longitude};
    panAndFocus(coordinates);

    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: title
    });
  }

  return {
    initialize: initialize,
    panAndFocus: panAndFocus,
    dropMarker: dropMarker
  };

  // var map, center;

  // var init = function(mapCanvas) {
  //   map = new google.maps.Map(mapCanvas, MapOptions);
  // };

  // var getMap = function() {
  //   return map;
  // };

  // return {
  //   init: init,
  //   getMap: getMap
  // };
});
