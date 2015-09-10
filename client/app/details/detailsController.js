console.log("details has been called");
var details = angular.module('myApp.details', []);

details.controller('detailsController', ['$scope', function ($scope){

  $scope.picturesArr = [
    'assets/images/default-japan-slideshow-1.jpeg',
    'assets/images/default-japan-slideshow-2.jpeg',
    'assets/images/default-japan-slideshow-3.jpeg',
    'assets/images/default-japan-slideshow-4.jpeg',
    'assets/images/default-japan-slideshow-5.jpeg',
    'assets/images/default-japan-slideshow-6.jpeg',
    'assets/images/default-japan-slideshow-7.jpeg',
    'assets/images/default-japan-slideshow-8.jpeg',
    'assets/images/default-japan-slideshow-9.jpeg'
  ];
}]);