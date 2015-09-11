angular.module('myApp.charts', [])

.controller('chartsCtrl', function($scope){
    var chartData = [];
})
.factory('DrawBar', function () {
    var drawBar = function() {
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
            name: 'Neighborhood',
            color: '#5F327C',
            data: [13, 40, 70],
            pointPadding: 0.2,
            pointPlacement: 0
        }]
      });
    }

    var drawPie = function() {
    $('#pie-chart').highcharts({
        chart: {
            type: 'pie'
        },

        plotOptions: {
            pie: {
                borderWidth: 3
            }
        },

        series: [{
            data: [
                ['0-10 years old',   10],
                ['10-20 years old',       20],
                ['20-30 years old',       30],
                ['30-40 years old',    15],
                ['40-55 years old',    5],
                ['55-70 years old',    15],
                ['70+ years old',    5]
            ]
        }]
    });
  };
  return {
    drawBar: drawBar,
    drawPie: drawPie
  };
});
