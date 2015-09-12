angular.module('myApp.charts')
.directive('charts', ['Charts', '$timeout', function(Charts, $timeout) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/charts/chartsTemplate.html',
    link: function() {
      $timeout( function(){
        Charts.drawBar()
        Charts.drawPie()
      }, 0);
    }
  };
}]);
