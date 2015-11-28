angular.module('myApp.charts', [])

.controller('chartsController', ['$scope', 'Charts', function ($scope, Charts){

  var chart = this;
  //the display text for the Statistics view to the left of the bar chart
  chart.incomeString = 'Not Available';
  chart.sqftString = 'Not Available';
  chart.yearBuiltString = 'Not Available';

  //initializes it so that the pie and bar chart won't run unless there is information
  chart.barChart = false;
  chart.pieChart = false;

  chart.setStrings = function () {
    var demographicsObj = Charts.getDemographicsObj();
    if(Object.keys(demographicsObj).length > 0) {
      chart.incomeString = demographicsObj.incomeString || chart.incomeString;
      chart.sqftString = demographicsObj.sqftString || chart.sqftString;
      chart.yearBuiltString = demographicsObj.yearBuiltString || chart.yearBuiltString;
    }
  };

  chart.setFlags = function () {
    var tuple = Charts.getFlags();    //[barchart, piechart]
    if(tuple[0]) { chart.barChart = true; }
    if(tuple[1]) { chart.pieChart = true; }
  }

  var options = {
    useEasing:true,
    useGrouping: true,
    separator:',',
    decimal:'.',
    prefix:'',
    suffix:''
  }

  chart.countup = function() {
    var flags = [1,1,1];

    if(chart.incomeString === 'Not Available') { flags[0] = 0; }
    if(chart.sqftString === 'Not Available') { flags[1] = 0; }
    if(chart.yearBuiltString === 'Not Available') { flags[2] = 0; }

    setTimeout(function() {
      if(flags[0]) {
        var c1 = new CountUp('countup1', 0, parseInt(chart.incomeString), 0, 2.5, options);
        c1.start();
      }
      if(flags[1]) {
        var c2 = new CountUp('countup2', 0, parseInt(chart.sqftString), 0, 2.5, options);
        c2.start();
      }
      if(flags[2]) {
        var yearOption = options;
        yearOption.separator = '';
        var c3 = new CountUp('countup3', 0, parseInt(chart.yearBuiltString), 0, 2.5, yearOption);
        c3.start();
      }
    }, 20);
  }

}])

