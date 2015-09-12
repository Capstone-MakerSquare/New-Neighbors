angular.module('myApp.charts', [])

.controller('chartsCtrl', function($scope){
})
.factory('Charts', function () {

  var runDrawBar = true;
  var runDrawPie = true;
  var barChartObj = {nationalHomesWithKids: 31.3623902816284, nationalMedianHouseholdIncome: 44512.0130806292};

  var barChartData = function(obj) {
    console.log('barChartData incomePath', JSON.stringify(obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[0].values[0]));
    var kidPath = obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[4].values[0];
    var incomePath = obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[0].values[0];
    // var ownPath = obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[0].values[0]

    //kids
    if (kidPath.neighborhood && kidPath.neighborhood[0].value[0]) {
      barChartObj.homesWithKidsTurf = 100*parseFloat(kidPath.neighborhood[0].value[0]._);
    } else if (kidPath.city && kidPath.city.value[0]) {
      barChartObj.homesWithKidsTurf = 100*parseFloat(kidPath.city[0].value[0]._);
    } else {
      runDrawBar = false;
    }

    //median household income
    // if (incomePath.neighborhood && incomePath.neighborhood[0].value[0]) {
    //   console.log('barChartData neighborhood', JSON.stringify(incomePath.neighborhood[0].value[0]._));
    //   barChartObj.medianHouseholdIncomeTurf = 100*parseFloat(incomePath.neighborhood[0].value[0]._);
    // } else if (incomePath.city && incomePath.city.value[0]) {
    //   console.log('barChartData city', JSON.stringify(incomePath.city[0].value[0]._));
    //   barChartObj.medianHouseholdIncomeTurf = 100*parseFloat(incomePath.city[0].value[0]._);
    // } else {
    //   runDrawBar = false;
    // }

    //property owners vs. renters




    console.log('barChartObj', barChartObj);
  };

  var drawBar = function() {
    console.log('drawBar', barChartObj.homesWithKidsTurf);
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
            max: 100,
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
            data: [barChartObj.nationalHomesWithKids, barChartObj.nationalMedianHouseholdIncome, 60],
            pointPadding: 0,
            pointPlacement: 0
        }, {
            name: 'Neighborhood',
            color: '#5F327C',
            data: [barChartObj.homesWithKidsTurf, barChartObj.medianHouseholdIncomeTurf, 70],
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
