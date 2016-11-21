app.controller('MainController', ['Map', 'ServerApi', '$state', 'Details', 'Charts', '$anchorScroll', '$location', '$scope', '$timeout', function (Map, ServerApi, $state, Details, Charts, $anchorScroll, $location, $scope, $timeout){

  var main = this;
  main.picturesArr = [];
  main.isCollapsed = false;
  main.neighborhoodsObj = {}; //this is the response from the server

  main.searchInfo = {}; // JSON obj to send to server
  main.searchInfo.address = '';
  main.searchInfo.buyOrRent = 'rent';
  main.searchInfo.bedrooms = '1';
  main.searchInfo.bathrooms = '1';

  main.filter = {}; //object to collect filter specific information
  main.filter.maxRent = 8000;
  main.filter.commuteTime = 45;
  main.filter.commuteDistance = 30;

  main.filter.maxBuy = 5000000;

  main.filteredNeighborhoodArray = [];
  main.serverResponse = {};
  main.filterType = 'estimateLow';
  main.currentNeighborhood = { name: 'default' };
  main.loading = false;

  main.serviceObj = {};
  main.attractionObj = {};

  main.coordinates = {
      latitude: 38.5,
      longitude: -98.5
  };

  let apprxApartmentSqft = {  // http://www.rentcafe.com/blog/rental-market/us-average-apartment-size-trends-downward/ , etc.
    1: 750,
    2: 1100,
    3: 1300,
    4: 1500,
    5: 1700,
    8: 550,  // stand-in for studio
  }

  let rentEstimateLowFactor = 0.8;  // seems about right.  If an average 1-bedroom is 1500, a cheap one in the area might be 1200 & a super pricy one 2250
  let rentEstimateHighFactor = 1.5;

  main.priceRange = '';      //stores the current price range for the selected neighborhood
  main.buyPrice = {};

  //unscoped local variables
  var autocomplete;


  //----------------------------------------------------------------------------------
  // Function to aquire apartment price estimates by multiplying rent per sqft by typical size of apartments with given # of bedrooms
  // Input: apartment size, in bedroom # or studio, price to sqft ratio for that locale
  // Output: flattened array of objects
  let getApartmentPrice = function(size, PriceRatio) {
    return apprxApartmentSqft.size * PriceRatio;
  }

  //----------------------------------------------------------------------------------
  // Function to flatten the object so that the array can be sorted by a parameter
  // Input: neighborhoodsObj
  // Output: flattened array of objects
  main.formatPriceString = function (neighborhood) {
    let priceTitleObj = {
      title: main.buyPrice[neighborhood.name].housetype
    }

    if(main.searchInfo.buyOrRent === 'rent' && neighborhood.estimateLow != 'Not Available') {
      priceTitleObj.price = '$' + neighborhood.estimateLow.toLocaleString() + ' - ' + '$' + neighborhood.estimateHigh.toLocaleString();
    } else {
      priceTitleObj.price = (main.searchInfo.buyOrRent === 'buy') ? main.buyPrice[neighborhood.name].priceStr : 'Not Available';
    }
    return priceTitleObj;
  };

  main.orderPrice = function(hood) {
    if (hood.priceEstimate) {
      return main.buyPrice[hood.name].priceNum;
    }
  };

  main.orderByArray = function(neighborhoods){
    let arr = [];
    let highEst = 'Not Available';
    let lowEst = 'Not Available';
    for (var i = 0; i < neighborhoods.length; i++) {
      let hoodObj = {};
      if(neighborhoods[i].name==='Downtown') {
        neighborhoods[i].name = neighborhoods[i].name + ' ' + neighborhoods[i].city;
      }
      if (main.searchInfo.buyOrRent === 'rent' && neighborhoods[i].priceEstimate) {
        lowEst = neighborhoods[i].priceEstimate * apprxApartmentSqft[main.searchInfo.bedrooms] * rentEstimateLowFactor;
        highEst = neighborhoods[i].priceEstimate * apprxApartmentSqft[main.searchInfo.bedrooms] * rentEstimateHighFactor;
      }

      hoodObj = {
          name: neighborhoods[i].name,
          commuteTime: (neighborhoods[i].commuteInfo && neighborhoods[i].commuteInfo.commuteTime) ? neighborhoods[i].commuteInfo.commuteTime : 'Not Available',
          commuteDistance: (neighborhoods[i].commuteInfo && neighborhoods[i].commuteInfo.commuteDistance) ? neighborhoods[i].commuteInfo.commuteDistance : 'Not Available',
          estimateLow: lowEst,
          estimateHigh: highEst,
          googlePics: neighborhoods[i].googlePics,
          coordinates: {latitude: neighborhoods[i].latitude, longitude: neighborhoods[i].longitude},
          demography: neighborhoods[i].demographics,
      }
      hoodObj.priceString = main.formatPriceString(hoodObj);
      hoodObj.orderPrice = main.orderPrice(neighborhoods[i]);

      arr.push(hoodObj);
    }
    return arr;
  };

  //Function to format the purchase prices for homes
  main.formatBuyPrice  = function(hoodArr) {
    let priceData;
    let dataInfo;
    let temp = {};
    let heading = (main.searchInfo.buyOrRent === 'rent') ? 'Rent Per Month' : 'House Price';
    let dwelling = (main.searchInfo.buyOrRent === 'rent') ? 'Rental' : 'House';

    hoodArr.forEach(function(hood) {
      priceData = {};
      dataInfo = [,];
      temp = {
        housetype: heading + ' Estimate',
        priceNum: hood.priceEstimate || 4000000,
        priceStr: hood.priceEstimate ? '$' + hood.priceEstimate.toLocaleString() : 'Data Not Available',
      };

      if (main.searchInfo.buyOrRent === 'rent' && !hood.priceEstimate) {
        temp.priceNum = main.filter.maxRent;
      }

      if (main.searchInfo.bedrooms < 4) {
        temp.housetype = main.searchInfo.bedrooms + '-Bedroom ' + heading + ' Estimate';
      } else if (main.searchInfo.bedrooms === '5') {
        temp.housetype = '5+-Bedroom ' + heading + ' Estimate';
      } else if (main.searchInfo.bedrooms === '6') {
        temp.housetype = 'Median Sale Price';
      } else if (main.searchInfo.bedrooms === '7') {
        temp.housetype = 'Condominium Estimate';
      } else if (main.searchInfo.bedrooms === '8') {
        temp.housetype = 'Studio ' + heading  + ' Estimate';
      }
      main.buyPrice[hood.name] = temp;
    });
  }

//Function to format the purchase prices for homes
  // main.getBuyPrice  = function(arr) {
  //   var priceData;
  //   var dataInfo;
  //   var temp = {};
  //     temp.priceNum;
  //     temp.priceStr;
  //           //item.demography.pages[0].page[0].tables[0].table[0].data[0].attribute[3].values[0]
  //       ////.city[0].value[0]._
  //   arr.forEach( function(item) {
  //     priceData = {};
  //     dataInfo = [,];
  //     temp = {
  //       housetype: 'House Purchase Estimate',
  //       priceStr: 'Data Not Available',
  //       priceNum: 4000000
  //       };
  //     if (main.searchInfo.buyOrRent === 'rent') {
  //       temp.housetype = 'rent selected';
  //       temp.priceStr = 'rent selected';
  //     } else if (item.demographics &&
  //       item.demographics.pages &&
  //       item.demographics.pages[0] &&
  //       item.demographics.pages[0].page &&
  //       item.demographics.pages[0].page[0] &&
  //       item.demographics.pages[0].page[0].tables &&
  //       item.demographics.pages[0].page[0].tables[0] &&
  //       item.demographics.pages[0].page[0].tables[0].table &&
  //       item.demographics.pages[0].page[0].tables[0].table[0] &&
  //       item.demographics.pages[0].page[0].tables[0].table[0].data &&
  //       item.demographics.pages[0].page[0].tables[0].table[0].data[0] &&
  //       item.demographics.pages[0].page[0].tables[0].table[0].data[0].attribute) {

  //       priceData = item.demographics.pages[0].page[0].tables[0].table[0].data[0].attribute;

  //       dataInfo[1] = 'city';

  //       if (main.searchInfo.bedrooms === '2') {
  //         temp.housetype = '2-Bedroom Home';
  //         dataInfo[0] = 3
  //       } else if (main.searchInfo.bedrooms === '3') {
  //         temp.housetype = '3-Bedroom Home';
  //         dataInfo[0] = 4;
  //       } else if (main.searchInfo.bedrooms === '4') {
  //         temp.housetype = '4-Bedroom Home';
  //         dataInfo[0] = 5;
  //       } else if (main.searchInfo.buyOrRent === 'buy') {
  //         temp.housetype = 'Single Family Home';
  //         dataInfo[0] = 1;
  //       }
  //       if (priceData[dataInfo[0]] && priceData[dataInfo[0]].values && priceData[dataInfo[0]].values[0]) {
  //         if (priceData[dataInfo[0]].values[0].neighborhood) {
  //           dataInfo[1] = 'neighborhood';
  //         }
  //       }
  //       if (priceData[dataInfo[0]] &&
  //         priceData[dataInfo[0]].values &&
  //         priceData[dataInfo[0]].values[0] &&
  //         priceData[dataInfo[0]].values[0][dataInfo[1]] &&
  //         priceData[dataInfo[0]].values[0][dataInfo[1]][0] &&
  //         priceData[dataInfo[0]].values[0][dataInfo[1]][0].value &&
  //         priceData[dataInfo[0]].values[0][dataInfo[1]][0].value[0] &&
  //         priceData[dataInfo[0]].values[0][dataInfo[1]][0].value[0]._) {
  //           temp.priceNum = parseInt(priceData[dataInfo[0]].values[0][dataInfo[1]][0].value[0]._);
  //           temp.priceStr = '$' + temp.priceNum.toLocaleString();
  //       }
  //     }
  //     main.buyPrice[item.name] = temp;
  //   });
  // };

  //Function to set the selected type of housing to 'rent'
  main.setValueRent = function() {
    main.searchInfo.buyOrRent = 'rent';
  };

  //Function to set the selected type of housing to 'buy'
  main.setValueBuy = function() {
    main.searchInfo.buyOrRent = 'buy';
  };


  //----------------------------------------------------------------------------------
  //Function to set up autocomplete feature for the search field
  main.autoCompleteInit = function () {
    var input = document.getElementById('place-search');
    var options = { types: [] };   // Todo: limit to [geocode] per https://developers.google.com/maps/documentation/javascript/places-autocomplete ?
    autocomplete = new google.maps.places.Autocomplete(input, options);

    //listener to listen to a place change
    autocomplete.addListener('place_changed', function() {
      var place = autocomplete.getPlace();
      // console.log('mainCtrl.js says: Place changed. Place:',place);
      if(main.searchInfo.address.length > 0 || place.formatted_address) {
        main.searchInfo.address = place.formatted_address || main.searchInfo.address;
      }
    });
  };

  //----------------------------------------------------------------------------------
  //Function to fetch address and validate it
  main.submitAddress = function() {
    // $state.go('main.results');
    main.loading = true;
    main.filteredNeighborhoodArray = [];
    requestNeighborhoods();
    Map.panAndFocusDestination(main.searchInfo.address);
    Charts.clearCharts();
  };

  //Rerouters
  main.getResults = function() {
    $state.go('main.results');
  }
  main.gotoLanding = function() {
    $state.go('landing');
  }

  //----------------------------------------------------------------------------------
  // Function to make an API request for neighborhoods
  var requestNeighborhoods = function() {
    ServerApi.submit(main.searchInfo, "Neighbors")
    .then(function(data) {
      main.loading = false;
      main.serverResponse = data;
      main.neighborhoods = Object.keys(data).map(function(key) { return data[key]; });  //converts object of objects to array of objects

      //remove
      // console.log('requestNeighborhoods says: main.neighborhoods:',main.neighborhoods);

      main.attractionObj = Details.createPlacesObj(main.neighborhoods, Details.attractionDict);
      main.serviceObj = Details.createPlacesObj(main.neighborhoods, Details.serviceDict);

      //remove
      // console.log('requestNeighborhoods says: main.serviceObj:',main.serviceObj);
      
      main.formatBuyPrice(main.neighborhoods);

      main.neighborhoodArray = main.orderByArray(main.neighborhoods);
      main.filterNeighborhoods();

      main.markNeighborhoods();

      // remove
      // console.log("neighborhoodArray", main.neighborhoodArray)

      // turned off until fully implemented
      // let zipArr = Details.createZipArray(main.neighborhoodArray)
      // main.getDemography(zipArr);

    });
  };

  //----------------------------------------------------------------------------------
  // Function to filter neighborhoods by user's filter options
  main.filterNeighborhoods = function() {
    main.filteredNeighborhoodArray = main.neighborhoodArray.filter(function(obj) {
      return !(
        (main.searchInfo.buyOrRent === 'rent' && main.filter.maxRent < obj.estimateLow) ||
        (main.searchInfo.buyOrRent === 'buy' && main.filter.maxBuy < obj.orderPrice) ||
        (main.filter.communuteTime < obj.commuteTime) ||
        (main.filter.commuteDistance < obj.commuteDistance) );
    });
  };

  //----------------------------------------------------------------------------------
  // Function to filter neighborhoods by user's filter options
  main.markNeighborhoods = function() {
    for (var i = 0; i < main.neighborhoodArray.length; i++) {
      Details.neighborhoodMarkers.push(main.dropNeighborhoodMarker(main.neighborhoodArray[i].coordinates, main.neighborhoodArray[i].name, main.neighborhoodArray[i]));
    }
  };

  //----------------------------------------------------------------------------------
  //Drop a marker with a link to be clicked
  main.dropNeighborhoodMarker = function (coordinates, title, neighborhoodObj) {
    var icon = {
      url: "assets/images/Loading/housepurplewhite.png",
      size: new google.maps.Size(5.3*8, 13*8),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(10, 30),
      scaledSize: new google.maps.Size(5.3*4, 13*4)
    };

    var marker = Map.dropMarker(coordinates, title, title, icon, 'neighborhood')[0];


    marker.addListener('click', function() {
      console.log('neighborhood clicked:', neighborhoodObj);
      if(neighborhoodObj.name === main.currentNeighborhood.name) { return; }

      main.selectNeighborhood(neighborhoodObj)
      // console.log('neighborhoodObj:',neighborhoodObj);
      // console.log('main.currneigh:',main.currentNeighborhood);
    });

    return marker;
  };


  //----------------------------------------------------------------------------------
  // Function to get slow-responding Demography data from the server-->API
  main.getDemography = function(zipArr) {
    ServerApi.submit(zipArr, "Demography")
    .then(function(data) {
      main.mapDemography(data);
    });
  };


  //----------------------------------------------------------------------------------
  // Function to add Demography information back to the neighborhood Array
  main.mapDemography = function(demogArr) {
    // mark all in main
    for (let i=0;i<main.neighborhoodArray.length;i++) {
      for (let j=0;j<demogArr.length;j++) {
        if (demogArr[j].ZipCode == main.neighborhoodArray[i].zip) {
          main.neighborhoodArray[i].demography = demogArr[j];
        }
      }
    }
    //mark current
    Details.setDemography(demogArr)
  };


  //----------------------------------------------------------------------------------
  //Function to move the page

  main.goToAnchor = function(anchorId) {
    // set the location.hash to the id of
    // the element you wish to scroll to.
    $location.hash(anchorId);

    // call $anchorScroll()
    $anchorScroll();
  };

  //----------------------------------------------------------------------------------
  // Helper functions - GOOGLE MAPS

  //----------------------------------------------------------------------------------
  //Function to initialize and draw the map, centering on the the center of the U.S.
  main.initMap = function() {
    console.log("main.initMap")
    var centerUS = {
      latitude: 38.5,
      longitude: -96
    };
    //test coordinates
    Map.initialize(centerUS);
  };

  //----------------------------------------------------------------------------------
  //Function to add a marker on the map
  main.addMarker = function (coordinates, title) {
    title = 'Test marker' || title;
    Map.dropMarker(coordinates, title);
  };

  //----------------------------------------------------------------------------------
  //Function to test new methods defined in mapService
  //remove
  main.testMap = function() {
    console.log('mainCtrl.js says: testMap called');  //make the submit button work
    // Map.panAndFocus(main.coordinates);
    // Map.dropMarker(main.coordinates);
  };

  //----------------------------------------------------------------------------------
  //Function to map neighborhood data
  main.mapCurrentNeighborhood = function (neighborhood) {
    Details.currentNeighborhood = neighborhood;
    Details.currentNeighborhood.services = main.serviceObj[neighborhood.name];
    Details.currentNeighborhood.attractions = main.attractionObj[neighborhood.name];


    for (var service in Details.currentNeighborhood.services){
      var serviceArray = Details.currentNeighborhood.services[service];
      serviceArray.forEach(function(serviceSpot) {
        if(service === 'grocery_or_supermarket') { serviceSpot.displayName = 'grocery'; }
        else { serviceSpot.displayName = service.replace("_", " ");}
      });
    }

    for (var place in Details.currentNeighborhood.attractions){
      Details.currentNeighborhood.attractions[place][0].displayName = place.replace("_", " ");
    }

    //remove
    // console.log("mapCurrentNeighborhood says: Details.currentNeighborhood:", Details.currentNeighborhood);
  }

  //----------------------------------------------------------------------------------
  //Function to drop a circle + marker on a selected neighborhood
  main.selectNeighborhood = function (neighborhood) {
    // console.log('mainCtrl.js says: selected Neighborhood: ', neighborhood);
    main.populatePictures(neighborhood);
    main.mapCurrentNeighborhood(neighborhood);
    main.priceRange = neighborhood.priceString;
    main.currentNeighborhood = neighborhood;

    // console.log('select neigh bor hood current',  main.currentNeighborhood)

    //remove
    // console.log('selectNeighborhood says: main.serverResponse:',main.serverResponse);
    // console.log('selectNeighborhood', Details.currentNeighborhood);
    Charts.runData(neighborhood);
    // Charts.chartData(neighborhood);
    // Charts.pieChartData(neighborhood);
    // Charts.createStrings(neighborhood);

    // Todo: remove setTimeout.  Seriously, it's not even $Timeout.

    $state.go('main.results');
    setTimeout(function() {
      $state.go('main.details.services');

      Map.panAndFocus(neighborhood.coordinates, 13);
      Map.drawCircle(neighborhood.coordinates, 2000);
    }, 200)
  };

  //----------------------------------------------------------------------------------
  // googlePics map
  main.populatePictures = function(hood){
    main.picturesArr = [];
    if (!hood.googlePics) {
      console.log("No Pictures Found");
      main.picturesArr = [];   // Todo: insert default pic here.
      return;
    }
    hood.googlePics.forEach(function (obj) {
      main.picturesArr.push([obj.image, obj.userLink]);
    });
    // console.log('detailsController says: picturesArr:', main.picturesArr);
  }


  //----------------------------------------------------------------------------------
  // Initialization functions
  main.initialize = function() {
    Map.initialize();
    main.submitAddress();
  }

  main.autoCompleteInitialize = function() {
    setTimeout(main.autoCompleteInit,100);
  }

}]);











