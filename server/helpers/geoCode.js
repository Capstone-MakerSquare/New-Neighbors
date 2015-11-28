var Q = require('q');
var getRequest = require('./getRequest.js');
/*Input: address
  Output: geoCode = {
            latitude :
            longitude :
            place_id :
          }
*/
module.exports = function (address) {
  var deferred = Q.defer();
  var address = address;
  var gPlacesUrl_address = 'http://maps.googleapis.com/maps/api/geocode/json?address=';
  var gPlacesUrl_sensor = '&sensor=false';
  // console.log('server.js says: geoCode called.');
  // console.log('address: ',address);
  // console.log('googleAPIKey: ',keys.googleAPIKey);
  var gPlacesUrl = gPlacesUrl_address + address + gPlacesUrl_sensor;
  getRequest(gPlacesUrl)
  .then(function (coordinatesObj) {
    if(coordinatesObj.status === 'OK') {
      var results = coordinatesObj.results[0];
      var geoCode = {
        formattedAddress : results.formatted_address,
        placeId : results.place_id,
        coordinates : {
          latitude: results.geometry.location.lat,
          longitude: results.geometry.location.lng
        }
      };
      deferred.resolve(geoCode);
    }
    else {
      deferred.reject('Invalid Address.');
    }
  });
  return deferred.promise;
}
