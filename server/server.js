var express = require('express');
var middleware = require('./config/middleware.js');
var http = require('http');
var Q = require('q');
var keys = require('./config/keys.js');

app = express();
middleware(app,express);

app.use(express.static(__dirname + '/../client'));


//Handle a POST request
//api/getNeighbors
app.post('/api/getNeighbors', function (req, res) {
	console.log('server.js says: POST request received! Data:', req.body);
	var searchInfo = req.body;
	var glanceCards = [];

	zilpy(searchInfo)
	.then(function (zilpyData){
		res.send(200, zilpyData);
	})
	.then(function () {
		reverseGeocode(searchInfo);
	});
});


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
	var zilpyUrl_bedrooms = '&ptype=single_family_house&bdr='
	var zilpyUrl_bathrooms = '&ba=';

	var zilpyUrl = zilpyUrl_address + searchInfo.address + zilpyUrl_bedrooms + searchInfo.bedrooms + zilpyUrl_bathrooms + searchInfo.bathrooms;
	console.log('Sample URL for Zilpy:', zilpyUrl);

	http.get( zilpyUrl, function (response) {
	    var body = '';
	    response.on('data', function (chunk) {
	      body += chunk;
	    });
	    response.on('end', function () {
	      //remove
	      //console.log('Zilpy data - BODY: ' + body);
		  	deferred.resolve(body);
	    });
	}); //end of http.get

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
    travelMode: google.maps.TravelMode."DRIVING",
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

	console.log('server.js says: reverseGeocode called.');
	console.log('address: ',address);
	console.log('googleAPIKey: ',keys.googleAPIKey);

	var gPlacesUrl = gPlacesUrl_address + address + gPlacesUrl_sensor;
	http.get( gPlacesUrl, function (response) {
		var body = '';
		response.on('data', function (chunk) {
			body += chunk;
		});
		response.on('end', function () {
			body = JSON.parse(body);
			console.log('Response from reverseGeocode:',typeof body);
			console.log('Content:', body);
			deferred.resolve(body);
		});
	}); //end of http.get

	return deferred.promise;
}




//-----------------------------------------------------------------------------------
//GET neighborhood list, given a particular latitude and longitude
/*Prerequisites:
	Street Address
  Website: Google places
*/







module.exports = app;
