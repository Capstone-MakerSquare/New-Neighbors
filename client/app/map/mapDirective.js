var map = angular.module('myApp.map');

map.directive('map', ['Map', '$rootScope', function(Map, $rootScope) {

  var link = function(scope, element, attrs) {
    var $el = $(element);
    var mapCanvas = $el.find('#map-canvas')[0];

    Map.init(mapCanvas);
  };

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'js/map/mapTemplate.html',
    link: link
  };
}]);
