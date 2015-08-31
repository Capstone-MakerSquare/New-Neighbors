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


//Handle a POST request
//api/getNeighbors
app.post('/api/getNeighbors', function (req, res) {
	console.log('server.js says: POST request received! Data:', req.body);

	var searchInfo = req.body;
	var glanceCards = [];
	var eventNumber = 0;

	var checkAndRespond = function () {
		if(eventNumber === 2) {
			res.send(200, "Data fetched.");
		}
	}

	zilpy(searchInfo)
	.then(function (zilpyData){
		console.log('Data from zilpy received. EventNumber:', ++eventNumber);
		checkAndRespond();
	})

	reverseGeocode(searchInfo)
	.then(function (geoCode) {
		console.log('Data from reverseGeocode received. EventNumber:', ++eventNumber);
		console.log('geoCode:', geoCode);
		return findNeighborhoods(geoCode);
	})
	.then(function (neighborhoodObj) {
		console.log('Neighborhood list:',neighborhoodObj);
		checkAndRespond();
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
	var key = keys.googleAPIKey;
	var types = 'locality|sublocality|neighborhood|sublocality_level_4|sublocality_level_3|sublocality_level_2|sublocality_level_1';

	var gPlacesUrl = gPlacesUrl_location + geoCode.coordinates.latitude + ',' + geoCode.coordinates.longitude +
									 gPlacesUrl_radius + radius +
									 gPlacesUrl_types + types +
									 gPlacesUrl_key + key;

	deferred.resolve(

		getRequest(gPlacesUrl)
		.then(function (responseObj) {
			var results = responseObj.results;
			_.each(results, function (result) {
				neighborhoodObj[result.name] = {
					latitude: result.geometry.location.lat,
					longitude: result.geometry.location.lng,
					placeId: result.place_id
				};
			});
			return neighborhoodObj;
		})

	);

	return deferred.promise;
}


//-----------------------------------------------------------------------------------
//GET Rent estimate High/Low
/*Prerequisites:
	Street Address, Bedrooms, Bathrooms
  Website: zilpy.com

  Input: searchInfo object
  Output: zilpyData object
*/

var zilpy = function (searchInfo) {
	var deferred = Q.defer();

	var zilpyUrl_address = 'http://api-stage.zilpy.com/property/-/rent/newreport?addr='
	var zilpyUrl_bedrooms = '&ptype=single_family_house&bdr='							//default to apartment_condos
	var zilpyUrl_bathrooms = '&ba=';

	var zilpyUrl = zilpyUrl_address + searchInfo.address + zilpyUrl_bedrooms + searchInfo.bedrooms + zilpyUrl_bathrooms + searchInfo.bathrooms;

	deferred.resolve(getRequest(zilpyUrl));
	return deferred.promise;
}
//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
//DETERMINE driving times and distances for multiple origins to a single destination
/*INPUT: originsArr: Array of origins as string name and/or latlong
           Eg. ['Mar Vista, CA', {lat: 34, lng: -118}]
      	 destination: Destination as string name or lat/long object as above
  OUTPUT: Array of objects for each origin:
  				Eg.
  				{
  				 		name: loremIpsum,
  				 		distance: 34,				//kilometers
  				 		time: 54						//minutes
  				}
*/

var createDistanceMatrix = function (originsArr, destination) {
  var deferred = Q.defer();

  var resultArr = [];
  var service = new google.maps.DistanceMatrixService;

  service.getDistanceMatrix({
    origins: originsArr,
    destinations: [destination],
    travelMode: google.maps.TravelMode.DRIVING,
  }, function(response, status) {
    if (status !== google.maps.DistanceMatrixStatus.OK) {
      console.log('Error was: ' + status);
    } else {
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
//GET latitude and longitude of an address, given the address
/*Prerequisites:
	Street Address
  Website: Google maps endpoint

  Input: searchInfo
  Output: [latitude, longitude]
*/

var reverseGeocode = function (searchInfo) {
	var deferred = Q.defer();

	var address = searchInfo.address;
	var gPlacesUrl_address = 'http://maps.googleapis.com/maps/api/geocode/json?address=';
	var gPlacesUrl_sensor = '&sensor=false';

	// console.log('server.js says: reverseGeocode called.');
	// console.log('address: ',address);
	// console.log('googleAPIKey: ',keys.googleAPIKey);

	var gPlacesUrl = gPlacesUrl_address + address + gPlacesUrl_sensor;

	deferred.resolve(
		getRequest(gPlacesUrl)
		.then(function (coordinatesObj) {
			console.log('coordinatesObj:', coordinatesObj);

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
	  if(error) { deferred.reject(error); }
	  if (!error && response.statusCode == 200) { deferred.resolve(JSON.parse(body)); }
	  else { deferred.resolve("Not Available"); }
	});

	return deferred.promise;
}
//-----------------------------------------------------------------------------------




module.exports = app;
