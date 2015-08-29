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


module.exports = app;