mapMod.directive('map', ['Map', function (Map) {

  var link = function() {
    var centerUS = {
      latitude: 38.5,
      longitude: -96
    };
    Map.initialize(centerUS);
    Map.panAndFocusDestination(Map.userDestination);
  }

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/map/mapTemplate.html',
    controller: 'MainController',
    controllerAs: 'main',
    link: link  //'link' is a keyword that invokes once the directive is done loading
  };
}]);

