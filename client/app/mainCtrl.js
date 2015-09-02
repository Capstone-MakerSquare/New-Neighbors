angular.module('myApp',[])
.controller('MainController', [function (){
  var main = this;

  main.address = '';
  main.bedrooms = '';
  main.bathrooms = '';
  main.buyOrRent = 'rent';

  main.searchInfo = { };

  main.initMap = function() {

  }

  main.dothis = function() {
    console.log('doing the thing');
  }

  main.submitAddress = function() {
    console.log('mainCtrl.js says: Submitted address:', main.address);

    main.searchInfo.bedrooms = main.bedrooms;
    main.searchInfo.bathrooms = main.bathrooms;
    main.searchInfo.buyOrRent = main.buyOrRent;


    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': main.address }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        console.log(results[0].geometry.location);
        console.log('results address', results[0].formatted_address);
        if (!isNaN(results[0].formatted_address[0])) {
          main.searchInfo.address = results[0].formatted_address;
          // Api.submit(main.searchInfo);
        } else {
          alert("Please insert a valid U.S. address");
        }
      } else {
        console.log('error: ', status, ' ', results)
      }
    });


  };


}]);