.factory('Charts', function () {

  var runDrawBar = false;
  var runDrawPie = false;
  var demographicsObj = {};
  var barChartObj = {};
  var pieChartObj = {};
  var barChartArr = [[],[]];


  //----------------------------------------------------------------------------------
  // Clears Chart data before new neighborhood searches
  var clearCharts = function() {
    runDrawBar = false;
    runDrawPie = false;
    demographicsObj = {};
    barChartObj = {};
    pieChartObj = {};
    barChartArr = [[],[]];
  }

  //----------------------------------------------------------------------------------
  // Compiles, validates, and maps data for a bar graph from the Zillow Demography data
  // Includes data for % of homes with children, % of owners (vs renters) and % of single people in each neighborhood

  var barChartData = function(obj) {
    //initializing data that is constant for all neighborhoods
    barChartObj = {nationalHomesWithKids: 31, nationalMedianHouseholdIncome: 44512, nationalOwners: 66, nationalSingles: 27};
    barChartArr = [[],[]];
    var runOwn = true;
    var runKids = true;
    var runSingles = true;
    runDrawBar = false;
    barChartObj.name = obj.name;

    //verifing data is coming from zillow setting up basePath
    if (obj &&
    obj.demography &&
    obj.demography.pages &&
    obj.demography.pages[0] &&
    obj.demography.pages[0].page) {
      var basePath = obj.demography.pages[0].page;

      //-----------------------------------------------------------------------------------------------
      //verifying data for homes with kids
      if (basePath[2] &&
      basePath[2].tables &&
      basePath[2].tables[0] &&
      basePath[2].tables[0].table &&
      basePath[2].tables[0].table[0] &&
      basePath[2].tables[0].table[0].data &&
      basePath[2].tables[0].table[0].data[0] &&
      basePath[2].tables[0].table[0].data[0].attribute &&
      basePath[2].tables[0].table[0].data[0].attribute[4] &&
      basePath[2].tables[0].table[0].data[0].attribute[4].values &&
      basePath[2].tables[0].table[0].data[0].attribute[4].values[0]) {
        var kidPath = basePath[2].tables[0].table[0].data[0].attribute[4].values[0];
        //if there is neighborhood specific data from zillow for that neighborhood
        if (kidPath.neighborhood && kidPath.neighborhood[0] && kidPath.neighborhood[0].value && kidPath.neighborhood[0].value[0]) {
          barChartObj.homesWithKidsTurf = Math.round(100*parseFloat(kidPath.neighborhood[0].value[0]._));
        //if not use that city data from zillow for that neighborhood
        } else if (kidPath.city && kidPath.city[0] && kidPath.city[0].value && kidPath.city[0].value[0]) {
          barChartObj.homesWithKidsTurf = Math.round(100*parseFloat(kidPath.city[0].value[0]._));
        } else {
        //if neither is available don't run that portion of the bar chart
          runKids = false;
        }
      }

      //-----------------------------------------------------------------------------------------------
      //verifying data for home owners
      if (basePath[1] &&
      basePath[1].tables &&
      basePath[1].tables[0] &&
      basePath[1].tables[0].table &&
      basePath[1].tables[0].table[0] &&
      basePath[1].tables[0].table[0].data &&
      basePath[1].tables[0].table[0].data[0] &&
      basePath[1].tables[0].table[0].data[0].attribute &&
      basePath[1].tables[0].table[0].data[0].attribute[0] &&
      basePath[1].tables[0].table[0].data[0].attribute[0].values &&
      basePath[1].tables[0].table[0].data[0].attribute[0].values[0]) {
        var ownPath = basePath[1].tables[0].table[0].data[0].attribute[0].values[0];
        //percentage of property owners (vs. renters)
        //if there is neighborhood specific data from zillow for that neighborhood, if not use city data
        if (ownPath.neighborhood && ownPath.neighborhood[0] && ownPath.neighborhood[0].value && ownPath.neighborhood[0].value[0] && ownPath.neighborhood[0].value[0]._) {
          barChartObj.ownersTurf = Math.round(100*parseFloat(ownPath.neighborhood[0].value[0]._));
        } else if (ownPath.city && ownPath.city[0] && ownPath.city[0].value && ownPath.city[0].value[0] && ownPath.city[0].value[0]._) {
          barChartObj.ownersTurf = Math.round(100*parseFloat(ownPath.city[0].value[0]._));
        } else {
          runOwn = false;
        }
      }

      //-----------------------------------------------------------------------------------------------
      // verifying data for singles
      // men
      if (basePath[2].tables[0].table[0].data[0].attribute[1] &&
      basePath[2].tables[0].table[0].data[0].attribute[1].values &&
      basePath[2].tables[0].table[0].data[0].attribute[1].values[0] &&
      //women
      basePath[2].tables[0].table[0].data[0].attribute[2] &&
      basePath[2].tables[0].table[0].data[0].attribute[2].values &&
      basePath[2].tables[0].table[0].data[0].attribute[2].values[0]) {

        var menPath = basePath[2].tables[0].table[0].data[0].attribute[1].values[0];
        var womenPath = basePath[2].tables[0].table[0].data[0].attribute[2].values[0];

        //if there is neighborhood specific data from zillow for that neighborhood, if not use city data
        if (menPath.neighborhood && menPath.neighborhood[0] && menPath.neighborhood[0].value && menPath.neighborhood[0].value[0] && menPath.neighborhood[0].value[0]._ &&
        womenPath.neighborhood && womenPath.neighborhood[0] && womenPath.neighborhood[0].value && womenPath.neighborhood[0].value[0] && womenPath.neighborhood[0].value[0]._) {
          barChartObj.singlesTurf = Math.round(100*(parseFloat(menPath.neighborhood[0].value[0]._) + parseFloat(womenPath.neighborhood[0].value[0]._)));
        } else if (menPath.city && menPath.city[0] && menPath.city[0].value && menPath.city[0].value[0] && menPath.city[0].value[0]._ &&
        womenPath.city && womenPath.city[0] && womenPath.city[0].value && womenPath.city[0].value[0] && womenPath.city[0].value[0]._) {
          barChartObj.singlesTurf = Math.round(100*(parseFloat(menPath.city[0].value[0]._) + parseFloat(womenPath.city[0].value[0]._)));
        } else {
          runSingles = false;
        }
      }

      //----------------------------------------------------------------------------------------------
      // populating demographicsObj.income with median household income from zillow

      if (basePath[2].tables[0].table[0].data[0].attribute[0] &&
      basePath[2].tables[0].table[0].data[0].attribute[0].values &&
      basePath[2].tables[0].table[0].data[0].attribute[0].values[0]) {
        var incomePath = basePath[2].tables[0].table[0].data[0].attribute[0].values[0];

      //if there is neighborhood specific data from zillow for that neighborhood, if not use city data
        if (incomePath.neighborhood && incomePath.neighborhood[0].value && incomePath.neighborhood[0].value[0]) {
          demographicsObj.income = incomePath.neighborhood[0].value[0]._;
        } else if (incomePath.city && incomePath.city[0].value && incomePath.city[0].value[0]) {
          demographicsObj.income = incomePath.city[0].value[0]._;
        }
      }

      //----------------------------------------------------------------------------------------------
      // populating demographicsObj.income with ave square foot size of houses for the neighborhood or city

      if (basePath[1].tables[0].table[0].data[0].attribute[2] &&
      basePath[1].tables[0].table[0].data[0].attribute[2].values &&
      basePath[1].tables[0].table[0].data[0].attribute[2].values[0] ){
        var sqftPath = basePath[1].tables[0].table[0].data[0].attribute[2].values[0];
        //if there is neighborhood specific data from zillow for that neighborhood, if not use city data
        if (sqftPath.neighborhood && sqftPath.neighborhood[0].value[0]) {
          demographicsObj.sqft = sqftPath.neighborhood[0].value[0];
        } else if (sqftPath.city && sqftPath.city[0].value[0]) {
          demographicsObj.sqft = sqftPath.city[0].value[0];
        }
      }

      //----------------------------------------------------------------------------------------------
      // populating demographicsObj.income with ave year built for the neighborhood or city

      if (basePath[1].tables[0].table[0].data[0].attribute[3] &&
      basePath[1].tables[0].table[0].data[0].attribute[3].values &&
      basePath[1].tables[0].table[0].data[0].attribute[3].values[0]){
        var yearBuiltPath = basePath[1].tables[0].table[0].data[0].attribute[3].values[0];
        //if there is neighborhood specific data from zillow for that neighborhood, if not use city data
        if (yearBuiltPath.neighborhood && yearBuiltPath.neighborhood[0].value[0]) {
          demographicsObj.yearBuilt = yearBuiltPath.neighborhood[0].value[0];
        } else if (yearBuiltPath.city && yearBuiltPath.city[0].value[0]) {
          demographicsObj.yearBuilt = yearBuiltPath.city[0].value[0];
        }
      }

    //if none of the basePath is coming in, none of the bar charts should run
    } else {
      runKids = false;
      runOwn = false;
      runSingles = false;
    }
    //if at least one of the charts has the information to run, run the chart
    if (runOwn || runKids || runSingles) {
      runDrawBar = true;
    }

    //sets up the bar chart data in the array format that draws the bar chart
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
    // runDrawBar = true; //remove this line when doing the API calls see **
    if (runDrawBar){
      $('#percentage-chart').highcharts({
        chart: {
            type: 'column'
        },
        exporting: { enabled: false },
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
            color: '#CAE0A8',
            data: barChartArr[0],
            // data: [50, 10, 60], //**comment this in and uncomment the previous line to not do API calls
            pointPadding: 0,
            pointPlacement: 0
        }, {
            name: 'Neighborhood',
            color: '#3878C7',
            data: barChartArr[1],
            // data: [40, 20, 30], //**comment this in and uncomment the previous line to not do API calls
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
    runDrawPie = false;
    //verifying information is coming in from zillow
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

      //checks each age range for data from zillow
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
    }
    //only draws the pie chart if each age range has a value
    if (pieChartObj['0-10 years'] && pieChartObj['10-20 years'] && pieChartObj['20-30 years'] && pieChartObj['30-40 years'] &&
        pieChartObj['40-50 years'] && pieChartObj['50-60 years'] && pieChartObj['60-70 years'] && pieChartObj['70+ years']) {
        runDrawPie = true;
    }
  };

  //----------------------------------------------------------------------------------
  // Draws the Pie chart for age distribution in a given neighborhood


  var drawPie = function() {
    //runDrawPie = true; //uncomment this for testing without calling the APIs see **
    if (runDrawPie) {

      Highcharts.setOptions({
       colors: ['#FA9E25','#A5AAD9', '#FFC735', '#FF7D70', '#CAE0A8', '#5F347C', '#B2D0FF', '#3878C7'],
        chart: {
          style: {
            fontFamily: 'AvenirNextPro'
         }
        }
      });

      $('#pie-chart').highcharts({
          chart: {
              type: 'pie'
          },
          title: {
            text:   "Resident Age Distribution"
          },
          exporting: { enabled: false },
          plotOptions: {
              pie: {
                  borderWidth: 2,
                  //uncomment to remove the line labels and just use the pie chart legend
                  // showInLegend: true,
                  // dataLabels: {
                  //   enabled: false
                  // }
              },

          },
          series: [{
            data: [
              ['0-10 years old',    pieChartObj['0-10 years']],
              ['10-20 years old',    pieChartObj['10-20 years']],
              ['20-30 years old',    pieChartObj['20-30 years']],
              ['30-40 years old',    pieChartObj['30-40 years']],
              ['40-50 years old',    pieChartObj['40-50 years']],
              ['50-60 years old',    pieChartObj['50-60 years']],
              ['60-70 years old',    pieChartObj['60-70 years']],
              ['70+ years old',    pieChartObj['70+ years']]

              //**test data comment back in and remove preceeding section
              // ['0-10 years old', 5],
              // ['10-20 years old', 10],
              // ['20-30 years old', 15],
              // ['30-40 years old', 32],
              // ['40-50 years old', 32],
              // ['50-60 years old', 32],
              // ['60-70 years old', 32],
              // ['70+ years old', 32]
            ]
          }]
      });
    }
  };

  var createStrings = function () {
    if (!!demographicsObj.income) {
      demographicsObj.incomeString = parseInt(demographicsObj.income);
    }
    if (!!demographicsObj.sqft) {
      demographicsObj.sqftString = parseInt(demographicsObj.sqft);
    }
    if (!!demographicsObj.yearBuilt) {
      demographicsObj.yearBuiltString = demographicsObj.yearBuilt;
    }
  };

  var getDemographicsObj = function () {
    return demographicsObj;
  }

  var getFlags = function () {
    return [runDrawBar, runDrawPie];
  }

  return {
    drawBar: drawBar,
    drawPie: drawPie,
    barChartData: barChartData,
    pieChartData: pieChartData,
    getDemographicsObj: getDemographicsObj,
    demographicsObj: demographicsObj,
    clearCharts: clearCharts,
    createStrings: createStrings,
    getFlags: getFlags
  };

});
