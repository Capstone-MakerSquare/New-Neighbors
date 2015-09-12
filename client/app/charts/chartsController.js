angular.module('myApp.charts', [])

.controller('chartsCtrl', function($scope){

    var chartData = {nationalHomesWithKids: 0.313623902816284};

})
.factory('Charts', function () {

  var runDrawBar = true;
  var runDrawPie = true;

  var barChartData = function(obj) {
    console.log('demography homes with kids', obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[4], '.values[0]');
    var barChartObj = {};
    if (obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[4].values[0].neighborhood) {
      barChartObj.homesWithKidsTurf = obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[4].values[0].neighborhood;
    } else if (obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[4].values[0].city) {
      barChartObj.homesWithKidsTurf = obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[4].values[0].city;
    } else {
      runDrawBar = false;
    }
    console.log('barChartObj', barChartObj);
  };

  var drawBar = function() {
    if (runDrawBar){
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
  };

  var pieChartData = function(obj) {
    var pieChartObj = {};
    // if () {
    //   pieChartObj= obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[4].values[0].neighborhood;
    // } else if (obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[4].values[0].city) {
    //   barChartObj.homesWithKidsTurf = obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[4].values[0].city;
    // } else {
    //   runDrawPie = false;
    // }
    // console.log('barChartObj', barChartObj);
  };

  var drawPie = function() {
    if (runDrawPie) {
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
    } else if (!runDrawPie && !runDrawBar) {
      $('#pie-chart').html('<div>No Data Available</div>');
    }
  };

  return {
    drawBar: drawBar,
    drawPie: drawPie,
    barChartData: barChartData
  };

});
