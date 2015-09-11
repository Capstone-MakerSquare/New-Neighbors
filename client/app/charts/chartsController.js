angular.module('myApp.charts', [])

.controller('chartsCtrl', function($scope){
    var chartData = [];
})
.factory('DrawBar', function () {
  return {
    drawBar: function() {
      $('#percentage-chart').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Turf Compared With Nation'
        },
        xAxis: {
            categories: [
                'Households with Kids',
                'Property Owners (vs. Renters)',
                'Singles'
            ]
        },
        yAxis: [{
            min: 0,
            title: {
                text: 'Percentage'
            }
        }],
        legend: {
            shadow: false
        },
        tooltip: {
            shared: true
        },
        plotOptions: {
            column: {
                grouping: false,
                shadow: false,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Nation',
            color: 'rgba(165,170,217,1)',
            data: [50, 70, 60],
            pointPadding: 0,
            pointPlacement: 0
        }, {
            name: 'Turf',
            color: 'rgba(126,86,134,.9)',
            data: [13, 40, 70],
            pointPadding: 0.2,
            pointPlacement: 0
        }]
      });
    }
  };
});
