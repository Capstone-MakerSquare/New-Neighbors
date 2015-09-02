var map = angular.module('myApp.map');

map.factory('MapOptions', [

  function() {
    return {
      zoom: 5,
      minZoom: 3,
      maxZoom: 25,
      center: {
        lat: 35,
        lng: -100
      }
    }
  }
]);
