angular.module('myApp.charts', [])

.controller('chartsCtrl', function($scope){
})
.factory('Charts', function () {

  var runDrawBar = true;
  var runDrawPie = true;
  var barChartObj = {nationalHomesWithKids: 31, nationalMedianHouseholdIncome: 44512, nationalOwners: 66};
  var pieChartObj = {};

  var barChartData = function(obj) {
    var runOwn = true;
    var runKids = true;
    //verifing data is coming from zillow
    if(obj &&
    obj.demography &&
    obj.demography.pages &&
    obj.demography.pages[0] &&
    obj.demography.pages[0].page &&

    //verifying data for homes with kids
    obj.demography.pages[0].page[2] &&
    obj.demography.pages[0].page[2].tables &&
    obj.demography.pages[0].page[2].tables[0] &&
    obj.demography.pages[0].page[2].tables[0].table &&
    obj.demography.pages[0].page[2].tables[0].table[0] &&
    obj.demography.pages[0].page[2].tables[0].table[0].data &&
    obj.demography.pages[0].page[2].tables[0].table[0].data[0] &&
    obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute &&
    obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[4] &&
    obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[4].values &&
    obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[4].values[0] &&

    //verifying data for home owners
    obj.demography.pages[0].page[1] &&
    obj.demography.pages[0].page[1].tables &&
    obj.demography.pages[0].page[1].tables[0] &&
    obj.demography.pages[0].page[1].tables[0].table &&
    obj.demography.pages[0].page[1].tables[0].table[0] &&
    obj.demography.pages[0].page[1].tables[0].table[0].data &&
    obj.demography.pages[0].page[1].tables[0].table[0].data[0] &&
    obj.demography.pages[0].page[1].tables[0].table[0].data[0].attribute &&
    obj.demography.pages[0].page[1].tables[0].table[0].data[0].attribute[0] &&
    obj.demography.pages[0].page[1].tables[0].table[0].data[0].attribute[0].values &&
    obj.demography.pages[0].page[1].tables[0].table[0].data[0].attribute[0].values[0]) {

      var kidPath = obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[4].values[0];
      var ownPath = obj.demography.pages[0].page[1].tables[0].table[0].data[0].attribute[0].values[0]
      //var incomePath = obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[0].values[0];

      //households with kids
      if (kidPath.neighborhood && kidPath.neighborhood[0] && kidPath.neighborhood[0].value && kidPath.neighborhood[0].value[0]) {
        console.log('kid neighborhood');
        barChartObj.homesWithKidsTurf = Math.round(100*parseFloat(kidPath.neighborhood[0].value[0]._));
      } else if (kidPath.city && kidPath.city[0] && kidPath.city[0].value && kidPath.city[0].value[0]) {
        console.log('kid city');
        barChartObj.homesWithKidsTurf = Math.round(100*parseFloat(kidPath.city[0].value[0]._));
      } else {
        runKids = false;
      }

      //median household income needs error handling if certain objects don't exist
      // if (incomePath.neighborhood && incomePath.neighborhood[0].value[0]) {
      //   console.log('barChartData neighborhood', JSON.stringify(incomePath.neighborhood[0].value[0]._));
      //   barChartObj.medianHouseholdIncomeTurf = 100*parseFloat(incomePath.neighborhood[0].value[0]._);
      // } else if (incomePath.city && incomePath.city.value[0]) {
      //   console.log('barChartData city', JSON.stringify(incomePath.city[0].value[0]._));
      //   barChartObj.medianHouseholdIncomeTurf = 100*parseFloat(incomePath.city[0].value[0]._);
      // } else {
      //   runDrawBar = false;
      // }

      //percentage of property owners (vs. renters)
      if (ownPath.neighborhood && ownPath.neighborhood[0] && ownPath.neighborhood[0].value && ownPath.neighborhood[0].value[0] && ownPath.neighborhood[0].value[0]._) {
        console.log('own neighborhood');
        barChartObj.ownersTurf = Math.round(100*parseFloat(ownPath.neighborhood[0].value[0]._));
      } else if (ownPath.city && ownPath.city.value && ownPath.city.value[0] && ownPath.city[0].value[0]._) {
        console.log('own city');
        barChartObj.ownersTurf = Math.round(100*parseFloat(ownPath.city[0].value[0]._));
      } else {
        runOwn = false;
      }
    }

    if (!runOwn || !runKids) {
      runDrawBar = false;
    }
    console.log('runKids', runKids);
    console.log('runOwn', runOwn);
    console.log('runDrawBar', runDrawBar);
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
                'Percentage of Households with Kids',
                'Percentage of Property Owners (vs. Renters)',
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
            data: [barChartObj.nationalHomesWithKids, barChartObj.nationalOwners, 60],
            pointPadding: 0,
            pointPlacement: 0
        }, {
            name: 'Neighborhood',
            color: '#5F327C',
            data: [barChartObj.homesWithKidsTurf, barChartObj.ownersTurf, 70],
            pointPadding: 0.2,
            pointPlacement: 0
        }]
      });
    }
  };

  var pieChartData = function(obj) {
    if (obj &&
        obj.demography &&
        obj.demography.pages &&
        obj.demography.pages[0] &&
        obj.demography.pages[0].page &&
        obj.demography.pages[0].page[2] &&
        obj.demography.pages[0].page[2].tables &&
        obj.demography.pages[0].page[2].tables[0] &&
        obj.demography.pages[0].page[2].tables[0].table &&
        obj.demography.pages[0].page[2].tables[0].table[1] &&
        obj.demography.pages[0].page[2].tables[0].table[1].data &&
        obj.demography.pages[0].page[2].tables[0].table[1].data[0] &&
        obj.demography.pages[0].page[2].tables[0].table[1].data[0].attribute)
    {
      var agePath = obj.demography.pages[0].page[2].tables[0].table[1].data[0].attribute
      console.log('pieChartData agePath', JSON.stringify(agePath));
      if (agePath[0] && agePath[0].value && agePath[0].value[0] && agePath[0].value[0]._) {
        pieChartObj['70+ years'] = Math.round(100 * parseFloat(agePath[0].value[0]._));
      }
      if (agePath[7] && agePath[7].value && agePath[7].value[0] && agePath[7].value[0]._) {
        pieChartObj['60-70 years'] = Math.round(100 * parseFloat(agePath[7].value[0]._));
      }
      if (agePath[6] && agePath[6].value && agePath[6].value[0] && agePath[6].value[0]._) {
        pieChartObj['50-60 years'] = Math.round(100 * parseFloat(agePath[6].value[0]._));
      }
      if (agePath[5] && agePath[5].value && agePath[5].value[0] && agePath[5].value[0]._) {
        pieChartObj['40-50 years'] = Math.round(100 * parseFloat(agePath[5].value[0]._));
      }
      if (agePath[4] && agePath[4].value && agePath[4].value[0] && agePath[4].value[0]._) {
        pieChartObj['30-40 years'] = Math.round(100 * parseFloat(agePath[4].value[0]._));
      }
      if (agePath[3] && agePath[3].value && agePath[3].value[0] && agePath[3].value[0]._) {
        pieChartObj['20-30 years'] = Math.round(100 * parseFloat(agePath[3].value[0]._));
      }
      if (agePath[2] && agePath[2].value && agePath[2].value[0] && agePath[2].value[0]._) {
        pieChartObj['10-20 years'] = Math.round(100 * parseFloat(agePath[2].value[0]._));
      }
      if (agePath[1] && agePath[1].value && agePath[1].value[0] && agePath[1].value[0]._) {
        pieChartObj['0-10 years'] = Math.round(100 * parseFloat(agePath[1].value[0]._));
      }
    } else {
      runDrawPie = false;
    }
    console.log('runDrawPie', runDrawPie);
    console.log('pieChartObj', JSON.stringify(pieChartObj));
  };

  var drawPie = function() {
    if (runDrawPie) {
      $('#pie-chart').highcharts({
          chart: {
              type: 'pie'
          },
          title: {
            text: 'Ages by Decade'
          },
          plotOptions: {
              pie: {
                  borderWidth: 3
              }
          },
          series: [{
            data: [
              ['0-10 years old (%)',    pieChartObj['0-10 years']],
              ['10-20 years old (%)',    pieChartObj['10-20 years']],
              ['20-30 years old (%)',    pieChartObj['20-30 years']],
              ['30-40 years old (%)',    pieChartObj['30-40 years']],
              ['40-50 years old (%)',    pieChartObj['40-50 years']],
              ['50-60 years old (%)',    pieChartObj['50-60 years']],
              ['60-70 years old (%)',    pieChartObj['60-70 years']],
              ['70+ years old (%)',    pieChartObj['70+ years']]
            ]
          }]
      });
    } else if (!runDrawPie && !runDrawBar) {
      $('#pie-chart').html('<div>No Statistics Available</div>');
    }
  };

  return {
    drawBar: drawBar,
    drawPie: drawPie,
    barChartData: barChartData,
    pieChartData: pieChartData
  };

});
