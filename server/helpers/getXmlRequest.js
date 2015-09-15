var Q = require('q');
var request = require('request');
var parseString = require('xml2js').parseString;
module.exports = function (url) {
  var deferred = Q.defer()
  //remove
  // console.log('getRequest called. url:',url);
  request(url, function (error, response, body) {
    //remove
    // console.log('Response status:', response.statusCode);
    if(error) { console.log('Error for url:', url); deferred.reject("Not Available"); }
    if (!error && response.statusCode == 200) {
      parseString(body, function (err, result) {
        deferred.resolve(result);
      });
    }
    else { deferred.reject("Not Available"); }
  });
  return deferred.promise;
}