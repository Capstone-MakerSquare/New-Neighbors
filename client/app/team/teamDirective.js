var team = angular.module('myApp.team', []);

team.directive('team', [function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/team/teamTemplate.html'
  };
}]);
