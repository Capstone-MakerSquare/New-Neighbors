angular.module('app',['app.services'])
.controller('MainController', ['Api', function (Api){
  var main = this;

  main.address = '';
  main.bedrooms = '';
  main.bathrooms = '';

  main.searchInfo = { };

  main.submitAddress = function() {
    console.log('mainCtrl.js says: Submitted address:', main.address);
    
    main.searchInfo.address = main.address;
    main.searchInfo.bedrooms = main.bedrooms;
    main.searchInfo.bathrooms = main.bathrooms;

    Api.submit(main.searchInfo);
  };

}]);
