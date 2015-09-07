console.log("results controller has been called");
var results = angular.module('myApp.results', []);

results.controller('resultsController', ['Map', 'ServerApi', function (Map, ServerApi){

  var res = this;

  res.neighborhoodsObj = {}; //this is the response from the server

  res.searchInfo = {}; // JSON obj to send to server
  res.searchInfo.address = '';
  res.searchInfo.buyOrRent = 'rent';
  res.searchInfo.bedrooms = 1;
  res.searchInfo.bathrooms = 1;
  res.searchInfo.maxRent = 8000;
  res.searchInfo.commuteTime = 150;
  res.searchInfo.commuteDistance = 70;

  res.coordinates = {
      latitude: 37.7833,
      longitude: -122.4167
  };

  //unscoped local variables
  var autocomplete;

  //----------------------------------------------------------------------------------
  // Function to flatten the object so that the array can be sorted by a parameter
  // Input: neighborhoodsObj
  // Output: flattened array of objects
  res.orderByArray = function(neighborhoods){
    var arr = [];
    for (var i = 0; i < neighborhoods.length; i++) {
      arr.push({
          name: neighborhoods[i].name,
          commuteTime: neighborhoods[i].commuteInfo.commuteTime,
          commuteDistance: neighborhoods[i].commuteInfo.commuteDistance,
          estimateHigh: neighborhoods[i].rentEstimate.estimateHigh,
          estimateLow: neighborhoods[i].rentEstimate.estimateLow,
          coordinates: {latitude: neighborhoods[i].latitude, longitude: neighborhoods[i].longitude}
      });
    }
    return arr;
  };

  //Function to set the selected type of housing to 'rent'
  res.setValueRent = function() {
    res.searchInfo.buyOrRent = 'rent';
  };

  //Function to set the selected type of housing to 'buy'
  res.setValueBuy = function() {
    res.searchInfo.buyOrRent = 'buy';
  };


  //----------------------------------------------------------------------------------
  //Function to set up autocomplete feature for the search field
  res.autoCompleteInit = function () {
    var input = document.getElementById('place-search');
    var options = { types: [] };
    autocomplete = new google.maps.places.Autocomplete(input, options);

    //listener to listen to a place change
    autocomplete.addListener('place_changed', function() {
      var place = autocomplete.getPlace();
      console.log('resCtrl.js says: Place changed. Place:',place.formatted_address);
      if(place.formatted_address || res.searchInfo.address.length > 0) {
        res.searchInfo.address = place.formatted_address || res.searchInfo.address;
        res.submitAddress();
      }
    });
  };

  //----------------------------------------------------------------------------------
  //Function to fetch address and validate it
  res.submitAddress = function() {
    // console.log('resCtrl.js says: Submitted address (autocomplete):', place.formatted_address);
    // console.log('resCtrl.js says: Submitted address (angular):', res.searchInfo.address);
    requestNeighborhoods();

    //Get the geocode of the address
    //drop a marker on the geocode

    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': res.searchInfo.address }, function(results, status) {

      if (status === google.maps.GeocoderStatus.OK) {
        var address = results[0].formatted_address;
        var coordinates = { latitude : results[0].geometry.location.G, longitude : results[0].geometry.location.K };

        //remove
        console.log('submitAddress():geocode says: Results: ',results);
        console.log('submitAddress():geocode says: Address: ',address);
        console.log('submitAddress():geocode says: Coordinates: ',coordinates);

        Map.panAndFocus(coordinates);
        //Map.dropMarker(coordinates);

        //testing an animated marker
        Map.dropMarkerWithLabel(coordinates);

        //remove
        //Map.drawCircle(coordinates, 4000);

      } else {
        console.log('submitAddress():geocode says: Status, results: ', status, ',', results);
      }
    });
  };

  //----------------------------------------------------------------------------------
  // Function to make an API request for neighborhoods
  var requestNeighborhoods = function() {
    ServerApi.submit(res.searchInfo)
    .then(function(data) {
       res.neighborhoods = Object.keys(data).map(function(key) {
       return data[key];
     });
     res.neighborhoodArray = res.orderByArray(res.neighborhoods);
     res.filterNeighborhoods();
     console.log('order by array', res.neighborhoodArray);
    });
  };

  //----------------------------------------------------------------------------------
  // Function to filter neighborhoods by user's filter options 
  res.filterNeighborhoods = function() {
    res.filteredNeighborhoodArray = res.neighborhoodArray.filter(function(obj) {
      return res.searchInfo.maxRent > obj.estimateLow && 
      res.searchInfo.commuteTime > obj.commuteTime && 
      res.searchInfo.commuteDistance > obj.commuteDistance;
    });
  };

  //----------------------------------------------------------------------------------
  // Helper functions - GOOGLE MAPS

  //----------------------------------------------------------------------------------
  //Function to initialize and draw the map, centering on the the center of the U.S.
  res.initMap = function() {
    var centerUS = {
      latitude: 38.5,
      longitude: -96
    };
    //test coordinates
    Map.initialize(centerUS);
  };

  //----------------------------------------------------------------------------------
  //Function to add a marker on the map
  res.addMarker = function (coordinates, title) {
    title = 'Test marker' || title;
    Map.dropMarker(coordinates, title);
  };

  //----------------------------------------------------------------------------------
  //Function to test new methods defined in mapService
  //remove
  res.testMap = function() {
    console.log('resCtrl.js says: testMap called');  //make the submit button work
    // Map.panAndFocus(res.coordinates);
    // Map.dropMarker(res.coordinates);
  };

  //----------------------------------------------------------------------------------
  //Function to drop a circle + marker on a selected neighborhood
  res.selectNeighborhood = function (neighborhood) {
    console.log('resCtrl.js says: selected Neighborhood: ', neighborhood);

    Map.dropMarker(neighborhood.coordinates);
    Map.panAndFocus(neighborhood.coordinates, 13);
    Map.drawCircle(neighborhood.coordinates, 2000);

  }

  //----------------------------------------------------------------------------------
  //Initialization functions
  // res.initMap();
  // res.autoCompleteInit();
}]);

