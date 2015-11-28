var filter = angular.module('myApp.filter', []);
filter.directive('filters', [function() {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/filter/filterTemplate.html'
  };
}]);