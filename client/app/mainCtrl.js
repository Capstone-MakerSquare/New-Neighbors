angular.module('myApp',['myApp.mapServices', 'myApp.requestHoodServices'])
.controller('MainController', ['Map', 'ServerApi', function (Map, ServerApi){
  var main = this;

  main.neighborhoodsObj;
  main.address = '';
  main.bedrooms = 2;
  main.bathrooms = 2;
  main.buyOrRent = 'rent';

  main.searchInfo = { };
  main.coordinates = {
      latitude: 40.5,
      longitude: -98
  };

  //unscoped local variables
  var autocomplete;

  //----------------------------------------------------------------------------------
  //Function to initialize and draw the map, centering on the the center of the U.S. or user-inputted coordinates
  main.initMap = function() {
    //test coordinates
    Map.initialize(main.coordinates);
  };

  //----------------------------------------------------------------------------------
  //Function to test new methods defined in mapService
  //remove
  main.testMap = function() {
    console.log('mainCtrl.js says: testMap called');  //make the submit button work
    Map.panAndFocus(main.coordinates);
    Map.dropMarker(main.coordinates);
  };

  //----------------------------------------------------------------------------------
  //Function to set up autocomplete feature for the search field
  main.autoCompleteInit = function () {
    var input = document.getElementById('place-search');
    var options = { types: [] };
    autocomplete = new google.maps.places.Autocomplete(input, options);

    //listener to listen to a place change
    // autocomplete.addListener('place_changed', function() {
    //   var place = autocomplete.getPlace();
    //   console.log('mainCtrl.js says: Place changed. Place:',place.formatted_address);
    // });

  };

  //----------------------------------------------------------------------------------
  //Function to add a marker on the map
  main.addMarker = function (coordinates, title) {
    var title = 'Test marker' || title;
    Map.dropMarker(coordinates, title);
  };


  //----------------------------------------------------------------------------------
  //Function to fetch address and validate it
  main.submitAddress = function() {
    var place = autocomplete.getPlace()
    console.log('mainCtrl.js says: Submitted address (autocomplete):', place.formatted_address);
    console.log('mainCtrl.js says: Submitted address (angular):', main.address);

    main.searchInfo.address = place.formatted_address;
    main.searchInfo.bedrooms = main.bedrooms;
    main.searchInfo.bathrooms = main.bathrooms;
    main.searchInfo.buyOrRent = main.buyOrRent;


    // geocoder = new google.maps.Geocoder();
    // geocoder.geocode({ 'address': main.address }, function(results, status) {
    //   if (status == google.maps.GeocoderStatus.OK) {
    //     console.log(results[0].geometry.location);
    //     console.log('results address', results[0].formatted_address);
    //     if (!isNaN(results[0].formatted_address[0])) {
    //       main.searchInfo.address = results[0].formatted_address;
    //       // ServerApi.submit(main.searchInfo);
    //     } else {
    //       alert("Please insert a valid U.S. address");
    //     }
    //   } else {
    //     console.log('error: ', status, ' ', results)
    //   }
    // });

    main.testMap();
    requestNeighborhoods();
  };


  //----------------------------------------------------------------------------------
  // Function to make an API request for neighborhoods
  var requestNeighborhoods = function () {
    ServerApi.submit(main.searchInfo).then(function(data) {
     console.log('mainControllerJS dataobj', data);
     main.neighborhoodsObj = data;
    });
  };

  //----------------------------------------------------------------------------------
  //Initialize the map view
  main.initMap();
  main.autoCompleteInit();

}]);











