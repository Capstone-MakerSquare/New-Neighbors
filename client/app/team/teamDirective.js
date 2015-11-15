var team = angular.module('myApp.team', []);

team.directive('team', [function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/team/teamTemplate.html'
  };
}]);


// angular.module('myApp.footer')
// .directive('footer', [function() {
//   return {
//     restrict: 'E',
//     replace: true,
//     templateUrl: 'app/footer/footerTemplate.html'
//   };
// }]);



// var filter = angular.module('myApp.filter', []);

// filter.controller('filterController', [function (){}]);


// filter.directive('filters', [function() {

//   return {
//     restrict: 'E',
//     replace: true,
//     templateUrl: 'app/filter/filterTemplate.html'
//   };
// }]);
