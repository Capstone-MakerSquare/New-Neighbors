angular.module('myApp.charts')
.directive('charts', ['DrawBar', '$timeout', function(DrawBar, $timeout) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/charts/chartsTemplate.html',
    link: function() {
      $timeout( function(){
        DrawBar.drawBar()
        DrawBar.drawPie()
      }, 0);
    }
  };
}]);
