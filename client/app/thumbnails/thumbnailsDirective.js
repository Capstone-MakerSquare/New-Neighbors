var thumbnails = angular.module('myApp.thumbnails', []);
thumbnails.directive('thumbnail', [function() {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/thumbnails/thumbnailsTemplate.html'
  };
}]);