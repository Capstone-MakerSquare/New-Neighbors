var express = require('express');
var middleware = require('./config/middleware.js');
var http = require('http');
var Q = require('q');

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
		console.log('Response sent back to the client.');
	});
});


//-----------------------------------------------------------------------------------
//GET Rent estimate High/Low
/*Prerequisites:
	Street Address, Bedrooms, Bathrooms
  Website: zilpy.com
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
	      console.log('Zilpy data - BODY: ' + body);
		  deferred.resolve(body);
	    });
	}); //end of http.get

	return deferred.promise;
}

//-----------------------------------------------------------------------------------
//Determine driving times and distances
//for multiple origins to a single destination
//INPUT: array of origins as string name and/or latlong
//                           ['Mar Vista, CA', {lat: 34, lng: -118}]
//       destination as string name or lat/long object as above
//OUTPUT: results array of object for each origin:
//                           {name:, distance:, time:}

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


module.exports = app;

