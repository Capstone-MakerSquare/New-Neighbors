app.controller('MainController', ['Map', 'ServerApi', '$state', function (Map, ServerApi, $state){

  var main = this;
  console.log(main.isCollapsed);
  main.isCollapsed = false;
  console.log(main.isCollapsed);
  main.neighborhoodsObj = {}; //this is the response from the server

  main.searchInfo = {}; // JSON obj to send to server
  main.searchInfo.address = '';
  main.searchInfo.buyOrRent = 'rent';
  main.searchInfo.bedrooms = 1;
  main.searchInfo.bathrooms = 1;
  main.searchInfo.maxRent = 8000;
  main.searchInfo.commuteTime = 150;
  main.searchInfo.commuteDistance = 70;
  main.imageArray = ['../assets/images/default-neighborhood-bg.jpg', '../assets/images/default-photo-gallery.jpg', '../assets/images/santamonica.jpg'];

  main.filteredNeighborhoodArray = [];
  main.serverResponse = {};

  main.coordinates = {
      latitude: 38.5,
      longitude: -98.5
  };

  //unscoped local variables
  var autocomplete;

  //----------------------------------------------------------------------------------
  // Function to flatten the object so that the array can be sorted by a parameter
  // Input: neighborhoodsObj
  // Output: flattened array of objects
  main.orderByArray = function(neighborhoods){
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
  main.setValueRent = function() {
    main.searchInfo.buyOrRent = 'rent';
  };

  //Function to set the selected type of housing to 'buy'
  main.setValueBuy = function() {
    main.searchInfo.buyOrRent = 'buy';
  };


  //----------------------------------------------------------------------------------
  //Function to set up autocomplete feature for the search field
  main.autoCompleteInit = function () {
    var input = document.getElementById('place-search');
    var options = { types: [] };
    autocomplete = new google.maps.places.Autocomplete(input, options);

    //listener to listen to a place change
    autocomplete.addListener('place_changed', function() {
      var place = autocomplete.getPlace();
      console.log('mainCtrl.js says: Place changed. Place:',place.formatted_address);
      if(place.formatted_address || main.searchInfo.address.length > 0) {
        main.searchInfo.address = place.formatted_address || main.searchInfo.address;
        main.submitAddress();
      }
    });
  };

  //----------------------------------------------------------------------------------
  //Function to fetch address and validate it
  main.submitAddress = function() {
    $state.go('main.results');
    // console.log('mainCtrl.js says: Submitted address (autocomplete):', place.formatted_address);
    // console.log('mainCtrl.js says: Submitted address (angular):', main.searchInfo.address);
    main.filteredNeighborhoodArray = [];
    requestNeighborhoods();

    //Get the geocode of the address
    //drop a marker on the geocode

    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': main.searchInfo.address }, function(results, status) {

      if (status === google.maps.GeocoderStatus.OK) {
        var address = results[0].formatted_address;
        var coordinates = { latitude : results[0].geometry.location.G, longitude : results[0].geometry.location.K };

        //remove
        // console.log('submitAddress():geocode says: Results: ',results);
        // console.log('submitAddress():geocode says: Address: ',address);
        // console.log('submitAddress():geocode says: Coordinates: ',coordinates);

        Map.panAndFocus(coordinates);
        //Map.dropMarker(coordinates);

        //testing an animated marker
        Map.dropMarkerWithLabel(coordinates);

        //remove
        //Map.drawCircle(coordinates, 4000);

      } else {
        console.log('submitAddress(): NOT_OK geocode says: Status, results: ', status, ',', results);
      }
    });
  };

  //----------------------------------------------------------------------------------
  // Function to make an API request for neighborhoods
  var requestNeighborhoods = function() {
    ServerApi.submit(main.searchInfo)
    .then(function(data) {
        main.severResponse = data;
        main.neighborhoods = Object.keys(data).map(function(key) {
        return data[key];
     });

     main.neighborhoodArray = main.orderByArray(main.neighborhoods);
     console.log(main.neighborhoods)
     main.filterNeighborhoods();
     console.log('order by array', main.neighborhoodArray);
    });
  };

  //----------------------------------------------------------------------------------
  // Function to filter neighborhoods by user's filter options
  main.filterNeighborhoods = function() {
    console.log('filterNeighborhoods')
    main.filteredNeighborhoodArray = main.neighborhoodArray.filter(function(obj) {
      return !(main.searchInfo.maxRent < obj.estimateLow) &&
      !(main.searchInfo.commuteTime < obj.commuteTime) &&
      !(main.searchInfo.commuteDistance < obj.commuteDistance);
    });
  };

  //----------------------------------------------------------------------------------
  // Helper functions - GOOGLE MAPS

  //----------------------------------------------------------------------------------
  //Function to initialize and draw the map, centering on the the center of the U.S.
  main.initMap = function() {
    console.log("main.initMap")
    var centerUS = {
      latitude: 38.5,
      longitude: -96
    };
    //test coordinates
    Map.initialize(centerUS);
  };

  //----------------------------------------------------------------------------------
  //Function to add a marker on the map
  main.addMarker = function (coordinates, title) {
    title = 'Test marker' || title;
    Map.dropMarker(coordinates, title);
  };

  //----------------------------------------------------------------------------------
  //Function to test new methods defined in mapService
  //remove
  main.testMap = function() {
    console.log('mainCtrl.js says: testMap called');  //make the submit button work
    // Map.panAndFocus(main.coordinates);
    // Map.dropMarker(main.coordinates);
  };

  //----------------------------------------------------------------------------------
  //Function to drop a circle + marker on a selected neighborhood
  main.selectNeighborhood = function (neighborhood) {
    // console.log('mainCtrl.js says: selected Neighborhood: ', neighborhood);

    Map.dropMarker(neighborhood.coordinates);
    Map.panAndFocus(neighborhood.coordinates, 13);
    Map.drawCircle(neighborhood.coordinates, 2000);
  };

  //----------------------------------------------------------------------------------
  // Initialization functions
  setTimeout(main.autoCompleteInit, 200);

  main.randomImage = function(){
    // removed this line so the image is no longer random: return { 'background-image': 'url("' + main.imageArray[Math.floor(Math.random() * main.imageArray.length)] + '")' };
    return { 'background-image': 'url("' + main.imageArray[1] + '")' };
  };

}]);











