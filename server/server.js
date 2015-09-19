var express = require('express');
var middleware = require('./config/middleware.js');
var http = require('http');
var Q = require('q');
// var keys = require('./config/keys.js');
var request = require('request');
var _ = require('underscore');
var parseString = require('xml2js').parseString;

//Helpers
var getRequest = require('./helpers/getRequest.js');
var getXmlRequest = require('./helpers/getXmlRequest.js');
var geoCode = require('./helpers/geoCode.js');
var reverseGeocode = require('./helpers/reverseGeocode.js');
var getDistances = require('./helpers/getDistances.js');
var getInstagram = require('./helpers/getInstagram.js');
var queryAmenitiesAndAttractions = require('./helpers/queryAmenitiesAndAttractions.js');
var zilpy = require('./helpers/zilpy.js');
var zillow = require('./helpers/zillow.js');

app = express();
middleware(app,express);

//Global Variables
var userDestination;
var neighborhoods;
var country;
var searchInfo;

var neighborhoodObject = {};
var neighborhoods;
var numNeighborhoods;
var keys = {
  googleAPIKey: process.env.GOOGLE_KEY,
  zwsId: process.env.ZILLOW_KEY,
  instagramAccessToken: process.env.INSTAGRAM_KEY
}

//Handle a POST request
//api/getNeighbors
app.post('/api/getNeighbors', function (req, res) {
	console.log('server.js says: POST request received! Data:', req.body);

	searchInfo = req.body;
	var glanceCards = [];
	var eventNumber = 0;

	var checkAndRespond = function (neighborhoodObj, force) {
    eventNumber++;
    if(eventNumber === 2 || force) {
      res.status(200).send(neighborhoodObj);
    }
	}

	geoCode(searchInfo.address)
	.then(
    function (geoCode) {
      // console.log('Geocode received:', geoCode);
  		userDestination = geoCode;
  		return findNeighborhoods(geoCode);
	  },
    function (errorMessage) {
      checkAndRespond({}, true);
    })

  .then(function (neighborhoodObj) {
    neighborhoodObject = neighborhoodObj;
    neighborhoods = Object.keys(neighborhoodObj);
    numNeighborhoods = neighborhoods.length;
    //remove
    console.log('Number of neighborhoods:', numNeighborhoods);
    console.log('neighborhoods:',neighborhoods);

    if(numNeighborhoods === 0) { checkAndRespond({}, true); return; }

    var numNeighborhoodsCompleted = 0;

    //Async sequence 1
    getDistances(neighborhoodObject, 'driving', userDestination)
    .then(function (commuteObj) {
      console.log('Distances fetched.');
      _.each(commuteObj, function (commuteInfo, neighborhood) {
        neighborhoodObject[neighborhood].commuteInfo = commuteInfo;
      });
      checkAndRespond(neighborhoodObject, false);
    })

    //Async sequence 2
    for(var neighborhood in neighborhoodObject) {
      Q.all([
          getStreetAddress(neighborhood)
          .then(function (neighborhood) {
            if(neighborhoodObject[neighborhood].country === 'USA') {
              return Q.all([
                getRentEstimate(neighborhood),
                getDemography(neighborhood)
              ]);
            }
            else { return 'Other Country'; }
          })
          ,
          getAmenitiesAndAttractions(neighborhood),
          getPictures(neighborhood)
        ])
      .then(function (resultArray) {
        numNeighborhoodsCompleted++;
        console.log('numNeighborhoodsCompleted:',numNeighborhoodsCompleted);
        console.log(resultArray);
        if(numNeighborhoodsCompleted >= 0.8 * numNeighborhoods) { checkAndRespond(neighborhoodObject, false); }
      });
    } //end of for loop

  });

//-----------------------------------------------------------------------------------
  var getStreetAddress = function (neighborhood) {
    var deferred = Q.defer();
    var coordinates = {
      latitude : neighborhoodObject[neighborhood].latitude,
      longitude : neighborhoodObject[neighborhood].longitude
    };
    reverseGeocode(coordinates)
    .then(function (addressObj) {
      neighborhoodObject[neighborhood].streetAddress = addressObj.formatted_address;
      if(addressObj.country === 'USA') { _.extend(neighborhoodObject[neighborhood], addressObj); }
      // console.log(neighborhood + ':Street address fetched.');
      deferred.resolve(neighborhood);
    });
    return deferred.promise;
  }
//-----------------------------------------------------------------------------------
  var getAmenitiesAndAttractions = function (neighborhood) {
    var deferred = Q.defer();
    var coordinates = {
      latitude : neighborhoodObject[neighborhood].latitude,
      longitude : neighborhoodObject[neighborhood].longitude
    };
    queryAmenitiesAndAttractions(coordinates)
    .then(function (amenitiesObj) {
      neighborhoodObject[neighborhood].amenities_attractions = amenitiesObj;
      deferred.resolve(neighborhood + ':Amenities fetched.');
    });
    return deferred.promise;
  }
//-----------------------------------------------------------------------------------
  var getPictures = function (neighborhood) {
    var deferred = Q.defer();
    var coordinates = {
      latitude : neighborhoodObject[neighborhood].latitude,
      longitude : neighborhoodObject[neighborhood].longitude
    };
    getInstagram(coordinates)
    .then(function (imagesArray) {
      neighborhoodObject[neighborhood].instagram = imagesArray;
      deferred.resolve(neighborhood + ':Instagram pictures fetched.');
    });
    return deferred.promise;
  }
//-----------------------------------------------------------------------------------
  var getRentEstimate = function (neighborhood) {
    var deferred = Q.defer();
    var zilpySearchInfo = {
      address : neighborhoodObject[neighborhood].streetAddress,
      bedrooms : searchInfo.bedrooms,
      bathrooms : searchInfo.bathrooms
    }
    zilpy(zilpySearchInfo)
    .then(function (tuple) {
      //estimate, property_type
      neighborhoodObject[neighborhood].rentEstimate = tuple[0];
      neighborhoodObject[neighborhood].propertyType = tuple[1];
      deferred.resolve(neighborhood + ':Rent Estimate fetched.');
    });
    return deferred.promise;
  }
//-----------------------------------------------------------------------------------
  var getDemography = function (neighborhood) {
    var deferred = Q.defer();
    zillow(neighborhood, neighborhoodObject[neighborhood].city)
    .then(function (demographyObj) {
      neighborhoodObject[neighborhood].demographics = demographyObj;
      deferred.resolve(neighborhood + ':Demography info fetched.');
    });
    return deferred.promise;
  }

});	//end of POST request handler

