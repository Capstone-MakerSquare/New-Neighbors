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
      chart.ageString = demographicsObj.ageString || chart.ageString;
      chart.householdPopString = demographicsObj.householdPopString || chart.householdPopString;
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

// ********************************************************************************  //
// ********************************************************************************  //


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

  let runData = function(neighborhood){
    chartData(neighborhood);
    pieChartData(neighborhood);
    createStrings(neighborhood);
  }

  //----------------------------------------------------------------------------------
  // Compiles, validates, and maps data for a bar graph from the GeoData Demography data
  // Includes data for % of homes with children
  let childData = function(demogObj, name) {

    if (!demogObj.OccupiedHousingUnits || !demogObj.HouseholdsWithIndividualsUnder18) {
      consle.log("No child data in ", name);
      return;
    }

    barChartObj.nationalHomesWithKids = 31;  // U.S. national data, 2010

    barChartObj.homesWithKids = Math.round(100 * demogObj.HouseholdsWithIndividualsUnder18 / demogObj.OccupiedHousingUnits); 

    barChartArr[0].push(barChartObj.nationalHomesWithKids);
    barChartArr[1].push(barChartObj.homesWithKids);

    runDrawBar = true;
    // console.log("kid ratio:", barChartObj.homesWithKids);

  }

  //----------------------------------------------------------------------------------
  // Compiles, validates, and maps data for a bar graph from the GeoData Demography data
  // Includes data for median household income;
  let incomeData = function(demogObj, name) {

    if (!demogObj.IncomePerHousehold) {
      consle.log("No median age data in ", name);
      return;
    }

    demographicsObj.income = demogObj.IncomePerHousehold
  }


  //----------------------------------------------------------------------------------
  // Compiles, validates, and maps data for a bar graph from the GeoData Demography data
  // Includes data for median age;
  let ageData = function(demogObj, name) {

    if (!demogObj.MedianAge) {
      consle.log("No median age data in ", name);
      return;
    }

    demographicsObj.age = demogObj.MedianAge;
  }

  //----------------------------------------------------------------------------------
  // Compiles, validates, and maps data for a bar graph from the GeoData Demography data
  // Includes data for median age;
  let housePopulationData = function(demogObj, name) {

    if (!demogObj.PersonsPerHousehold) {
      consle.log("No household population data in ", name);
      return;
    }

    demographicsObj.householdPop = demogObj.PersonsPerHousehold;
  }

  //----------------------------------------------------------------------------------
  // Compiles, validates, and maps data for a bar graph from the GeoData Demography data
  // Includes data for college graduation;
  let bachelorData = function(demogObj, name) {

    if (!demogObj.EducationBachelorOrGreater) {
      consle.log("No Education data in ", name);
      return;
    }

    barChartObj.bachelorDegree = Math.round(100 * demogObj.EducationBachelorOrGreater);

    barChartArr[0].push(barChartObj.nationalBachelorDegree);
    barChartArr[1].push(barChartObj.bachelorDegree);

    runDrawBar = true;
  }

  //----------------------------------------------------------------------------------
  // Compiles, validates, and maps data for a bar graph from the GeoData Demography data
  // Includes data for household family composition;
  let nonFamilyData = function(demogObj, name) {

    if (!demogObj.NonFamilyHouseholds || !demogObj.OccupiedHousingUnits) {
      consle.log("No household data in ", name);
      return;
    }

    barChartObj.nonFamilyHouseholds = Math.round(100 * demogObj.NonFamilyHouseholds / demogObj.OccupiedHousingUnits);

    barChartArr[0].push(barChartObj.nationalNonFamilyHouseholds);
    barChartArr[1].push(barChartObj.nonFamilyHouseholds);

    runDrawBar = true;

  }

  //----------------------------------------------------------------------------------
  // Compiles, validates, and maps data for a bar graph from the Zillow Demography data
  // Includes data for % of homes with children, % of owners (vs renters) and % of single people in each neighborhood

  var chartData = function(obj) {
    runDrawBar = false;
    barChartArr = [[],[]];

    //initializing data that is constant for all neighborhoods
    barChartObj = {
      name: obj.name,
      nationalHomesWithKids: 31, // %
      nationalMedianHouseholdIncome: 44512,  //$
      natinalPersonsPerHousehold: 2.58,  //people
      nationalMedianAge: 37.2,  // years
      nationalBachelorDegree: 33, // %
      nationalNonFamilyHouseholds: 34// %, 39,177,996/116,716,292
    };  // U.S. national data, 2010

    if (obj.demography) {
      childData(obj.demography, obj.name);
      ageData(obj.demography, obj.name);
      bachelorData(obj.demography, obj.name);
      incomeData(obj.demography, obj.name);
      housePopulationData(obj.demography, obj.name);
      nonFamilyData(obj.demography, obj.name)
      // console.log("Finished data mapping")
    }
    return; 
  };

  //----------------------------------------------------------------------------------
  // Draws the bar chart , only drawing columns when data is available for that subject.

  var drawBar = function() {
    // runDrawBar = true; //remove this line when doing the API calls see **
    // console.log("barChartArr", barChartArr)
    // console.log("barChartObj", barChartObj)
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
                "Adults with Bachelor's Degrees",
                'Non-Family Households'
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
            name: barChartObj.name,
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

    if (!obj.demography) {
      console.log("no Demography for", obj.name);
      return;
    }

    let demo = obj.demography;
    let totalPopulation = demo.Population;

    // doesn't really help
    // let partToPercent = function(parts) {
    //   return Math.round(100 / totalPopulation * parts.reduce(function(a,b) { return a+b; }));
    // }


    pieChartObj['10-19 years'] = Math.round(100 * (demo.Population10to14 + demo.Population15to19)/totalPopulation);
    pieChartObj['20-29 years'] = Math.round(100 * (demo.Population20to24 + demo.Population25to29)/totalPopulation);
    pieChartObj['30-39 years'] = Math.round(100 * (demo.Population30to34 + demo.Population35to39)/totalPopulation);
    pieChartObj['40-54 years'] = Math.round(100 * (demo.Population40to44 + demo.Population45to49 + demo.Population50to54)/totalPopulation);
    pieChartObj['55-69 years'] = Math.round(100 * (demo.Population55to59 + demo.Population60to64 + demo.Population65to69)/totalPopulation);
    pieChartObj['70+ years'] =  Math.round(100 * (demo.Population70to74 + demo.Population75to79 + demo.Population80to84 + demo.Population85Plus)/totalPopulation);
    pieChartObj['0-9 years'] = 100 - (pieChartObj['10-19 years'] + pieChartObj['20-29 years'] + pieChartObj['30-39 years'] + pieChartObj['40-54 years'] + pieChartObj['55-69 years'] + pieChartObj['70+ years'])


    //basic test to throw out chart if something went horribly wrong with the data set; cannot be true anywhere real
    if (pieChartObj['0-9 years'] < 50) {
      runDrawPie = true;
    }

    //only draws the pie chart if each age range has a value, but not a great test if one data point is bad.
    // if (pieChartObj['0-9 years'] && pieChartObj['10-19 years'] && pieChartObj['20-29 years'] && pieChartObj['30-39 years'] &&
    //       pieChartObj['40-54 years'] && pieChartObj['55-69 years'] && pieChartObj['70+ years']) {
    //     runDrawPie = true;
    // }

    // console.log(runDrawPie, "pieChartObj", pieChartObj);

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
              type: 'pie',
              spacingTop: 0
          },
          title: {
            text:   "Resident Age Distribution"
          },
          exporting: { enabled: false },
          tooltip: {
            pointFormat: '<b>{point.percentage:.0f}%</b>'
          },
          plotOptions: {
              pie: {
                  borderWidth: 2,
                  dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.0f}%'
                  }

                  //uncomment to remove the line labels and just use the pie chart legend
                  // showInLegend: true,
                  // dataLabels: {
                  //   enabled: false
                  // }
              },

          },
          series: [{
            name: 'Distribution',
            data: [
              ['0-9 years old',    pieChartObj['0-9 years']],
              ['10-19 years old',    pieChartObj['10-19 years']],
              ['20-29 years old',    pieChartObj['20-29 years']],
              ['30-39 years old',    pieChartObj['30-39 years']],
              ['40-54 years old',    pieChartObj['40-54 years']],
              ['55-69 years old',    pieChartObj['55-69 years']],
              ['70+ years old',    pieChartObj['70+ years']]
            ]
          }]
      });
    }
  };

  var createStrings = function () {
    if (!!demographicsObj.income) {
      demographicsObj.incomeString = parseInt(demographicsObj.income);
    }
    if (!!demographicsObj.age) {
      demographicsObj.ageString = parseInt(demographicsObj.age);
    }
    if (!!demographicsObj.householdPop) {
      demographicsObj.householdPopString = demographicsObj.householdPop.toString();
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
    runData: runData,
    // chartData: chartData,
    // pieChartData: pieChartData,
    // createStrings: createStrings,
    getDemographicsObj: getDemographicsObj,
    demographicsObj: demographicsObj,
    clearCharts: clearCharts,
    getFlags: getFlags
  };

});
