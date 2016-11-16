var Q = require('q');
var getRequest = require('./getRequest.js');
var _ = require('underscore');
var keys;

if (process.env.PORT) {
  keys = {
    googleAPIKey: process.env.GOOGLE_KEY,
  }
} else {
  keys = require('../config/keys.js');
}


//-----------------------------------------------------------------------------------
//GET Google picture ids that are for given places
/*Input: Place IDs and max number of pics for the location
  Output: Picture ID array
*/
module.exports = function (placeId, maxPics) {
  var deferred = Q.defer();

  let picRefsArr = [];

  let placeDetail_path = 'https://maps.googleapis.com/maps/api/place/details/json?'
  let placeDetail_id = 'placeid=' + placeId;
  let placeDetail_key = '&key=' + keys.googleAPIKey;

  let placeDetailUrl = placeDetail_path + placeDetail_id + placeDetail_key;

  //remove
  // console.log('placeDetailUrl:', placeDetailUrl);

  getRequest(placeDetailUrl)
  .then(function (responseObj) {
    //remove
    let picRefsArr = responseObj.result.photos;
    // console.log('getPlaceDetail says: Response data fetched: ',picRefsArr);
    
    deferred.resolve(picRefsArr.slice(0,maxPics))


  }, function (errorMessage) {
    deferred.resolve(errorMessage);
  });

  return deferred.promise;
}



