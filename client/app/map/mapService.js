mapMod // = angular.module('myApp.mapServices',[])
.factory('Map', ['Details', '$state', function (Details, $state) {

  var map;
  var mapOptions = {
    center: {
        lat: 0,
        lng: 0
      },
    zoom: 4
  };

  // var marker;
  var markers;
  var circle;

  //----------------------------------------------------------------------------------
  //Initialize the map with a coordinates object
  var initialize = function (coordinates) {
    coordinates = coordinates ||  {
      latitude: 38.5,
      longitude: -96
    };

    mapOptions.center.lat = coordinates.latitude;
    mapOptions.center.lng = coordinates.longitude;

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    console.log("map initialized")
  }


  //----------------------------------------------------------------------------------
  //Pan and focus on the coordinate set of interest
  var panAndFocus = function (coordinates, zoom) {
    var latLng = { lat: coordinates.latitude, lng: coordinates.longitude };
    zoom = zoom || 11;    //11 corresponds to a radius of 20 kms

    map.panTo(latLng);
    map.setZoom(zoom);
  }

  //----------------------------------------------------------------------------------
  //Drop a marker
  var dropMarker = function (coordinates, title, tooltip, icon) {
    var latLng = {lat: coordinates.latitude, lng: coordinates.longitude};

    var marker;
    return marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: title,
      icon: icon
    });
  }

  //----------------------------------------------------------------------------------
  //Clear the markers on the map
  var clearMarkers = function (markerArr) {
      for (var i = 0; i < markerArr; i++){
        markerArr[i].setMap(null);
      }
      if (!Details.currentMarkers) {
        return;
      }
      for (var j = 0; j < Details.currentMarkers.length; j++) {
        Details.currentMarkers[j].setMap(null);
      }
    }

  //----------------------------------------------------------------------------------
  //Drop a marker with LABEL
  var dropMarkerWithLabel = function (coordinates, title) {
    var latLng = {lat: coordinates.latitude, lng: coordinates.longitude};

    var markerLabel = new MarkerWithLabel({
      position: latLng,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 0, //tamaño 0
      },
      map: map,
      draggable: true,
      labelAnchor: new google.maps.Point(10, 10),
      labelClass: "popper", // the CSS class for the label
    });
  }

  //----------------------------------------------------------------------------------
  //Draw a circle with a given radius
  var drawCircle = function (coordinates, radius, color) {
    var radius = radius || 4000;
    var latLng = {lat: coordinates.latitude, lng: coordinates.longitude};

    // console.log('radius:', radius);
    // console.log('latLng:', latLng);

    if(circle) { circle.setMap(null); }
    circle = new google.maps.Circle({
      strokeColor: '#DDDDDD',
      strokeOpacity: .6,
      strokeWeight: 0.5,
      fillColor: '#FF2603',
      fillOpacity: 0.2,
      map: map,
      center: latLng,
      radius: radius
    });
  }

  return {
    initialize: initialize,
    map: map,
    markers: markers,
    clearMarkers: clearMarkers,
    panAndFocus: panAndFocus,
    dropMarker: dropMarker,
    drawCircle: drawCircle,
    dropMarkerWithLabel: dropMarkerWithLabel
  };

}]);
