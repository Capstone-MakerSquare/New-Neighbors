var express = require('express');
var middleware = require('./config/middleware.js');
var http = require('http');
var Q = require('q');
var keys = require('./config/keys.js');
var request = require('request');
var _ = require('underscore');

app = express();
middleware(app,express);

app.use(express.static(__dirname + '/../client'));

//Global Variables
var userDestination;
var neighborhoods;

//Handle a POST request
//api/getNeighbors
app.post('/api/getNeighbors', function (req, res) {
	console.log('server.js says: POST request received! Data:', req.body);

	var searchInfo = req.body;
	var glanceCards = [];
	var eventNumber = 0;

	var checkAndRespond = function (neighborhoodObj) {
		if(eventNumber === 1) {
			res.status(200).send(neighborhoodObj);
		}
	}

	// zilpy(searchInfo)
	// .then(function (zilpyData){
	// 	console.log('Data from zilpy received. EventNumber:', ++eventNumber);
	// 	checkAndRespond();
	// })

	geoCode(searchInfo.address)
	.then(function (geoCode) {
		console.log('Data from geoCode received. EventNumber:', ++eventNumber);
		// console.log('geoCode:', geoCode);
		userDestination = geoCode;
		return findNeighborhoods(geoCode);
	})
	.then(function (neighborhoodObj) {
		console.log('Neighborhoods fetched.');
		// console.log('Neighborhood list:',neighborhoodObj);
		return getStreetAddresses(neighborhoodObj);
	})
	.then(function (neighborhoodObj) {
		console.log('Street addresses fetched.');
		return getDistances(neighborhoodObj);
	})
	.then(function (neighborhoodObj) {
		console.log('Distances fetched.');
		// console.log(neighborhoodObj);
		return getEstimates(neighborhoodObj, searchInfo);
	})
	.then(function (neighborhoodObj) {
		console.log('Rental Estimates fetched.');
		// console.log(neighborhoodObj);
		checkAndRespond(neighborhoodObj);
	});


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

  for(radius = 1000; radius<=20000; radius+=1000) {
		var gPlacesUrl = gPlacesUrl_location + geoCode.coordinates.latitude + ',' + geoCode.coordinates.longitude +
										 gPlacesUrl_radius + radius +
										 gPlacesUrl_types + types +
										 gPlacesUrl_key + key;

		getRequest(gPlacesUrl)
		.then(function (responseObj) {
			var results = responseObj.results;
			_.each(results, function (result) {
				neighborhoodObj[result.name] = neighborhoodObj[result.name] ||
				{
					latitude: result.geometry.location.lat,
					longitude: result.geometry.location.lng,
					placeId: result.place_id
				};
			});

			//remove
			// console.log('Neighborhoods fetched:',numResponses);

			if(numResponses === 20) { deferred.resolve(neighborhoodObj); }
			else { numResponses++; }
		});

	}//end of for loop

	return deferred.promise;
}



//-----------------------------------------------------------------------------------
//GET rental estimates from zilpy.com for a neighborhood object
/*Input: Object of neighborhoods
  Output: Rent estimate for each neighborhood augmented on the object
*/

var getEstimates = function (neighborhoodObj, searchInfo) {
	var deferred = Q.defer();

	var neighborhoodList = Object.keys(neighborhoodObj);
	var lastNeighborhood = neighborhoodList[neighborhoodList.length - 1];
	var numNeighborhoods = neighborhoodList.length;
	var numEvents = 0;

	for(var neighborhood in neighborhoodObj) {
		//console.log(neighborhoodObj[neighborhood]);
		var zilpySearchInfo = {
			address : neighborhoodObj[neighborhood].streetAddress,
			bedrooms : searchInfo.bedrooms,
			bathrooms : searchInfo.bathrooms
		}

		zilpy(zilpySearchInfo, neighborhood)
		.then(function (triplet) {
			//[rentEstimate, propertyType, neighborhood]
			var rentEstimate = triplet[0];
			var propertyType = triplet[1];
			var neighborhood = triplet[2];
			numEvents++;

			//remove
			//console.log(neighborhood);

			neighborhoodObj[neighborhood].rentEstimate = rentEstimate;
			neighborhoodObj[neighborhood].propertyType = propertyType;

			if(numEvents === numNeighborhoods) {
				//console.log('Resolved.');
				deferred.resolve(neighborhoodObj);
			}

		});
	}

	return deferred.promise;
}


//-----------------------------------------------------------------------------------
//GET Rent estimate High/Low
/*Prerequisites:
	Street Address, Bedrooms, Bathrooms
  Website: zilpy.com

  Input: searchInfo = {
					address:
					bedrooms:
					bathrooms:
  			}
  Output: zilpyData object
*/

var zilpy = function (searchInfo, neighborhood) {
	var deferred = Q.defer();

	/* Possible values for ptype:
			single_family_house
			apartment_condo
			town_house
	*/

	var zilpyUrl_address = 'http://api-stage.zilpy.com/property/-/rent/newreport?addr='
	var zilpyUrl_bedrooms = '&ptype=apartment_condo&bdr='							//default to apartment_condos
	var zilpyUrl_bathrooms = '&ba=';

	var zilpyUrl = zilpyUrl_address + searchInfo.address + zilpyUrl_bedrooms + searchInfo.bedrooms + zilpyUrl_bathrooms + searchInfo.bathrooms;

	getRequest(zilpyUrl)
	.then(function (zilpyData) {
		// console.log(neighborhood);
		// console.log('Zilpy Data:',zilpyData);
		deferred.resolve([zilpyData.estimate, zilpyData.subjectPropertyUserEntry.propertyType, neighborhood]);
	});

	return deferred.promise;
}


//-----------------------------------------------------------------------------------
//GET distances and commute time from each neighborhood to user destination
/* INPUT: neighborhood object
	 OUTPUT: neighborhood obj augmented with commute distance and time
*/
var getDistances = function (neighborhoodObj, transitMode) {
	var transitMode = transitMode || 'driving';
	var deferred = Q.defer();
  //remove
  // console.log('getDistances called.');

  //make an origins array
  var originsArr = [];
  var destination = '' + userDestination.coordinates.latitude + ',' +
  											 userDestination.coordinates.longitude;
  var index = 0;


  var gDrivingUrl_origins = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=';		//lat,lng|lat,lng|lat,lng
  var gDrivingUrl_destinations = '&destinations=';
  var gDrivingUrl_mode = '&units=imperial&mode=';
  var gDrivingUrl_key = '&key=';

  for (var neighborhood in neighborhoodObj) {
  	originsArr.push(neighborhoodObj[neighborhood].latitude + ',' + neighborhoodObj[neighborhood].longitude);
  }

  var origins = originsArr.join('|');

  //remove
  // console.log('origins:',origins);
  // console.log('destination', destination);

  var gDrivingUrl = gDrivingUrl_origins + origins +
  									gDrivingUrl_destinations + destination +
  									gDrivingUrl_mode + transitMode +
  									gDrivingUrl_key + keys.googleAPIKey;

  // remove
  // console.log('gDrivingUrl:', gDrivingUrl);

  getRequest(gDrivingUrl)
  .then(function (distancesObj) {
  	var distances = distancesObj.rows;

  	//remove
  	// console.log('Number of rows:',distances.length);

		for(var neighborhood in neighborhoodObj) {

			var distance = distances[index].elements[0].distance.text;
			var time = distances[index].elements[0].duration.text;

			distance = +distance.split(' ')[0];
			time = +time.split(' ')[0];

			//remove
			// console.log('Distance:',distance);
			// console.log('Time:',time);

			neighborhoodObj[neighborhood].commuteInfo = {
				commuteDistance : distance,
				commuteTime : time
			};

			index++;
		}

  	deferred.resolve(neighborhoodObj);
  });

	return deferred.promise;
}





//-----------------------------------------------------------------------------------
//DETERMINE driving times and distances for multiple origins to a single destination
/*INPUT: originsArr: Array of origins as string name and/or latlong
           Eg. ['Mar Vista, CA', {lat: 34, lng: -118}]
      	 destination: Destination as string name or lat/long object as above
  OUTPUT: Array of objects for each origin:
  				Eg.
  				{
  				 		name: loremIpsum,
  				 		distance: 34,				//miles
  				 		time: 54						//minutes
  				}
*/

var createDistanceMatrix = function (originsArr, destination) {

  var deferred = Q.defer();

  var resultArr = [];
  var service = new google.maps.DistanceMatrixService;

  //remove
  console.log('createDistanceMatrix called.');

  service.getDistanceMatrix({
    origins: originsArr,
    destinations: [destination],
    travelMode: google.maps.TravelMode.DRIVING,
  }, function(response, status) {
	    if (status !== google.maps.DistanceMatrixStatus.OK) {
	      console.log('Error was: ' + status);
	    }
	    else {
	      console.log(response)
	      var originList = response.originAddresses;
	      var destinationList = response.destinationAddresses;

	      for (var i = 0; i < originList.length; i++) {
	        var results = response.rows[i].elements;
	        for (var j = 0; j < results.length; j++) {
	          console.log("results i's ", results)
	          resultArr.push({name: originList[i], distance: results[j].distance.text, time: results[j].duration.text})
	        }
	      }
	    }
    	deferred.resolve(resultArr)
  	});
  return deferred.promise;
}


//-----------------------------------------------------------------------------------
//GET street addresses for each neighborhood
/*Input: neighborhoodObj
  Output: Extends each neighborhood in the object with a reference street address
*/
var getStreetAddresses = function (neighborhoodObj) {
	var deferred = Q.defer();

	//remove
	// console.log('List of neighborhoods');

	var neighborhoodList = Object.keys(neighborhoodObj);
	var lastNeighborhood = neighborhoodList[neighborhoodList.length - 1];
	var numNeighborhoods = neighborhoodList.length;
	var numEvents = 0;

	for(var neighborhood in neighborhoodObj) {
		//console.log(neighborhoodObj[neighborhood]);
		var coordinates = {
			latitude : neighborhoodObj[neighborhood].latitude,
			longitude : neighborhoodObj[neighborhood].longitude
		}
		reverseGeocode(coordinates, neighborhood)
		.then(function (tuple) {
			//[streetAddress, neighborhood]
			var streetAddress = tuple[0];
			var neighborhood = tuple[1];
			numEvents++;

			//remove
			// console.log(neighborhood);

			neighborhoodObj[neighborhood].streetAddress = streetAddress;

			if(numEvents === numNeighborhoods) {
				// console.log('Resolved.');
				deferred.resolve(neighborhoodObj);
			}

		});
	}

	//deferred.resolve('done');
	return deferred.promise;
}


//-----------------------------------------------------------------------------------
//GET latitude and longitude of an address, given the address
//Geocode
/*Prerequisites:
	Street Address
  Website: Google maps endpoint

  Input: address
  Output: geoCode = {
						latitude :
						longitude :
						place_id :
  				}
*/

var geoCode = function (address) {
	var deferred = Q.defer();

	var address = address;
	var gPlacesUrl_address = 'http://maps.googleapis.com/maps/api/geocode/json?address=';
	var gPlacesUrl_sensor = '&sensor=false';

	// console.log('server.js says: geoCode called.');
	// console.log('address: ',address);
	// console.log('googleAPIKey: ',keys.googleAPIKey);

	var gPlacesUrl = gPlacesUrl_address + address + gPlacesUrl_sensor;

	deferred.resolve(
		getRequest(gPlacesUrl)
		.then(function (coordinatesObj) {
			// console.log('coordinatesObj:', coordinatesObj);

			//Fetch the placeID, formatted address and the coordinates; make a minimal geoCode
			var results = coordinatesObj.results[0];
			var geoCode = {
				formattedAddress : results.formatted_address,
			  placeId : results.place_id,
			  coordinates : {
					latitude: results.geometry.location.lat,
					longitude: results.geometry.location.lng
				}
			};

			return geoCode;
		})
	);

	return deferred.promise;
}

//-----------------------------------------------------------------------------------
//GET the street address of a latitude/longitude pair
//Reverse Geocoding
/*
  Input: coordinates = {
						latitude :
						longitude :
  				}
  Output: Street address (string)
*/

var reverseGeocode = function (coordinates, neighborhood) {
	var deferred = Q.defer();

	var geocodeUrl_latlng = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
	var geocodeUrl_key = '&key=';

	var geocodeUrl = geocodeUrl_latlng + coordinates.latitude + ',' + coordinates.longitude + geocodeUrl_key + keys.googleAPIKey;

	getRequest(geocodeUrl)
	.then(function (streetAddress) {
		// console.log('streetAddress fetched.');
		// console.log('LatLng:',coordinates.latitude, coordinates.longitude);
		// console.log('Street Address:',streetAddress);

		deferred.resolve([streetAddress.results[0].formatted_address, neighborhood]);
	});

	return deferred.promise;
}

//-----------------------------------------------------------------------------------
//GET neighborhood list, given a particular latitude and longitude
/*Prerequisites:
	Street Address
  Website: Google places
*/

//-----------------------------------------------------------------------------------
//GET price of houses sold list, given a particular zip code
//example request: http://api.trulia.com/webservices.php?library=TruliaStats&function=getZipCodeStats&zipCode=90404&startDate=2014-01-01&endDate=2015-08-01&statType=listings&apikey=<INSERT API KEY HERE>
/*Prerequisites:
	zip code
  Website: Trulia

  TODO:
    change to real dates.
    parse the XML
*/
var trulia = function (zip) {
  var deferred = Q.defer();
  var truliaUrl_address = 'http://api.trulia.com/webservices.php?library=TruliaStats&function=getZipCodeStats&zipCode='
  var truliaUrl_start_date = '&startDate=2014-01-01'
  var truliaUrl_end_date = '&endDate=2015-08-01&statType=listings&apikey=';

  var truliaUrl = truliaUrl_address + zip + truliaUrl_start_date + truliaUrl_end_date + TruliaAPIKey;
  console.log('Sample URL for Trulia:', truliaUrl);

  http.get( truliaUrl, function (response) {
      var body = '';
      response.on('data', function (chunk) {
        body += chunk;
      });
      response.on('end', function () {
        //console.log('Trulia data - BODY: ' + body);
        deferred.resolve(body);
      });
  }); //end of http.get

  return deferred.promise;
}

//Helper functions
//-----------------------------------------------------------------------------------
//HTTP get request
var getRequest = function (url) {
	var deferred = Q.defer()

	//remove
	// console.log('getRequest called. url:',url);

	request(url, function (error, response, body) {
	  if(error) { console.log('Error for url:', url); deferred.resolve('Not Available'); }
	  if (!error && response.statusCode == 200) { deferred.resolve(JSON.parse(body)); }
	  else { deferred.resolve("Not Available"); }
	});

	return deferred.promise;
}
//-----------------------------------------------------------------------------------




module.exports = app;
