var express = require('express');
var middleware = require('./config/middleware.js');
var http = require('http');

app = express();
middleware(app,express);

app.use(express.static(__dirname + '/../client'));


//Handle a POST request
//api/getNeighbors
app.post('/api/getNeighbors', function (req, res) {
	console.log('server.js says: POST request received! Data:', req.body);
	var searchInfo = req.body;
});


module.exports = app;