mapMod.directive('map', ['Map', '$rootScope', function(Map, $rootScope) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/map/mapTemplate.html'
  };
}]);


