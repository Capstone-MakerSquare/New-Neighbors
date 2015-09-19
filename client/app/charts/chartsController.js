angular.module('myApp.charts', [])

.controller('chartsController', ['$scope', 'Charts', function ($scope, Charts){

  var chart = this;

  chart.income = Charts.demographicsObj.income;
  chart.sqft = Charts.demographicsObj.sqft;
  chart.yearBuilt = Charts.demographicsObj.yearBuilt;

  chart.incomeString = "Median Household Income: $" + parseInt(chart.income).toLocaleString();
  chart.sqftString = "Median Home Size: " + parseInt(chart.sqft).toLocaleString() + " sq. ft.";
  chart.yearBuiltString = "Average Year of Home Construction: " + String(chart.yearBuilt);

}])

.factory('Charts', function () {

  var runDrawBar = false;
  var runDrawPie = true;
  var demographicsObj = {};
  var barChartObj = {};
  var pieChartObj = {};
  var barChartArr = [[],[]];

  //----------------------------------------------------------------------------------
  // Compiles, validates, and maps data for a bar graph from the Zillow Demography data
  // Includes data for % of homes with children, % of owners (vs renters) and % of single people in each neighborhood

  var barChartData = function(obj) {
    barChartObj = {nationalHomesWithKids: 31, nationalMedianHouseholdIncome: 44512, nationalOwners: 66, nationalSingles: 27};
    barChartArr = [[],[]];
    var runOwn = true;
    var runKids = true;
    var runSingles = true;
    runDrawBar = false;
    barChartObj.name = obj.name;
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
      var ownPath = obj.demography.pages[0].page[1].tables[0].table[0].data[0].attribute[0].values[0];



      //households with kids
      if (kidPath.neighborhood && kidPath.neighborhood[0] && kidPath.neighborhood[0].value && kidPath.neighborhood[0].value[0]) {
        //console.log('kid neigborhood');
        barChartObj.homesWithKidsTurf = Math.round(100*parseFloat(kidPath.neighborhood[0].value[0]._));
      } else if (kidPath.city && kidPath.city[0] && kidPath.city[0].value && kidPath.city[0].value[0]) {
        //console.log('kid city');
        barChartObj.homesWithKidsTurf = Math.round(100*parseFloat(kidPath.city[0].value[0]._));
      } else {
        runKids = false;
      }




      //----------------------------------------------------------------------------------------------
      // populating demographicsObj.income with median household income for the neighborhood or city

      if (obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[0] &&
      obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[0].values &&
      obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[0].values[0] ){

        var incomePath = obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[0].values[0];

        if (incomePath.neighborhood && incomePath.neighborhood[0].value && incomePath.neighborhood[0].value[0]) {
          demographicsObj.income = incomePath.neighborhood[0].value[0]._;
        } else if (incomePath.city && incomePath.city[0].value && incomePath.city[0].value[0]) {
          demographicsObj.income = incomePath.city[0].value[0]._;
        }
      }

      //----------------------------------------------------------------------------------------------
      // populating demographicsObj.income with ave square foot size of houses for the neighborhood or city

      if (obj.demography.pages[0].page[1].tables[0].table[0].data[0].attribute[2] &&
      obj.demography.pages[0].page[1].tables[0].table[0].data[0].attribute[2].values &&
      obj.demography.pages[0].page[1].tables[0].table[0].data[0].attribute[2].values[0] ){

        var sqftPath = obj.demography.pages[0].page[1].tables[0].table[0].data[0].attribute[2].values[0];

        if (sqftPath.neighborhood && sqftPath.neighborhood[0].value[0]) {
          demographicsObj.sqft = sqftPath.neighborhood[0].value[0];
        } else if (sqftPath.city && sqftPath.city[0].value[0]) {
          demographicsObj.sqft = sqftPath.city[0].value[0];
        }
      }

      //----------------------------------------------------------------------------------------------
      // populating demographicsObj.income with ave year built for the neighborhood or city

      if (obj.demography.pages[0].page[1].tables[0].table[0].data[0].attribute[3] &&
      obj.demography.pages[0].page[1].tables[0].table[0].data[0].attribute[3].values &&
      obj.demography.pages[0].page[1].tables[0].table[0].data[0].attribute[3].values[0]){

        var yearBuiltPath = obj.demography.pages[0].page[1].tables[0].table[0].data[0].attribute[3].values[0];

        if (yearBuiltPath.neighborhood && yearBuiltPath.neighborhood[0].value[0]) {
          demographicsObj.yearBuilt = yearBuiltPath.neighborhood[0].value[0];
        } else if (yearBuiltPath.city && yearBuiltPath.city[0].value[0]) {
          demographicsObj.yearBuilt = yearBuiltPath.city[0].value[0];
        }
      }

      //console.log("demographicsObj", demographicsObj)

      //-----------------------------------------------------------------------------------------------
      // Back to your regularly scheduled code:





      //percentage of property owners (vs. renters)
      if (ownPath.neighborhood && ownPath.neighborhood[0] && ownPath.neighborhood[0].value && ownPath.neighborhood[0].value[0] && ownPath.neighborhood[0].value[0]._) {
        //console.log('own neighborhood');
        barChartObj.ownersTurf = Math.round(100*parseFloat(ownPath.neighborhood[0].value[0]._));
      } else if (ownPath.city && ownPath.city[0] && ownPath.city[0].value && ownPath.city[0].value[0] && ownPath.city[0].value[0]._) {
        //console.log('own city');
        barChartObj.ownersTurf = Math.round(100*parseFloat(ownPath.city[0].value[0]._));
      } else {
        //console.log('ownPath', ownPath);
        runOwn = false;
      }

      // verifying data for singles
      if (obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[1] &&
      obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[1].values &&
      obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[1].values[0] &&

      obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[2] &&
      obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[2].values &&
      obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[2].values[0]) {

        var menPath = obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[1].values[0];
        var womenPath = obj.demography.pages[0].page[2].tables[0].table[0].data[0].attribute[2].values[0];

        //console.log(menPath, womenPath);

        if (menPath.neighborhood && menPath.neighborhood[0] && menPath.neighborhood[0].value && menPath.neighborhood[0].value[0] && menPath.neighborhood[0].value[0]._ &&
        womenPath.neighborhood && womenPath.neighborhood[0] && womenPath.neighborhood[0].value && womenPath.neighborhood[0].value[0] && womenPath.neighborhood[0].value[0]._) {
          //console.log('singles neighborhood');
          barChartObj.singlesTurf = Math.round(100*(parseFloat(menPath.neighborhood[0].value[0]._) + parseFloat(womenPath.neighborhood[0].value[0]._)));
        } else if (menPath.city && menPath.city[0] && menPath.city[0].value && menPath.city[0].value[0] && menPath.city[0].value[0]._ &&
        womenPath.city && womenPath.city[0] && womenPath.city[0].value && womenPath.city[0].value[0] && womenPath.city[0].value[0]._) {
          //console.log('singles city');
          barChartObj.singlesTurf = Math.round(100*(parseFloat(menPath.city[0].value[0]._) + parseFloat(womenPath.city[0].value[0]._)));
        } else {
          //console.log('menPath', menPath);
          runSingles = false;
        }

      } else {
        runSingles = false;
      }

    } else {
      runKids = false;
      runOwn = false;
      runSingles = false;
    }

    if (runOwn || runKids || runSingles) {
      runDrawBar = true;
    }
    // console.log('barChartObj', barChartObj);

    if (runKids) {
      barChartArr[0].push(barChartObj.nationalHomesWithKids);
      barChartArr[1].push(barChartObj.homesWithKidsTurf);
    }

    if (runOwn) {
      barChartArr[0].push(barChartObj.nationalOwners);
      barChartArr[1].push(barChartObj.ownersTurf);
    }

    if (runSingles) {
      barChartArr[0].push(barChartObj.nationalSingles);
      barChartArr[1].push(barChartObj.singlesTurf);
    }
  };

  //----------------------------------------------------------------------------------
  // Draws the bar chart , only drawing columns when data is available for that subject.

  var drawBar = function() {
    runDrawBar = true; //remove this line when doing the API calls
    if (runDrawBar){
      $('#percentage-chart').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: barChartObj.name + ' Compared To Nation'
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
            //data: barChartArr[0],
            data: [50, 10, 60],
            pointPadding: 0,
            pointPlacement: 0
        }, {
            name: 'Neighborhood',
            color: '#5F327C',
            //data: barChartArr[1],
            data: [40, 20, 30],
            pointPadding: 0.2,
            pointPlacement: 0
        }]
      });
    }
  };


  //----------------------------------------------------------------------------------
  // Compiles, validates, and maps data for a pie chart of age distributions in each neighborhood from the Zillow Demography data

  var pieChartData = function(obj) {
    pieChartObj = {};
    runDrawPie = true;
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
      //console.log('pieChartData agePath', JSON.stringify(agePath));
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
      runDrawPie = true;
    }
    // console.log('runDrawPie', runDrawPie);
    // console.log('pieChartObj', JSON.stringify(pieChartObj));
  };

  //----------------------------------------------------------------------------------
  // Draws the Pie chart for age distribution in a given neighborhood


  var drawPie = function() {
    if (runDrawPie) {
      $('#pie-chart').highcharts({
          chart: {
              type: 'pie'
          },
          title: {
            text:   "Resident Age Distribution"
          },
          plotOptions: {
              pie: {
                  borderWidth: 2,
                  showInLegend: true,
                  dataLabels: {
                    enabled: false
                  }
              },

          },
          series: [{
            data: [
              // ['0-10 years old',    pieChartObj['0-10 years']],
              // ['10-20 years old',    pieChartObj['10-20 years']],
              // ['20-30 years old',    pieChartObj['20-30 years']],
              // ['30-40 years old',    pieChartObj['30-40 years']],
              // ['40-50 years old',    pieChartObj['40-50 years']],
              // ['50-60 years old',    pieChartObj['50-60 years']],
              // ['60-70 years old',    pieChartObj['60-70 years']],
              // ['70+ years old',    pieChartObj['70+ years']]

              // test data
              ['0-10 years old', 5],
              ['10-20 years old', 10],
              ['20-30 years old', 15],
              ['30-40 years old', 32],
              ['40-50 years old', 32],
              ['50-60 years old', 32],
              ['60-70 years old', 32],
              ['70+ years old', 32]
            ]
          }]
      });
    } else if (!runDrawPie && !runDrawBar) {
      $('#pie-chart').html('<div>No Charts Available</div>');
    }
  };

  return {
    drawBar: drawBar,
    drawPie: drawPie,
    barChartData: barChartData,
    pieChartData: pieChartData,
    demographicsObj: demographicsObj
  };

});
