var Q = require('q');
var getRequest = require('./getRequest.js');
// var keys = require('./../config/keys.js');
var keys = {
  googleAPIKey: process.env.GOOGLE_KEY,
  zwsId: process.env.ZILLOW_KEY,
  instagramAccessToken: process.env.INSTAGRAM_KEY
}

//-----------------------------------------------------------------------------------
//GET distances and commute time from each neighborhood to user destination
/* INPUT: neighborhood object
   OUTPUT: neighborhood obj augmented with commute distance and time
*/
module.exports = function (neighborhoodObj, transitMode, userDestination) {
  var transitMode = transitMode || 'driving';
  var deferred = Q.defer();
  //remove
  // console.log('getDistances called.');

  //make an origins array
  var originsArr = [];
  var destination = '' + userDestination.coordinates.latitude + ',' +
                         userDestination.coordinates.longitude;
  var index = 0;


  var gDrivingUrl_origins = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=';    //lat,lng|lat,lng|lat,lng
  var gDrivingUrl_destinations = '&destinations=';
  var gDrivingUrl_mode = '&units=metric&mode=';
  var gDrivingUrl_key = '&key=';

  for (var neighborhood in neighborhoodObj) {
    originsArr.push(neighborhoodObj[neighborhood].latitude + ',' + neighborhoodObj[neighborhood].longitude);
  }

  var origins = originsArr.join('|');

  // remove
  // console.log('origins:',origins);
  // console.log('destination', destination);

  var gDrivingUrl = gDrivingUrl_origins + origins +
                    gDrivingUrl_destinations + destination +
                    gDrivingUrl_mode + transitMode +
                    gDrivingUrl_key + keys.googleAPIKey;

  // remove
  // console.log('gDrivingUrl:', gDrivingUrl);

  getRequest(gDrivingUrl)
  .then(function (distancesObj) {
    var distances = distancesObj.rows;
    var commuteObj = {};
    //remove
    // console.log('Number of rows:',distances.length);

    for(var neighborhood in neighborhoodObj) {

      var distance = distances[index].elements[0].distance.text;
      var time = distances[index].elements[0].duration.text;

      distance = +distance.split(' ')[0];
      time = +time.split(' ')[0];

      //remove
      // console.log('Distance:',distance);
      // console.log('Time:',time);

      commuteObj[neighborhood] = {
        commuteDistance : distance,
        commuteTime : time
      };

      index++;
    }

    deferred.resolve(commuteObj);
  });

  return deferred.promise;
}
