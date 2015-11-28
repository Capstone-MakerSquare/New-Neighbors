var Q = require('q');
var getRequest = require('./getRequest.js');
var keys;

if (process.env.PORT) {
  keys = {
    googleAPIKey: process.env.GOOGLE_KEY,
    zwsId: process.env.ZILLOW_KEY,
    instagramAccessToken: process.env.INSTAGRAM_KEY
  }
} else {
  keys = require('../config/keys.js');
}

//-----------------------------------------------------------------------------------
//Get amenities for a given neighrbood for radii 0.5, 1.5 and 2.5 kilometers
/*Input: neighborhood Object
  Output: AmenitiesObject
*/
module.exports = function (coordinates) {
  var deferred = Q.defer();

  var amenitiesObj = {};
  var radius = 500;
  var types = 'airport|atm|bank|beauty_salon|book_store|cafe|car_rental|convenience_store|fire_station|food|gas_station|grocery_or_supermarket|gym|hospital|laundry|library|pharmacy|post_office|school|spa|store|subway_station|train_station|veterinary_care|amusement_park|aquarium|art_gallery|bar|bowling_alley|casino|movie_theatre|museum|night_club|park|restaurant|shopping_mall|stadium|university|zoo';

  var gAmenitiesUrl_location = 'https://maps.googleapis.com/maps/api/place/search/json?location=';
  var gAmenitiesUrl_radius = '&radius=';
  var gAmenitiesUrl_types = '&types=';
  var gAmenitiesUrl_key = '&key=';

  var gAmenitiesUrl_1 = gAmenitiesUrl_location + coordinates.latitude + ',' + coordinates.longitude + gAmenitiesUrl_radius;
  var gAmenitiesUrl_2 = gAmenitiesUrl_types + types + gAmenitiesUrl_key + keys.googleAPIKey;

  var numEvents = 0;

  //function to append amenities to amenities object
  var append = function (amenitiesArray) {
    for(var i=0; i<amenitiesArray.length; i++) {
      var amenity = amenitiesArray[i];
      amenitiesObj[amenity.name] = amenitiesObj[amenity.name] || amenity;
    }
  }

  //Fetch amenities for radii 500, 1500 and 2500
  for(var i=0; i<3; i++) {
    var gAmenitiesUrl = gAmenitiesUrl_1 + radius + gAmenitiesUrl_2;
    // console.log('gAmenitiesUrl:',gAmenitiesUrl);
    radius += 1000;

    getRequest(gAmenitiesUrl)
    .then(function (responseObj) {
      numEvents++;
      //remove
      // console.log('queryAmenities says: number of amenities:', responseObj.results.length);
      append(responseObj.results);

      if(numEvents === 3) {
        //remove
        // console.log('Total number of amenities:', Object.keys(amenitiesObj).length);

        deferred.resolve(amenitiesObj);
      }
    }, function (errorMessage) {
      numEvents++;
      if(numEvents === 3) { deferred.resolve(amenitiesObj); }
    });
  }

  return deferred.promise;
}