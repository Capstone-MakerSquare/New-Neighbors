angular.module('myApp',['myApp.mapServices', 'myApp.services'])
.controller('MainController', ['Map', 'Api', function (Map, Api){
  var main = this;

  main.neighborhoodsObj;
  main.address = '';
  main.bedrooms = '';
  main.bathrooms = '';
  main.buyOrRent = 'rent';

  main.searchInfo = { };

  //----------------------------------------------------------------------------------
  //Function to initialize and draw the map, centering on the user's current location
  main.initMap = function() {
    //test coordinates
    var coordinates = {
      latitude: 40.5,
      longitude: -98
    };

    Map.initialize(coordinates);
  }

  //----------------------------------------------------------------------------------
  //Function to test new methods defined in mapService
  //remove
  main.testMap = function() {
    console.log('mainCtrl.js says: Calling Maps test');  //make the submit button work
    Map.test();
    Map.panAndFocus({
      latitude: 32,
      longitude: -110
    });
    Map.dropMarker({
      latitude: 32,
      longitude: -110
    });
  }

  //----------------------------------------------------------------------------------
  //Function to set up autocomplete feature for the search field
  main.autoCompleteInit = function () {
    var input = document.getElementById('place-search');
    var options = { types: [] };
    var autocomplete = new google.maps.places.Autocomplete(input, options);
  };

  //----------------------------------------------------------------------------------
  //Function to add a marker on the map
  main.addMarker = function (coordinates) {
    Map.dropMarker(coordinates);
  };


  //----------------------------------------------------------------------------------
  //Function to fetch address and validate it
  main.submitAddress = function() {
    console.log('mainCtrl.js says: Submitted address:', main.address);

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
    //       // Api.submit(main.searchInfo);
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
    Api.submit(main.searchInfo).then(function(data) {
     console.log('mainControllerJS dataobj', data);
     main.neighborhoodsObj = data;
    });
  }

  //----------------------------------------------------------------------------------
  main.initMap();
  main.autoCompleteInit();

}]);











