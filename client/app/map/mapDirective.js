var mapMod = angular.module('myApp.map',[]);

mapMod.directive('map', ['Map', '$scope', function (Map, $scope) {

  var link = function(scope) {
    var centerUS = {
      latitude: 38.5,
      longitude: -96
    };
    Map.initialize(centerUS);
    Map.panAndFocusDestination(Map.targetLocation);
    setTimeout(function () { $scope.$apply(); }, 500);
  }

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/map/mapTemplate.html',
    controller: 'MainController',
    controllerAs: 'main',
    scope: false,
    link: link  //'link' is a keyword that invokes once the directive is done loading
  };
}]);

