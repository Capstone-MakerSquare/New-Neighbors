var Q = require('q');
var getRequest = require('./getRequest.js');
// var keys = require('./../config/keys.js');
var _ = require('underscore');


//-----------------------------------------------------------------------------------
//GET INSTAGRAM pictures that are location specific
/*Input: Coordinates
  Output: imagesArray with links
*/
module.exports = function (coordinates) {
  var deferred = Q.defer();

  var instaUrl_accessToken = 'https://api.instagram.com/v1/media/search?access_token='
  var instaUrl_latitude = '&lat='
  var instaUrl_longitude = '&lng='
  var instaUrl_distance = '&distance=';

  var instaUrl = instaUrl_accessToken + keys.instagramAccessToken +
                 instaUrl_latitude + coordinates.latitude +
                 instaUrl_longitude + coordinates.longitude +
                 instaUrl_distance + 2000;

  //remove
  // console.log('instaUrl:', instaUrl);

  getRequest(instaUrl)
  .then(function (responseObj) {
    var results = responseObj.data;
    var imagesArray = [];

    //remove
    // console.log('getInstagram says: Response data fetched: ',results.length);

    _.each(results, function (result) {
      imagesArray.push({
        name: result.location.name,
        type: result.type,
        location: result.location,
        link: result.link,
        likes: result.likes,
        images: result.images,
        user: result.user
      });
    });

    deferred.resolve(imagesArray);
  });

  return deferred.promise;
}



