mapMod.directive('map', ['Map', function(Map) {

  var init = function() {
    var centerUS = {
      latitude: 38.5,
      longitude: -96
    };
    Map.initialize(centerUS);
  }

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/map/mapTemplate.html',
    init: init
  };
}]);

