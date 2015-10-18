mapMod // = angular.module('myApp.mapServices',[])
.factory('Map', ['Details', '$state', function (Details, $state) {

  var map;
  var mapOptions = {
    center: {
        lat: 0,
        lng: 0
      },
    zoom: 4,
    mapTypeControl: true,
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
    },
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
    },
    scaleControl: true,
    streetViewControl: true,
    streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
    }
  };

  // var marker;
  var markers;
  var circle;
  var iconCounter = 0;

  //temporary variables
  var targetLocation;  

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
    // console.log("map initialized")

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
  //Pan and focus on the user's destination
  var panAndFocusDestination = function(address) {
    var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          var address = results[0].formatted_address;
          var coordinates = { latitude : results[0].geometry.location.lat(), longitude : results[0].geometry.location.lng() };
          panAndFocus(coordinates);
          dropMarkerWithLabel(coordinates);

        } else {
          console.log('submitAddress(): NOT_OK geocode says: Status, results: ', status, ',', results);
        }
      });
  }


  //----------------------------------------------------------------------------------
  //Drop a marker
  var dropMarker = function (coordinates, title, placeObj, icon, markerType) {

    var latLng = {lat: coordinates.latitude, lng: coordinates.longitude};
    var infowindow;
    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: icon,
    });

    //helper function
    function isInfoWindowOpen(infoWindow){
      var map = infoWindow.getMap();
      return (map !== null && typeof map !== "undefined");
    }

    var ratingHTML = '';
    if(placeObj.rating) {
      ratingHTML = 'Rating:' + placeObj.rating;
    }

    if(markerType === 'amenities_attractions') {
      infowindow = new google.maps.InfoWindow();
      infowindow.setContent('<b>'+ placeObj.name + '</b><br>' + ratingHTML);
      google.maps.event.addListener(marker, 'click', function() {
        //remove
        console.log('Place Clicked:', placeObj);

        var photoUrl = '';
        if(placeObj.photos && placeObj.photos.length) {
          var photoReference = placeObj.photos[0].photo_reference;
          // console.log('Photo Reference:',photoReference);
        }
        if(isInfoWindowOpen(infowindow)) { infowindow.close(); return; }
        infowindow.open(map, marker);
      });
    }

    return [marker, infowindow];
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
      labelClass: "mapPopper", // the CSS class for the label
    });
  }

  //Toggle infowindow on a target marker
  var toggleInfoWindow = function (infoWindow, marker) {
    //helper function
    function isInfoWindowOpen(infoWindow){
      var map = infoWindow.getMap();
      return (map !== null && typeof map !== "undefined");
    }
    if(isInfoWindowOpen(infoWindow)) { infoWindow.close(); return; }
    infoWindow.open(map, marker);
  }

  //----------------------------------------------------------------------------------
  //Get sequenced map icons
  var getIcon = function () {
    var dictionary = [
      "assets/images/MapMarkers/Map-Maker-Icon-Blue.png",
      "assets/images/MapMarkers/Map-Maker-Icon-Green.png",
      "assets/images/MapMarkers/Map-Maker-Icon-Pink.png",
      "assets/images/MapMarkers/Map-Maker-Icon-Purple.png",
      "assets/images/MapMarkers/Map-Maker-Icon-Red.png"
    ];

    if (iconCounter >= dictionary.length) { iconCounter = 0; }
    return dictionary[iconCounter++];
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
      strokeOpacity: .4,
      strokeWeight: 0.5,
      fillColor: '#5f327',
      fillOpacity: 0.2,
      map: map,
      center: latLng,
      radius: radius
    });
  }

  return {
    initialize: initialize,
    getIcon: getIcon,
    markers: markers,
    clearMarkers: clearMarkers,
    panAndFocus: panAndFocus,
    panAndFocusDestination: panAndFocusDestination,
    dropMarker: dropMarker,
    drawCircle: drawCircle,
    dropMarkerWithLabel: dropMarkerWithLabel,
    targetLocation: targetLocation,
    toggleInfoWindow: toggleInfoWindow
  };

}]);
