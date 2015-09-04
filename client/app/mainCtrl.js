angular.module('myApp',['myApp.mapServices', 'myApp.requestHoodServices'])
.controller('MainController', ['Map', 'ServerApi', function (Map, ServerApi){
  var main = this;

  main.neighborhoodsObj = {}; //this is the response from the server

    //----------------------------------------
  //Example data start
  main.exampleData = {"Downtown":{
  "name":"Downtown",
  "latitude":34.040713,
  "longitude":-118.2467693,
  "placeId":"ChIJAf09JTTGwoARIKmlGd9S_iY",
  "streetAddress":"513 East 7th Street, Los Angeles, CA 90014, USA",
  "commuteInfo":{
    "commuteDistance":0.8,
    "commuteTime":3
    },
  "rentEstimate":{
    "estimateHigh":2950,
    "estimateLow":1695
    },
    "propertyType":"apartment_condo"
  },
  "Boyle Heights":{"name":"Boyle Heights","latitude":34.0297895,"longitude":-118.2117257,"placeId":"ChIJ6VmanALGwoARlDo5dgynnuw","streetAddress":"2754 East 7th Street, Los Angeles, CA 90023, USA","commuteInfo":{"commuteDistance":2,"commuteTime":8},"rentEstimate":{"estimateHigh":1550,"estimateLow":955},"propertyType":"apartment_condo"},"Fashion District":{"name":"Fashion District","latitude":34.0331364,"longitude":-118.2497386,"placeId":"ChIJf_9O_SzGwoARtrkWOBLCwII","streetAddress":"1016 Towne Avenue, Los Angeles, CA 90021, USA","commuteInfo":{"commuteDistance":0.7,"commuteTime":4},"rentEstimate":{"estimateHigh":2600,"estimateLow":1250},"propertyType":"apartment_condo"},"Vernon":{"name":"Vernon","latitude":34.003903,"longitude":-118.230073,"placeId":"ChIJr-7gz9PIwoARk3YHNju1ZSE","streetAddress":"4401-4421 Pacific Boulevard, Vernon, CA 90058, USA","commuteInfo":{"commuteDistance":2.5,"commuteTime":9},"rentEstimate":{},"propertyType":"apartment_condo"},"South Los Angeles":{"name":"South Los Angeles","latitude":33.9891116,"longitude":-118.2914872,"placeId":"ChIJ6bcf1Nu3woARGCYveWr_oiQ","streetAddress":"5818 South Vermont Avenue, Los Angeles, CA 90037, USA","commuteInfo":{"commuteDistance":7.4,"commuteTime":16},"rentEstimate":{"estimateHigh":1375,"estimateLow":795},"propertyType":"apartment_condo"},"Los Angeles":{"name":"Los Angeles","latitude":34.0522342,"longitude":-118.2436849,"placeId":"ChIJE9on3F3HwoAR9AhGJW_fL-I","streetAddress":"102 West 1st Street, Los Angeles, CA 90012, USA","commuteInfo":{"commuteDistance":1.8,"commuteTime":7},"rentEstimate":{"estimateHigh":2300,"estimateLow":1295},"propertyType":"apartment_condo"},"Northeast Los Angeles":{"name":"Northeast Los Angeles","latitude":34.105186,"longitude":-118.2175744,"placeId":"ChIJrSGF3LrGwoARIjminEcj03o","streetAddress":"4042 Marchena Drive, Los Angeles, CA 90065, USA","commuteInfo":{"commuteDistance":7.8,"commuteTime":19},"rentEstimate":{"estimateHigh":1795,"estimateLow":995},"propertyType":"apartment_condo"},"Commerce":{"name":"Commerce","latitude":34.0005691,"longitude":-118.1597929,"placeId":"ChIJJzP0XFjOwoARIDWu3A-zJwc","streetAddress":"2525-2549 South Eastern Avenue, Commerce, CA 90040, USA","commuteInfo":{"commuteDistance":7.4,"commuteTime":14},"rentEstimate":{"estimateHigh":1750,"estimateLow":900},"propertyType":"apartment_condo"},"South Montebello":{"name":"South Montebello","latitude":34.0054303,"longitude":-118.1239717,"placeId":"ChIJfQziLCXOwoARBMcSgO_hycE","streetAddress":"601 South Vail Avenue, Montebello, CA 90640, USA","commuteInfo":{"commuteDistance":7.7,"commuteTime":19},"rentEstimate":{"estimateHigh":1100,"estimateLow":750},"propertyType":"apartment_condo"},"Central LA":{"name":"Central LA","latitude":34.0686748,"longitude":-118.3228165,"placeId":"ChIJz-A_k1nHwoARloiyHDKVAm8","streetAddress":"304 South Plymouth Boulevard, Los Angeles, CA 90020, USA","commuteInfo":{"commuteDistance":8.4,"commuteTime":22},"rentEstimate":{"estimateHigh":1995,"estimateLow":1325},"propertyType":"apartment_condo"},"Pasadena":{"name":"Pasadena","latitude":34.1477849,"longitude":-118.1445155,"placeId":"ChIJUQszONzCwoARSo_RGhZBKwU","streetAddress":"279-299 East Holly Street, Pasadena, CA 91101, USA","commuteInfo":{"commuteDistance":12.7,"commuteTime":23},"rentEstimate":{"estimateHigh":3195,"estimateLow":1300},"propertyType":"apartment_condo"}
  };

  main.neighborhoodsObj = main.exampleData;

  //Example Data end
  //------------------------------------

  main.searchInfo = { }; // JSON obj to send to server
  main.searchInfo.address = '';
  main.searchInfo.buyOrRent = 'rent';
  main.searchInfo.bedrooms = 1;
  main.searchInfo.bathrooms = 1;
  main.searchInfo.maxRent = '';
  main.searchInfo.commuteTime = 30;
  main.searchInfo.commuteDistance = 30;


  main.orderByArray = function(neighborhoods){
    var arr = [];
    for (var i = 0; i < neighborhoods.length; i++) {
      arr.push({
          name: neighborhoods[i].name,
          commuteTime: neighborhoods[i].commuteInfo.commuteTime,
          commuteDistance: neighborhoods[i].commuteInfo.commuteDistance,
          estimateHigh: neighborhoods[i].rentEstimate.estimateHigh,
          estimateLow: neighborhoods[i].rentEstimate.estimateLow
      });
    }
    return arr;
  };

  main.coordinates = {
      latitude: 37.7833,
      longitude: -122.4167
  };

  //----------------------------------------------------------------------------------
  //Function to initialize and draw the map, centering on the the center of the U.S. or user-inputted coordinates
  main.initMap = function() {
    //test coordinates
    Map.initialize(main.coordinates);
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
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    // console.log(JSON.stringify(autocomplete[0]));
    // main.searchInfo.address = autocomplete;
  };

  //----------------------------------------------------------------------------------
  //Function to add a marker on the map
  main.addMarker = function (coordinates, title) {
    title = 'Test marker' || title;
    Map.dropMarker(coordinates, title);
  };


  //----------------------------------------------------------------------------------
  //Function to fetch address and validate it
  main.submitAddress = function() {
    console.log('mainCtrl.js says: Submitted address:', main.searchInfo.address);
    main.searchInfo.address = main.searchInfo.address;


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
     main.neighborhoods = Object.keys(data).map(function(key) {
       return data[key];
     });
     main.neighborhoodArray = main.orderByArray(main.neighborhoods);
     console.log('order by array', main.neighborhoodArray);

    });
  };

  //----------------------------------------------------------------------------------
  //Initialize the map view
  main.initMap();
  main.autoCompleteInit();

}]);













