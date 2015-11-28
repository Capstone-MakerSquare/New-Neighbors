var searchForm = angular.module('myApp.searchForm', []);
searchForm.directive('searchform', [function() {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/searchForm/searchFormTemplate.html'
  };
}]);
