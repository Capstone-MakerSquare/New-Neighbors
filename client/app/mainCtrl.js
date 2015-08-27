angular.module('app',['app.services'])
.controller('MainController', ['Api', function (Api){
  var main = this;

  main.address = '';
  main.bedrooms = 0;
  main.bathrooms = 0;

  main.searchInfo = { };

  main.submitAddress = function() {
    console.log('mainCtrl.js says: Submitted address:', main.address);
    
    main.searchInfo.address = main.address;
    main.searchInfo.bedrooms = main.bedrooms;
    main.searchInfo.bathrooms = main.bathrooms;
    
    Api.submit(main.searchInfo);
  };

}])
