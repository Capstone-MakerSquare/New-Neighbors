var map = angular.module('myApp.map');

map.factory('Map', ['$rootScope', function ($rootScope) {
  var map, center;

  var init = function(mapCanvas) {
    map = new google.maps.Map(mapCanvas, MapOptions);
  };

  var getMap = function() {
    return map;
  };

  return {
    init: init,
    getMap: getMap
  };
}]);