//-----------------------------------------------------------------------------------
//GET list of neighborhood localities for a pair of coordinates (corresponding to the given street address)
/*Input: coordinates
  Output: Object of neighborhoods
*/

var findNeighborhoods = function (geoCode) {
	var deferred = Q.defer();

	var gPlacesUrl_location = 'https://maps.googleapis.com/maps/api/place/search/json?location=';			//latitude + ',' + longitude
	var gPlacesUrl_radius = '&radius=';
	var gPlacesUrl_types = '&types=';
	var gPlacesUrl_key = 'l&key=';

	var neighborhoodObj = {};
	var radius = 1000;
	var numResponses = 1;
	var key = keys.googleAPIKey;
	var types = 'locality|sublocality|neighborhood|administrative_area_level_1|administrative_area_level_2|administrative_area_level_3|administrative_area_level_4|administrative_area_level_5|sublocality_level_4|sublocality_level_3|sublocality_level_2|sublocality_level_1';

  for(radius = 1000; radius<=20000; radius+=500) {
		var gPlacesUrl = gPlacesUrl_location + geoCode.coordinates.latitude + ',' + geoCode.coordinates.longitude +
										 gPlacesUrl_radius + radius +
										 gPlacesUrl_types + types +
										 gPlacesUrl_key + key;

    //remove
    // console.log('gPlaces:', gPlacesUrl);

		getRequest(gPlacesUrl)
		.then(function (responseObj) {
			var results = responseObj.results;

      //remove
      // console.log('Neighborhood object:', results);

			_.each(results, function (result) {
				neighborhoodObj[result.name] = neighborhoodObj[result.name] ||
				{
          name: result.name,
					latitude: result.geometry.location.lat,
					longitude: result.geometry.location.lng,
					placeId: result.place_id
				};
			});

			//remove
			// console.log('Neighborhoods fetched:',numResponses);

			if(numResponses === 39) { deferred.resolve(neighborhoodObj); }
			else { numResponses++; }
		},

    function (errorMessage) {
      // console.log('Error/server not responding.');
      // console.log('errorMessage:', errorMessage);

      if(numResponses === 39) { deferred.resolve(neighborhoodObj); }
      else { numResponses++; }
    });

	}//end of for loop

	return deferred.promise;
}

module.exports = app;






















