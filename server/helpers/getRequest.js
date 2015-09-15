var Q = require('q');
var request = require('request');
module.exports = function (url) {
  var deferred = Q.defer();
  //remove
  // console.log('getRequest called. url:',url);
  request(url, function (error, response, body) {
    //remove
    // console.log('Response status:', response.statusCode);
    if(error) { console.log('Error for url:', url); deferred.reject("Not Available"); }
    if (!error && response.statusCode == 200) { deferred.resolve(JSON.parse(body)); }
    else { deferred.reject("Not Available"); }
  });
  return deferred.promise;
}
